import secrets
from typing import Dict, Any, Optional
from cdp import Wallet, Cdp
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import logging
import sys
from cdp.smart_contract import SmartContract

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('game_transactions.log')
    ]
)

class TransactionResult(BaseModel):
    success: bool
    transaction_hash: Optional[str] = None
    error: Optional[str] = None

class GameState(BaseModel):
    round: int
    threadid: int
    previousround: Dict[str, Any]
    opponent: Dict[str, Any]
    availablemoves: list
    yourDeck: list

class AIResponse(BaseModel):
    round: int
    move: str
    player: Dict[str, Any]

class CDPTransactionHandler:
    def __init__(self):
        load_dotenv()
        self.CDP_API_KEY_NAME = os.getenv('CDP_API_KEY_NAME')
        self.PRIVATE_KEY = os.getenv('PRIVATE_KEY', '').replace('\\n', '\n')
        
        if not self.CDP_API_KEY_NAME or not self.PRIVATE_KEY:
            logging.error("CDP credentials not properly configured")
            raise ValueError("CDP credentials not properly configured")
        
        Cdp.configure(self.CDP_API_KEY_NAME, self.PRIVATE_KEY)
        
        try:
            self.wallet = Wallet.fetch("f78aec33-4f59-4be6-a745-84fc455b1812")
            self.wallet.load_seed("my_seed.json")
            logging.info(f"CDP wallet initialized: {self.wallet.default_address.address_id}")
        except Exception as e:
            logging.error(f"Failed to initialize CDP wallet: {str(e)}")
            raise

    async def get_wallet_balance(self) -> Dict[str, Any]:
            """Get wallet balance and information."""
            try:
                address = self.wallet.default_address.address_id
                await self.check_and_fund_wallet();
                eth_balance = self.wallet.balance("eth")
                
                return {
                    "address": address,
                    "balance": str(eth_balance),
                    "network": self.wallet.network_id
                }
            except Exception as e:
                logging.error(f"Failed to get wallet info: {str(e)}")
                raise
    async def check_and_fund_wallet(self):
        try:
            balance = self.wallet.balance("eth")
            logging.info(f"Current balance: {balance} ETH")
            if balance <0.0001:
                faucet_tx = self.wallet.faucet()
                result = faucet_tx.wait()
                logging.info(f"Faucet transaction completed: {result.transaction_hash}")
                new_balance = self.wallet.balance("eth")
                logging.info(f"New balance: {new_balance} ETH")
                return True
            return False
        except Exception as e:
            logging.error(f"Faucet request failed: {str(e)}")
            return False
    async def send_game_transaction(self, move_type: str, thread_id: int, player_data: Dict[str, Any]) -> TransactionResult:
        try:
            await self.check_and_fund_wallet();
            contract_address = '0x09249908F451EAe8fF4612e3E2C4a0f574a114f4'
            balance = self.wallet.balance("eth")
            logging.info(f"Current balance before transaction: {balance} ETH")

            if move_type == "attack":
                card_index = int(player_data.get("deck_position", 0))
                logging.info(f"Sending ATTACK - ThreadID: {thread_id}, CardIndex: {card_index}")
                
                transaction = self.wallet.invoke_contract(
                    contract_address=contract_address,
                    method="makeMove",
                    args={
                        "threadId": str(thread_id),
                        "cardIndex": str(card_index)
                    },
                    abi=[{
                        "name": "makeMove",
                        "type": "function",
                        "stateMutability": "nonpayable",
                        "inputs": [
                            {"name": "threadId", "type": "uint256"},
                            {"name": "cardIndex", "type": "uint8"}
                        ],
                        "outputs": []
                    }]
                )
            else:  # Draw card
                random_bytes = secrets.token_bytes(32)
                random_number = '0x' + random_bytes.hex()
                logging.info(f"Starting DRAW - ThreadID: {thread_id}, RandomNumber: {random_number}")
                
                # Get entropy fee
                try:
                    entropy_fee = SmartContract.read(
                        network_id= 'base-sepolia',
                        contract_address='0x41c9e39574F40Ad34c79f1C99B66A45eFB830d4c',
                        method="getFee",
                        args={"provider":'0x6CC14824Ea2918f5De5C2f75A9Da968ad4BD6344'},
                        abi=[{
                                "inputs": [
                                    {
                                        "internalType": "address",
                                        "name": "provider",
                                        "type": "address"
                                    }
                                ],
                                "name": "getFee",
                                "outputs": [
                                    {
                                        "internalType": "uint128",
                                        "name": "feeAmount",
                                        "type": "uint128"
                                    }
                                ],
                                "stateMutability": "view",
                                "type": "function"
                            },],
                    )
                    logging.info(f"Retrieved entropy fee: {entropy_fee}")
                except Exception as e:
                    logging.error(f"Failed to get entropy fee: {str(e)}")
                    raise
                try:
                    transaction = self.wallet.invoke_contract(
                        contract_address=contract_address,
                        method="drawCard",
                        args={
                            "threadId": str(thread_id),
                            "randomNumber": random_number
                        },
                        abi=[{
                            "name": "drawCard",
                            "type": "function",
                            "stateMutability": "payable",
                            "inputs": [
                                {"name": "threadId", "type": "uint256"},
                                {"name": "randomNumber", "type": "bytes32"}
                            ],
                            "outputs": []
                        }],
                        amount=entropy_fee
                    )
                    logging.info("Draw transaction created successfully")
                except Exception as e:
                    logging.error(f"Failed to create draw transaction: {str(e)}")
                    raise
                
            result = transaction.wait()
            logging.info(f"Transaction completed - Hash: {result.transaction_hash}")
            return TransactionResult(success=True, transaction_hash=result.transaction_hash)

        except Exception as e:
            logging.error(f"Transaction failed: {str(e)}", exc_info=True)
            return TransactionResult(success=False, error=str(e))

    async def savewalletseed(self) -> Dict[str, Any]:
        try:
           file_path = "my_seed.json"
           self.wallet.save_seed(file_path, encrypt=True)
           logging.info(f"Seed for wallet {self.wallet.id} successfully saved to {file_path}.")
           return {
               "message": "Seed saved successfully",
                "path": file_path
            }
        except Exception as e:
            logging.error(f"Failed to save wallet seed: {str(e)}")
            raise

cdp_handler = CDPTransactionHandler()