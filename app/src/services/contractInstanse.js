import { ethers } from "ethers";

import { walletProxyAbi,smartWalletAbi } from "./abi";

const walletProxyAddress = "0x9DF57AFA1E5C6386b51B609d32757eA2609edE66";
//"0x2850E09678157fE78154a1069C129e68Ad2b67Dd"

export function getProxyContract(signer){
    const walletProxy = new ethers.Contract(walletProxyAddress,walletProxyAbi,signer)
    return walletProxy;
}

export function getSmartWalletContract(signer,wallet){
    const smartWallet = new ethers.Contract(wallet,smartWalletAbi,signer)
    return smartWallet;
}

