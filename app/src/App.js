import { useState } from "react";
import { Smart } from "./components/Smart";
import { ethers } from "ethers";


function App() {
  // Connect to MetaMaskta
  const [account, setAccount] = useState("");
  const [signer,setSigner]= useState(null);

  async function connectToMetaMask() {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== "undefined") {
      try {
        // Create a MetaMask provider
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Request access to MetaMask
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Access the user's Ethereum address
        const accounts = await provider.listAccounts();
        const address = accounts[0];
        setAccount(address.address);
        //localStorage.setItem("account",address.address)
        const signer = await provider.getSigner(address.address);
        setSigner(signer)
        console.log("Connected to MetaMask with address:", address,signer);

        return provider;
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask not found. Please install MetaMask extension.");
    }
  }
  
 

  return (
    <div className="bg-lime-100 min-w-screen h-screen ">
      <div className="py-2 flex justify-end mx-12">
        {account ? (
          <div className="flex text-xl">
            <p className="text-3xl">Connected Account :</p>
            <p className=" text-white rounded-2xl flex py-2 px-8 bg-black">{account}</p>
          </div>
        ) : (
          <button
            className="bg-black text-white py-3 px-8 rounded-md"
            onClick={connectToMetaMask}
          >
            Connect
          </button>
        )}
      </div>
      <div className="flex justify-center items-center m-32">
        <Smart signer={signer} account={account}/>
      </div>
    </div>
  );
}

export default App;
