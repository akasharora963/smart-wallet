// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "hardhat/console.sol";

contract SmartWallet {
    address public owner;
    address public wallet;

    constructor(address _owner) {
        owner = _owner;
        wallet = address(this);
    }

    receive() external payable {}

    // Function to delegate calls to another contract
    function execute(address to, uint256 value, bytes memory data) external returns (bytes memory result) {
        require(msg.sender == owner, "Caller is not the owner");

        // Delegate the call to the target contract
        (bool success, bytes memory returndata) = to.call{value: value}(data);
        
        require(success, "Call to target contract failed");

        // Return the result of the call
        return returndata;
    }

    // Function to transfer ownership of the wallet
    function transferOwnership(address newOwner) external {
        require(msg.sender == owner, "Only the owner can transfer ownership");
        owner = newOwner;
    }

    // Function to destroy the smart wallet
    function destroy(address _owner) external {
        require(msg.sender == _owner, "Only the owner can destroy the wallet");
        //selfdestruct(payable(owner));
        payable(_owner).transfer(address(this).balance);
    }

    // Function to destroy the smart wallet
    function destroyAndTransfer(address newWallet,address _owner) external {
        require(msg.sender == _owner, "Only the owner can transfer the wallet");
        //selfdestruct(payable(owner));
        payable(newWallet).transfer(address(this).balance);
    }

    // Function to send ether to a specified address
    function sendEther(address payable to, uint256 amount) external {
        require(msg.sender == owner, "Only the owner can send funds");

        // Send ether to the specified address
        require(address(this).balance >= amount, "Insufficient balance");
        (bool success, ) = to.call{value: amount}("");
        require(success, "Failed to send ether");
    }

    // Function to get the balance of the smart wallet
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
