import os
import json
import hashlib
import datetime
import logging
import uvicorn
from enum import Enum
from typing import Dict, Any, Optional, List, Union, Literal
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field, field_validator
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from dotenv import load_dotenv
from dstack_sdk import AsyncTappdClient, DeriveKeyResponse, TdxQuoteResponse
from cdpMethods import cdp_handler, TransactionResult
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables and configure logging
load_dotenv()
logging.basicConfig(level=logging.INFO)

# Get API key from environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

app = FastAPI(title="Card Game AI API")
origins = [
    "http://localhost:3001",  # Add your frontend URL here
    "http://127.0.0.1:3001",  # Add other allowed origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
# Model Definitions
class Move(str, Enum):
    ATTACK = "attack"
    DRAW = "draw card"
    WAITING = "waiting for your move"
    DEFENDING = "defending"

class Player(BaseModel):
    id: int
    pace: int
    attack: int
    passing: int
    defence: int
    teamFanTokenAddress: str
    metadata: str

DeckSlot = Union[Player, Literal["empty"]]

class PreviousRound(BaseModel):
    prev_roundoutcome: str = Field(..., description="Outcome of the previous round: 'won', 'lost', 'draw', or 'start'")
    PlayerUsedinPrevRound: Union[Player, Literal["card drawn"]] = Field(..., description="Player used in previous round or 'card drawn'")

class Opponent(BaseModel):
    move: Move

class GameState(BaseModel):
    threadid: int = Field(..., description="Thread id of current session")
    round: int = Field(..., description="Current round number")
    previousround: PreviousRound
    opponent: Opponent
    availablemoves: List[Move]
    yourDeck: List[DeckSlot] = Field(..., description="Your deck of 7 cards, empty slots marked as 'empty'")

    @field_validator('yourDeck')
    @classmethod
    def validate_deck_size(cls, v):
        if len(v) != 7:
            raise ValueError('Deck must contain exactly 7 slots')
        return v

    @field_validator('yourDeck')
    @classmethod
    def validate_deck_slots(cls, v):
        for slot in v:
            if isinstance(slot, str) and slot != "empty":
                raise ValueError('String value in deck must be "empty"')
        return v

class AttestationDetails(BaseModel):
    deriveKey: Dict[str, str]
    tdxQuote: Dict[str, Any]

class AIResponseWithAttestation(BaseModel):
    threadid: int
    round: int
    move: Literal["attack", "draw card"]
    player: Union[Player, Literal["card drawn"]]
    attestation: AttestationDetails

    @field_validator('move')
    @classmethod
    def validate_move_type(cls, v):
        if v not in ["attack", "draw card"]:
            raise ValueError('Move must be either "attack" or "draw card"')
        return v

    @field_validator('player')
    @classmethod
    def validate_player(cls, v, info):
        move = info.data.get('move')
        if move == "attack" and isinstance(v, str):
            raise ValueError('Must provide player object when attacking')
        if move == "draw card" and v != "card drawn":
            raise ValueError('Must provide "card drawn" when drawing card')
        return v

# LangChain Configuration
model = ChatOpenAI(
    model="gpt-3.5-turbo",
    temperature=0.2
)

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """You are an AI playing a card game. Your primary task is to analyze the deck and choose the best move.

DECK ANALYSIS (DO THIS FIRST):
1. Count the number of actual players in your deck
2. If you have 7 players (no "empty" slots), you MUST:
   - Set move to "attack"
   - Choose the player with highest attack value
   - Include the complete player object

MOVE SELECTION RULES:
- Full deck (7 players): ALWAYS attack with best player
- Has empty slots: Can either attack or draw
- If only Defend is available, choose player with highest defence

When choosing a player:
1. Prioritize highest attack value during attack and highest defence during defending
2. Use pace as tiebreaker
3. Sometimes attacking might be a better strategy than drawing a card

YOU MUST ATTACK WITH A PLAYER WHEN DECK IS FULL!"""
    ),
    MessagesPlaceholder(variable_name="messages"),
])

json_schema = {
    "title": "game_turn",
    "description": "Details of the current round move in the game.",
    "type": "object",
    "properties": {
        "threadid": {
            "type": "integer",
            "description": "The same threadid from the input"
        },
        "round": {
            "type": "integer",
            "description": "The current round number"
        },
        "move": {
            "type": "string",
            "enum": ["attack", "draw card"],
            "description": "The action taken this round"
        },
        "player": {
            "oneOf": [
                {
                    "type": "object",
                    "properties": {
                        "id": {"type": "integer"},
                        "pace": {"type": "integer"},
                        "attack": {"type": "integer"},
                        "passing": {"type": "integer"},
                        "defence": {"type": "integer"},
                        "teamFanTokenAddress": {"type": "string"},
                        "metadata": {"type": "string"}
                    },
                    "required": ["id", "pace", "attack", "passing", "defence", "teamFanTokenAddress", "metadata"]
                },
                {
                    "type": "string",
                    "enum": ["card drawn"]
                }
            ],
            "description": "The player used in the round or 'card drawn'"
        }
    },
    "required": ["threadid", "round", "move", "player"]
}

