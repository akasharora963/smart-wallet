// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Import the smart wallet contract
import "contracts/SmartWallet.sol";
import "hardhat/console.sol";

contract WalletProxy {
    // Mapping to track each user's wallet contract address
    mapping(address => address) public userWallets;

    // Event emitted when a new wallet is created
    event WalletCreated(address indexed wallet, address indexed owner);

    // Function to create a new smart wallet
    function createWallet(bytes32  _salt) public {
        require(userWallets[msg.sender] == address(0), "User already has a wallet");

        // Deploy a new unique instance of the SmartWallet contract
        SmartWallet newWallet = new SmartWallet{salt : _salt}(msg.sender);
        
        // Map the user to their wallet contract address
        userWallets[msg.sender] = address(newWallet);
        
        console.log("new wallet",address(newWallet));
        // Emit an event to log the creation of the wallet
        emit WalletCreated(address(newWallet), msg.sender);
    }

    // Function to destroy a user's smart wallet
    function destroyWallet(address wallet) external {
        require(userWallets[msg.sender]!= address(0),"Smart wallet does not exists");

        address _owner = SmartWallet(payable (wallet)).owner();
        require(msg.sender == _owner, "Only the owner can destroy the wallet");

        console.log("owner here",_owner);

         // Call the destroy function of the user's wallet consetract
          // Call the destroy function of the user's wallet contract
        (bool success, ) = wallet.delegatecall(
            abi.encodeWithSignature("destroy(address)",_owner)
        );

        require(success,"Error in destroying wallet");
        
        // Remove the user's wallet from the mapping
        delete userWallets[msg.sender];
    }

    // Function to destroy a user's smart wallet
    function destroyWalletAndRedploy(address wallet,bytes32 _salt) external {
        require(userWallets[msg.sender]!= address(0),"Smart wallet does not exists");
        address _owner = SmartWallet(payable (wallet)).owner();
        require(msg.sender == _owner, "Only the owner can destroy the wallet");

         // Remove the user's old wallet from the mapping
        delete userWallets[msg.sender];

        // redeploy logic
        createWallet(_salt);

        address _newWallet = userWallets[msg.sender];
        
        // Call the destroy function of the user's wallet contract
        (bool success, ) = wallet.delegatecall(
            abi.encodeWithSignature("destroyAndTransfer(address,address)",_newWallet,_owner)
        );

        require(success,"Error in destroying wallet");
    }

   
}
