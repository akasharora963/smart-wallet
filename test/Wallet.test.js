const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const ethers2 = require("ethers")

describe("smart-wallet", function () {

  const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
  let owner, account1;
  let walletProxyContract;
  before(async () => {
    [owner, account1] = await ethers.getSigners();
    const walletProxy = await hre.ethers.getContractFactory("WalletProxy");
    walletProxyContract = await walletProxy.deploy();
    await walletProxyContract.waitForDeployment();
    console.log("Contract Address : ", await walletProxyContract.getAddress());
  });

  describe("wallet-proxy",function(){
    const salt = "0x616b617368000000000000000000000000000000000000000000000000000000"

    it("Should create a new wallet", async function () {
      // Create a wallet for the user
      await walletProxyContract.createWallet(salt);

      console.log("wallet : ",await walletProxyContract.userWallets(owner.address));
  
      // Check if user has a wallet
      expect(await walletProxyContract.userWallets(owner.address)).to.not.equal(ADDRESS_ZERO);
    });
  
    it("Should not allow creating multiple wallets for the same user", async function () {
      // Try creating another wallet 
      await expect(walletProxyContract.createWallet(salt)).to.be.revertedWith("User already has a wallet");
    });
  })
});
