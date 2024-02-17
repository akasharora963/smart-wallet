import { useEffect, useState } from "react";
import {
  getProxyContract,
  getSmartWalletContract,
} from "../services/contractInstanse";
import { ethers } from "ethers";
import swal from "sweetalert";

export const Smart = ({ signer, account }) => {
  const [walletAddr, setWalletAddr] = useState("");
  const [balance, setBalance] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState("");
  const [value, setValue] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [loader, setLoader] = useState(false);

  //const account = localStorage.getItem("account")

  useEffect(() => {
    async function fetchData() {
      console.log("Called");
      const proxyContract = getProxyContract(signer);
      const wallet = await proxyContract.userWallets(account);
      if (wallet !== "0x0000000000000000000000000000000000000000") {
        setWalletAddr(wallet);
        const walletContract = await getSmartWalletContract(signer, wallet);
        const balance = await walletContract.getBalance();
        setBalance(balance.toString() * 10 ** -18);
      } else {
        setWalletAddr("");
      }
    }
    if (signer) {
      setInterval(() => fetchData(), 1000);
    }
    return () => clearInterval();
  }, [account, signer]);

  async function createWallet(value) {
    const contract = await getProxyContract(signer);

    if (!contract || !value) return;

    try {
      // Call a method of the contract
      setLoader(true);
      const salt = value; //"0x616b917368000000000000000000000000000000000000000000000000000000";
      const tx = await contract.createWallet(salt);
      await tx.wait();

      console.log("Result:", tx);
      if (tx.hash) {
        swal(
          "Great Job",
          "Your Wallet has been created successfully",
          "success"
        );
        setValue("");
        setLoader(false);
      }
    } catch (error) {
      console.error("Error calling contract method:", error);
    }
  }

  async function destroyWallet() {
    const contract = await getProxyContract(signer);

    if (!contract) return;

    try {
      setLoader(true);
      const tx = await contract.destroyWallet(walletAddr);
      await tx.wait();

      console.log("Result:", tx);
      if (tx.hash) {
        swal(
          "Great Job",
          "Your Wallet has been destroyed successfully",
          "success"
        );
        setLoader(false);
      }
    } catch (error) {
      console.error("Error calling contract method:", error);
    }
  }

  async function recreateWallet(value) {
    const contract = getProxyContract(signer);

    if (!contract || !value) return;

    try {
      setLoader(true);
      const salt = value;
      //"0x616b317368000000000000000000000000000000000000000000000000000000";
      const tx = await contract.destroyWalletAndRedploy(walletAddr, salt);
      await tx.wait();

      console.log("Result:", tx);
      if (tx.hash) {
        swal(
          "Great Job",
          "Your new wallet has been successfully created, and the funds from your previous wallet have been transferred",
          "success"
        );
        setValue("");
        setLoader(false);
      }
    } catch (error) {
      console.error("Error calling contract method:", error);
    }
  }

  // Function to send Ether to MetaMask wallet
  async function addEther(value) {
    // Send Ether from another account to MetaMask wallet
    try {
      setLoader(true);
      const amount = ethers.parseEther(value);
      const tx = {
        to: walletAddr,
        value: amount, // Convert amount to wei
      };

      const txResponse = await signer.sendTransaction(tx);
      await txResponse.wait();
      console.log("Transaction sent:", txResponse.hash);
      if (txResponse.hash) {
        swal(
          "Great Job",
          `${value} funds has been added successfully to your wallet`,
          "success"
        );
        setValue("");
        setLoader(false);
      }
    } catch (error) {
      console.error("Error calling method:", error);
    }
  }

  async function sendEther(value, toAddress) {
    const contract = await getSmartWalletContract(signer, walletAddr);
    if (!contract) return;

    try {
      setLoader(true);
      const amount = ethers.parseEther(value);
      const tx = await contract.sendEther(toAddress, amount);
      await tx.wait();

      console.log("Result:", tx);
      if (tx.hash) {
        swal(
          "Great Job",
          `${value} funds has been transferred successfully to wallet ${toAddress}`,
          "success"
        );
        setValue("");
        setToAddress("");
        setLoader(false);
      }
    } catch (error) {
      console.error("Error calling contract method:", error);
    }
  }

  if (loader)
    return (
      <div className="relative flex justify-center items-center m-20">
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
        <img
          src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
          alt="loader"
          className="rounded-full h-28 w-28"
        />
      </div>
    );

  if (!loader)
    return (
      <div className="relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-[650px] h-[500px]">
        <div className="relative h-56 mx-4 -mt-6 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40">
          <img src="/wallet.png" alt="card" />
        </div>
        <div className="p-6">
          <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
            Smart Wallet
          </h5>
          <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
            Transforming User Experience to Web3
          </p>
        </div>
        <div className="p-6 pt-0 flex justify-center space-x-8">
          <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            type="button"
            onClick={() => {
              setShowModal(true);
              setAction("create");
            }}
            disabled={!account || walletAddr ? true : false}
          >
            Create
          </button>
          <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            type="button"
            onClick={() => {
              setShowModal(true);
              setAction("add");
            }}
            disabled={!account || !walletAddr ? true : false}
          >
            Add Funds
          </button>
          <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            type="button"
            onClick={() => {
              setShowModal(true);
              setAction("transfer");
            }}
            disabled={!account || !walletAddr ? true : false}
          >
            Transfer Funds
          </button>
          <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            type="button"
            onClick={destroyWallet}
            disabled={!account || !walletAddr ? true : false}
          >
            Destroy
          </button>
          <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            type="button"
            onClick={() => {
              setShowModal(true);
              setAction("recreate");
            }}
            disabled={!account || !walletAddr ? true : false}
          >
            Recreate
          </button>
        </div>
        {walletAddr ? (
          <div className="flex-col py-3">
            <p className="text-xl font-bold">SmartWallet : {walletAddr}</p>
            <p className="text-xl font-bold">Balance : {balance} Ether</p>
          </div>
        ) : (
          <p className="text-xl font-medium text-center">
            Wallet Does not Exists
          </p>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {action === "create" || action === "recreate"
                    ? "Enter Required Salt In Bytes32"
                    : "Enter Amount in Eth"}
                </h2>
              </div>

              <div>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md w-full px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter required salt or amout..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                {action === "transfer" && (
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md w-full px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Enter required address..."
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                  />
                )}
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 mr-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      switch (action) {
                        case "create": {
                          createWallet(value);
                          setShowModal(false);
                          break;
                        }
                        case "add": {
                          addEther(value);
                          setShowModal(false);
                          break;
                        }
                        case "transfer": {
                          sendEther(value, toAddress);
                          setShowModal(false);
                          break;
                        }
                        case "recreate": {
                          recreateWallet(value);
                          setShowModal(false);
                          break;
                        }
                        default:
                          setShowModal(false);
                          break;
                      }
                    }}
                    className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md focus:outline-none"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};
