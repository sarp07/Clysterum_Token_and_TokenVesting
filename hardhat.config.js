require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.21",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    },
    networks: {
      opbnbTestnet: {
        url: "https://opbnb-testnet.example-rpc.com",
        chainId: 5611,
        accounts: [process.env.PRIVATE_KEY]
      },
    }
  }
};
