require("@nomicfoundation/hardhat-toolbox");
const { vars } = require("hardhat/config");

/** @type import('hardhat/config').HardhatUserConfig */
const INFURA_API_KEY = vars.get("INFURA_API_KEY");
const PRIVATE_KEY = vars.get("TEST_PK");

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
   
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${INFURA_API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`]
    },
  },

  
};
