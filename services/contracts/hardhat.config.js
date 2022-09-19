const dotenv = require("dotenv");

// load .env
dotenv.config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

require("hardhat-deploy");
require("hardhat-deploy-ethers");

const minimist = require("minimist");

function mergeConfigs(path) {
  const { parsed } = dotenv.config({
    path,
  });

  Object.keys(parsed).forEach((key) => {
    if ("" !== parsed[key]) {
      process.env[key] = parsed[key];
    }
  });
}

// override .env with specific .env.[network]
var argv = minimist(process.argv.slice(2));
const knownNetworks = ["rinkeby", "mainnet"];
if (argv.network && knownNetworks.indexOf(argv.network) !== -1) {
  mergeConfigs(`.env.${argv.network}`);
}

const accounts = [];
if (process.env.DEPLOYER_PKEY) {
  accounts.push(process.env.DEPLOYER_PKEY);
}
const networks = {};
knownNetworks.forEach((network) => {
  networks[network] = {
    url: process.env.PROVIDER_URL || "",
    accounts,
  };
});

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks,
  gasReporter: {
    namedAccounts: {
      deployer: {
        default: 0, // here this will by default take the first account as deployer
      },
      signer: {
        default: 1, // here this will by default take the second account as signer
      },
    },
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
  external: {
    deployments: {
      mainnet: ["node_modules/@0xdievardump/niftyforge/deployments/mainnet"],
      rinkeby: ["node_modules/@0xdievardump/niftyforge/deployments/rinkeby"],
      localhost: [
        "/home/dievardump/www/blockchain/niftyforge/contracts/deployments/localhost",
      ],
    },
  },
};
