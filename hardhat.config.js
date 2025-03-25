require("@nomicfoundation/hardhat-toolbox");
require("./tasks/configuration");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    fuji: {
      url: "",
      accounts: [""],
    },
    sonic: {
      url: "",
      accounts: [""],
    }
  }
};
