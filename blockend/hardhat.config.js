require("@nomicfoundation/hardhat-toolbox");
require("hardhat-dependency-compiler");
require("hardhat-contract-sizer");
require("./tasks");
const { networks } = require("./networks");

const REPORT_GAS =
  process.env.REPORT_GAS?.toLowerCase() === "true" ? true : false;

const SOLC_SETTINGS = {
  optimizer: {
    enabled: true,
    runs: 1_000,
  },
};
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: SOLC_SETTINGS,
      },
      {
        version: "0.8.7",
        settings: SOLC_SETTINGS,
      },
    ],
  },

  networks: {
    ...networks,
  },
  etherscan: {
    apiKey: {
      baseSepolia: networks.baseSepolia.verifyApiKey,
      chilizSpicy: networks.chilizSpicy.verifyApiKey,
      polygonAmoy: networks.polygonAmoy.verifyApiKey,
      flowTestnet: networks.flowTestnet.verifyApiKey,
      mantleTestnet: networks.mantleTestnet.verifyApiKey,
      scrollSepolia: networks.scrollSepolia.verifyApiKey,
      incoTestnet: networks.incoTestnet.verifyApiKey,
    },
    customChains: [
      {
        network: "baseSepolia",
        chainId: networks.baseSepolia.chainId,
        urls: {
          apiURL: networks.baseSepolia.verifyApiUrl,
          browserURL: networks.baseSepolia.blockExplorer,
        },
      },
      {
        network: "chilizSpicy",
        chainId: networks.chilizSpicy.chainId,
        urls: {
          apiURL: networks.chilizSpicy.verifyApiUrl,
          browserURL: networks.chilizSpicy.blockExplorer,
        },
      },
      {
        network: "polygonAmoy",
        chainId: networks.polygonAmoy.chainId,
        urls: {
          apiURL: networks.polygonAmoy.verifyApiUrl,
          browserURL: networks.polygonAmoy.blockExplorer,
        },
      },
      {
        network: "flowTestnet",
        chainId: networks.flowTestnet.chainId,
        urls: {
          apiURL: networks.flowTestnet.verifyApiUrl,
          browserURL: networks.flowTestnet.blockExplorer,
        },
      },

      {
        network: "mantleTestnet",
        chainId: networks.mantleTestnet.chainId,
        urls: {
          apiURL: networks.mantleTestnet.verifyApiUrl,
          browserURL: networks.mantleTestnet.blockExplorer,
        },
      },
      {
        network: "scrollSepolia",
        chainId: networks.scrollSepolia.chainId,
        urls: {
          apiURL: networks.scrollSepolia.verifyApiUrl,
          browserURL: networks.scrollSepolia.blockExplorer,
        },
      },
      {
        network: "incoTestnet",
        chainId: networks.incoTestnet.chainId,
        urls: {
          apiURL: networks.incoTestnet.verifyApiUrl,
          browserURL: networks.incoTestnet.blockExplorer,
        },
      },
    ],
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts",
  },
  mocha: {
    timeout: 200000,
  },
};