structured_llm = model.with_structured_output(json_schema)

def call_model(state: MessagesState):
    """Invoke the structured model chain."""
    chain = prompt | structured_llm
    response = chain.invoke(state)
    response_str = json.dumps(response)
    return {"messages": [AIMessage(content=response_str)]}

# Set up the workflow graph
workflow = StateGraph(state_schema=MessagesState)
workflow.add_edge(START, "model")
workflow.add_node("model", call_model)

# Set up memory persistence
memory = MemorySaver()
app_chain = workflow.compile(checkpointer=memory)

@app.post("/game/move", response_model=AIResponseWithAttestation)
async def make_move(game_state: GameState, background_tasks: BackgroundTasks):
    try:
        # Generate initial move
        empty_slots = sum(1 for slot in game_state.yourDeck if slot == "empty")
        deck_is_full = (empty_slots == 0)
        deck_status = "DECK IS FULL - YOU MUST ATTACK" if deck_is_full else "Deck has empty slots"
        modified_state = game_state.model_dump()
        modified_state["deck_status"] = deck_status
        game_state_json = json.dumps(modified_state)
        input_messages = [
            HumanMessage(content=f"{deck_status}. Game state: {game_state_json}")
        ]
        config = {"configurable": {"thread_id": str(game_state.threadid)}}
        output = app_chain.invoke({"messages": input_messages}, config)
        ai_response = json.loads(output["messages"][-1].content)

        # Handle deck-is-full case
        if deck_is_full and ai_response["move"] != "attack":
            best_player = max(
                [p for p in game_state.yourDeck if isinstance(p, dict)],
                key=lambda x: (x["attack"], x["pace"])
            )
            ai_response = {
                "threadid": game_state.threadid,
                "round": game_state.round,
                "move": "attack",
                "player": best_player
            }

        # Add deck position for attack moves
        if isinstance(ai_response["player"], dict):
            deck_positions = {
                str(player): i for i, player in enumerate(game_state.yourDeck)
                if isinstance(player, dict)
            }
            player_str = str(ai_response["player"])
            ai_response["player"]["deck_position"] = deck_positions.get(player_str, 0)

        # Create event log
        event_log = {
            "game_event": "move_execution",
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "game_data": {
                "thread_id": game_state.threadid,
                "round": game_state.round,
                "move_type": ai_response["move"],
                "previous_outcome": game_state.previousround.prev_roundoutcome,
                "available_moves": game_state.availablemoves,
                "opponent_move": game_state.opponent.move
            },
            "move_verification": {
                "deck_status": "full" if deck_is_full else "has_empty_slots",
                "attestation_type": "TDX_QUOTE",
                "verification_status": "VERIFIED",
                "verification_message": "Move executed in verified TEE environment"
            }
        }

        if ai_response["move"] == "attack":
            event_log["player_data"] = {
                "player_id": ai_response["player"]["id"],
                "player_name": ai_response["player"]["metadata"],
                "attack_value": ai_response["player"]["attack"],
                "deck_position": ai_response["player"]["deck_position"]
            }
        else:
            event_log["player_data"] = {
                "action": "card_drawn",
                "deck_position": 0
            }

        # Hash the move data
        move_data = json.dumps(ai_response, sort_keys=True)
        move_hash = hashlib.sha256(move_data.encode()).hexdigest()
        event_log["move_verification"]["move_hash"] = move_hash

        # Get attestations
        client = AsyncTappdClient()
        
        # Get deriveKey attestation
        deriveKey = await client.derive_key('/', move_hash)
        derive_key_data = {
            "deriveKey": deriveKey.toBytes().hex(),
            "derive_32bytes": deriveKey.toBytes(32).hex()
        }

        # Get tdxQuote attestation
        tdxQuote = await client.tdx_quote(move_hash)
        tdx_quote_data = {
            "quote": tdxQuote.quote,
            "event_log": json.dumps(event_log)
        }

        # Create final response with attestation
        response_with_attestation = {
            **ai_response,
            "attestation": {
                "deriveKey": derive_key_data,
                "tdxQuote": tdx_quote_data
            }
        }

        # Execute transaction
        background_tasks.add_task(
            cdp_handler.send_game_transaction,
            ai_response["move"],
            game_state.threadid,
            ai_response["player"] if isinstance(ai_response["player"], dict) else {"deck_position": 0}
        )

        return AIResponseWithAttestation(**response_with_attestation)

    except Exception as e:
        logging.error(f"Error in make_move: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    """Root endpoint returning API information."""
    return {
        "message": "Card Game AI API",
        "version": "1.0",
        "endpoints": {
            "/game/move": "POST - Make an AI move based on game state"
        }
    }

@app.get("/wallet/status")
async def get_wallet_status():
    """Get wallet status and balance."""
    try:
        return await cdp_handler.get_wallet_balance()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/wallet/save")
async def save_wallet():
    """Save wallet seed."""
    try:
        return await cdp_handler.savewalletseed()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)