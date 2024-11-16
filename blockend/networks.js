require("@chainlink/env-enc").config();

const DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS = 3;

const PRIVATE_KEY = process.env.TEST_PRIVATE_KEY;

const accounts = [];
if (PRIVATE_KEY) {
  accounts.push(PRIVATE_KEY);
}
const LINEASCAN_API_KEY = process.env.LINEASCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

const aiAgent = "0xaab3FeEce86D7Ae8998Ed852C21b094C777d3bcF";

const nativeToUsdPriceFeedId =
  "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace";

const networks = {
  chilizSpicy: {
    url: "https://spicy-rpc.chiliz.com",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: "RANDOM",
    chainId: 88882,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "CHZ",
    verifyApiUrl: "https://spicy-explorer.chiliz.com/api",
    blockExplorer: "https://spicy-explorer.chiliz.com",
    mailbox: "0xa8ec309E062b0B986284c19a7A14AE2F1f4D4D0F",
    pythFeed: "0x23f0e8FAeE7bbb405E7A7C3d60138FCfd43d7509",
    pythEntropy: "0xD458261E832415CFd3BAE5E416FdF3230ce6F134",
    tokens: {
      acm: "0x87dd08be032a03d937F2A8003dfa9C52821cbaB9",
      bar: "0x45E50677f8DECa7CC582Ad573b525409d1233592",
      int: "0x34c00007cf1Ca7a3D9DccE8cF1D3f75B4db4d37e",
      juv: "0x634c9b919A484913C46362e2E0E700576920c994",
      mci: "0x660e2D9f26542957C7E819f91944d72Cfca32058",
      nap: "0x2452a4eEC9359Ff93C084ed5eD3E21eaC197586D",
      psg: "0xD82ee61aA30d018239350f9843cB8A4967B8b3da",
      tot: "0xD0b9383c34297bD7A9d01c2FA8Da22124dfE1Ec5",
    },
  },
  baseSepolia: {
    url: "https://base-sepolia.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: process.env.BASESCAN_API_KEY || "UNSET",
    chainId: 84532,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
    verifyApiUrl: "https://base-sepolia.blockscout.com/api",
    blockExplorer: "https://base-sepolia.blockscout.com",
    mailbox: "0xB127bd20bf4c7723148B588e10B5d3A1E2E86242",
    pythFeed: "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729",
    pythEntropy: "0x41c9e39574F40Ad34c79f1C99B66A45eFB830d4c",
  },
  polygonAmoy: {
    url: "https://rpc-amoy.polygon.technology",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: POLYGONSCAN_API_KEY,
    chainId: 80002,
    confirmations: 2,
    nativeCurrencySymbol: "POL",
    blockExplorer: "https://amoy.polygonscan.com",
    verifyApiUrl: "https://api-amoy.polygonscan.com/api",
    mailbox: "0x9288277372982b74C174132B5f43B9b1900855Fd",
    pythFeed: "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729",
    pythEntropy: "0x41c9e39574F40Ad34c79f1C99B66A45eFB830d4c",
  },
  scrollSepolia: {
    url: "https://sepolia-rpc.scroll.io",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: "RANDOM",
    chainId: 534351,
    confirmations: 2,
    nativeCurrencySymbol: "ETH",
    blockExplorer: "https://scroll-sepolia.blockscout.com",
    verifyApiUrl: "https://scroll-sepolia.blockscout.com/api",
    mailbox: "0xdBFf454c77307ccaA6c2762F9f515559f6d728D3",
    pythFeed: "0x41c9e39574F40Ad34c79f1C99B66A45eFB830d4c",
    pythEntropy: "0x0000000000000000000000000000000000000000",
  },
  flowTestnet: {
    url: "https://testnet.evm.nodes.onflow.org",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: "RANDOM",
    chainId: 545,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "FLOW",
    blockExplorer: "https://evm-testnet.flowscan.io/",
    verifyApiUrl: "https://evm-testnet.flowscan.io/api",
    mailbox: "0x09F1aF4e16728fcF340051055159F0f9D5e00b54",
    pythFeed: "0x2880aB155794e7179c9eE2e38200202908C17B43",
    pythEntropy: "0x0000000000000000000000000000000000000000",
  },
  mantleTestnet: {
    url: "https://endpoints.omniatech.io/v1/mantle/sepolia/public",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: "RANDOM",
    chainId: 5003,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "MNT",
    blockExplorer: "https://explorer.sepolia.mantle.xyz/",
    verifyApiUrl: "https://explorer.sepolia.mantle.xyz/api",
    mailbox: "", // TODO: Pending Deployment
    pythFeed: "0x98046Bd286715D3B0BC227Dd7a956b83D8978603",
    pythEntropy: "0x0000000000000000000000000000000000000000", // TODO: Mocks
  },
  incoTestnet: {
    url: "https://validator.rivest.inco.org/",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: "RANDOMMM",
    chainId: 21097,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "INCO",
    verifyApiUrl: "https://api.explorer.rivest.inco.org/api/eth-rpc",
    blockExplorer: "https://explorer.rivest.inco.org",
    mailbox: "0x09F1aF4e16728fcF340051055159F0f9D5e00b54",
    core: "0xCc22bA4DCC4E679861BeEcC2F8394F345D139cfa",
  },
};

module.exports = {
  networks,
  nativeToUsdPriceFeedId,
  aiAgent,
};
