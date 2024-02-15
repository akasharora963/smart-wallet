const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, artifacts } = require("hardhat");

const SmartWallet = require("../artifacts/contracts/SmartWallet.sol/SmartWallet.json");

//const {ethers } = require("ethers")

describe("smart-wallet", function () {
  const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
  let account1;
  let walletProxyContract;
  before(async () => {
    [account1] = await ethers.getSigners();
    const walletProxy = await hre.ethers.getContractFactory("WalletProxy");
    walletProxyContract = await walletProxy.deploy();
    await walletProxyContract.waitForDeployment();
    console.log("Contract Address : ", await walletProxyContract.getAddress());
  });

  describe("wallet-proxy", function () {
    const salt =
      "0x616b617368000000000000000000000000000000000000000000000000000000";
    let wallet;

    it("Should create a new wallet", async function () {
      // Create a wallet for the user
      await walletProxyContract.connect(account1).createWallet(salt);

      console.log(
        "wallet : ",
        await walletProxyContract.userWallets(account1.address)
      );

      wallet = await walletProxyContract.userWallets(account1.address);

      // Check if user has a wallet
      expect(
        await walletProxyContract.userWallets(account1.address)
      ).to.not.equal(ADDRESS_ZERO);
    });

    it("Should not allow creating multiple wallets for the same user", async function () {
      // Try creating another wallet
      await expect(walletProxyContract.createWallet(salt)).to.be.revertedWith(
        "User already has a wallet"
      );
    });

    it("test", async function () {
      const contract = new ethers.Contract(wallet, SmartWallet.abi, account1);
      console.log(
        ((await contract.getBalance()).toString())*10**(-18),
        ((await ethers.provider.getBalance(account1.address)).toString())*10**(-18) 
      );
      // Send the transaction
      const txResponse = await account1.sendTransaction({
        to: wallet,
        value: ethers.parseEther("1"), // Convert ether to wei
      });
      await txResponse.wait();
      console.log("-->",txResponse.hash)
      console.log(
        ((await contract.getBalance()).toString())*10**(-18),
        ((await ethers.provider.getBalance(account1.address)).toString())*10**(-18) 
      );
     const tx = await walletProxyContract.connect(account1).destroyWallet(wallet);
     await tx.wait();
      console.log(
        ((await contract.getBalance()).toString())*10**(-18),
        ((await ethers.provider.getBalance(account1.address)).toString())*10**(-18) ,
        account1.address
      );
    });
  });
});
