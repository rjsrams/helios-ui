// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HelloHelios {
    string private message;

    constructor() {
        message = "Hello, Helios!";
    }

    function message() public view returns (string memory) {
        return message;
    }

    function updateMessage(string calldata newMessage) public {
        message = newMessage;
    }
}

