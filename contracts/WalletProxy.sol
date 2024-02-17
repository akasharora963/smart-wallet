// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Import the smart wallet contract
import "contracts/SmartWallet.sol";
import "hardhat/console.sol";

contract WalletProxy {
    // Mapping to track each user's wallet contract address
    mapping(address => address) public userWallets;
    mapping(bytes32 => bool) public walletExists;

    // Event emitted when a new wallet is created
    event WalletCreated(address indexed wallet, address indexed owner);
    event WalletDestroyed(address indexed wallet);
    event WalletReCreated(address indexed wallet, address indexed owner, address indexed newWallet);

    // Function to create a new smart wallet
    function createWallet(bytes32  _salt) public returns(address){
        require(userWallets[msg.sender] == address(0), "User already has a wallet");
        require(!walletExists[_salt] ,"Wallet with same salt already exists before");

        // Deploy a new unique instance of the SmartWallet contract
        SmartWallet newWallet = new SmartWallet{salt : _salt}(msg.sender);

        // Mark wallet as created
        walletExists[_salt] = true;
        // Map the user to their wallet contract address
        userWallets[msg.sender] = address(newWallet);
    
        // Emit an event to log the creation of the wallet
        emit WalletCreated(address(newWallet), msg.sender);
         // Return the address of the newly created wallet
        return address(newWallet);
    }

    // Function to destroy a user's smart wallet
    function destroyWallet(address wallet) external {
        require(userWallets[msg.sender]!= address(0),"Smart wallet does not exists");

        address _owner = SmartWallet(payable (wallet)).owner();
        require(msg.sender == _owner, "Only the owner can destroy the wallet");

         // Call the destroy function of the user's wallet consetract
        SmartWallet(payable(wallet)).destroy(msg.sender);
        
        // Remove the user's wallet from the mapping
        delete userWallets[msg.sender];

        emit WalletDestroyed(userWallets[msg.sender]);
    }

    // Function to destroy a user's smart wallet
    function destroyWalletAndRedploy(address wallet,bytes32 _salt) external {
        require(userWallets[msg.sender]!= address(0),"Smart wallet does not exists");
        address _owner = SmartWallet(payable (wallet)).owner();
        require(msg.sender == _owner, "Only the owner can destroy the wallet");

         // Remove the user's old wallet from the mapping
        delete userWallets[msg.sender];

        // redeploy logic
        address _newWallet = createWallet(_salt);
        
        // Call the destroy function of the user's wallet contract
        SmartWallet(payable(wallet)).destroyAndTransfer(_newWallet,_owner);

        emit WalletReCreated(wallet, _owner, _newWallet);
    }

   
}
