// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MockContract {

    uint256 public value;
    event Received(address caller,uint256 value ,string message);

    function foo(string memory _message, uint _x) public payable returns (uint) {
        value = _x;
        emit Received(msg.sender, _x+1, _message);

        return _x + 1;
    }
}