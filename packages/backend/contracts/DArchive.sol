//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract DArchive {
    event ArchiveAdded(
        string contentID,
        string contentURI,
        string title,
        uint256 timestamp
    );
    mapping(string => bool) public archiveAdded;

    constructor() {}

    function addArchive(
        string calldata contentID,
        string calldata contentURI,
        string calldata title
    ) public {
        require(archiveAdded[contentID] == false, "Archive already exists");
        emit ArchiveAdded(contentID, contentURI, title, block.timestamp);
    }

    fallback() external payable {
        console.log("Fallback called");
    }

    receive() external payable {
        console.log("Receive called");
    }
}
