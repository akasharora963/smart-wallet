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
  let account1, account2, account3;
  let walletProxyContract;
  let mockContract;
  before(async () => {
    [account1, account2, account3] = await ethers.getSigners();
    const walletProxy = await hre.ethers.getContractFactory("WalletProxy");
    const mock = await hre.ethers.getContractFactory("MockContract");
    walletProxyContract = await walletProxy.deploy();
    await walletProxyContract.waitForDeployment();
    mockContract = await mock.deploy();
    await mockContract.waitForDeployment();
    console.log(
      "Contract Address of Wallet Proxy : ",
      await walletProxyContract.getAddress()
    );
    console.log(
      "Contract Address of Mock Contract : ",
      await mockContract.getAddress()
    );
  });

  describe("wallet-proxy", function () {
    const salt =
      "0x616b617368000000000000000000000000000000000000000000000000000000";

    const salt2 =
      "0x616b317368000000000000000000000000000000000000000000000000000000";

    let wallet;
    let contract;

    it("Should create a new wallet", async function () {
      // Create a wallet for the user
      console.log("Owner is Account 1 : ", account1.address);
      await walletProxyContract.connect(account1).createWallet(salt);

      wallet = await walletProxyContract.userWallets(account1.address);

      console.log("SmartWallet : ", wallet);

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

    it("should delegate call to another contract", async function () {
      contract = new ethers.Contract(wallet, SmartWallet.abi, account1);
      // Check if the call was delegated to the target contract
      const targetValue = await mockContract.value();
      // Call the execute function
      const mockAddress = await mockContract.getAddress();
      /*
        function Signature
        foo(string,uint256)
        ["call foo","123"]
      */
      const data =
        "0x24ccab8f0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000000863616c6c20666f6f000000000000000000000000000000000000000000000000";

      const result = await contract
        .connect(account1)
        .execute(mockAddress, data);

      // Assert that the call was successful
      expect(result).to.exist;
      expect(result.hash).to.exist;

      const newValue = await mockContract.value();

      expect(targetValue).to.not.equal(newValue);
      expect(newValue).to.equal(123);
    });

    it("Should add funds(2 ether) to smart wallet from account2", async function () {
      contract = new ethers.Contract(wallet, SmartWallet.abi, account1);

      // Send the transaction
      const txResponse = await account2.sendTransaction({
        to: wallet,
        value: ethers.parseEther("2"), // Convert ether to wei
      });
      await txResponse.wait();

      expect((await contract.getBalance()).toString() * 10 ** -18).to.equal(2);
    });

    it("Should transfer funds(1 ether) from smart wallet to account3", async function () {
      // Send the transaction
      let amount = ethers.parseEther("1");
      const txResponse = await contract
        .connect(account1)
        .sendEther(account3, amount);
      await txResponse.wait();

      expect((await contract.getBalance()).toString() * 10 ** -18).to.equal(1);
    });

    // it("Should destroy wallet", async function () {
    //   contract = new ethers.Contract(wallet, SmartWallet.abi, account1);

    //   const tx = await walletProxyContract
    //     .connect(account1)
    //     .destroyWallet(wallet);
    //   await tx.wait();

    //   expect((await contract.getBalance()).toString() * 10 ** -18).to.equal(0);
    // });

    it("Should destroy old wallet and recreate new wallet", async function () {
      contract = new ethers.Contract(wallet, SmartWallet.abi, account1);
      console.log("Old SmartWallet : ", wallet);
      const oldBalance = (await contract.getBalance()).toString() * 10 ** -18;

      const tx = await walletProxyContract
        .connect(account1)
        .destroyWalletAndRedploy(wallet, salt2);
      await tx.wait();

      const newWallet = await walletProxyContract.userWallets(account1.address);
      console.log("New SmartWallet : ", newWallet);
      let newContract = new ethers.Contract(
        newWallet,
        SmartWallet.abi,
        account1
      );

      expect((await newContract.getBalance()).toString() * 10 ** -18).to.equal(
        oldBalance
      );
    });
  });
});
