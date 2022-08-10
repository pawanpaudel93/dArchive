//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/Counters.sol";

contract DArchive {
    using Counters for Counters.Counter;

    event ArchiveAdded(
        uint256 ID,
        string contentID,
        string contentURL,
        string title,
        uint256 timestamp
    );

    Counters.Counter public totalArchives;
    mapping(string => bool) public archiveAdded;

    constructor() {}

    function addArchive(
        string calldata contentID,
        string calldata contentURL,
        string calldata title
    ) public {
        require(archiveAdded[contentID] == false, "Archive already exists");
        totalArchives.increment();
        emit ArchiveAdded(
            totalArchives.current(),
            contentID,
            contentURL,
            title,
            block.timestamp
        );
    }
}
