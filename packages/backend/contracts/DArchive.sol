//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/Counters.sol";

contract DArchive {
    using Counters for Counters.Counter;

    event ArchiveAdded(
        uint256 ID,
        string contentID,
        string contentURI,
        string title,
        uint256 timestamp
    );

    Counters.Counter public totalArchives;
    mapping(string => bool) public archiveAdded;

    constructor() {}

    function addArchive(
        string calldata contentID,
        string calldata contentURI,
        string calldata title
    ) public {
        require(archiveAdded[contentID] == false, "Archive already exists");
        totalArchives.increment();
        emit ArchiveAdded(
            totalArchives.current(),
            contentID,
            contentURI,
            title,
            block.timestamp
        );
    }
}
