//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract DArchive {
    event ArchiveAdded(string contentID, string contentURI);
    mapping(string => bool) public archiveAdded;

    constructor() {}

    function addArchive(string calldata contentID, string calldata contentURI)
        public
    {
        require(archiveAdded[contentID] == false, "Archive already exists");
        emit ArchiveAdded(contentID, contentURI);
    }
}
