// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const walletProxy = await hre.ethers.getContractFactory("WalletProxy");
  const contract = await walletProxy.deploy();
  await contract.waitForDeployment();
  //Testnet address
  //0x9DF57AFA1E5C6386b51B609d32757eA2609edE66
  console.log("Contract Address : ",await contract.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
