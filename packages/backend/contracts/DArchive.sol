//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/contracts/src/ERC2771Recipient.sol";

contract DArchive is ERC2771Recipient, Ownable {
    event ArchiveAdded(string contentID);
    error AlreadyArchived(string contentID);

    mapping(string => bool) public archiveAdded;

    constructor(address _trustedForwarder) {
        _setTrustedForwarder(_trustedForwarder);
    }

    function addArchive(string calldata contentID) public {
        if (archiveAdded[contentID]) {
            revert AlreadyArchived(contentID);
        }
        archiveAdded[contentID] = true;
        emit ArchiveAdded(contentID);
    }

    function setTrustedForwarder(address _trustedForwarder) public onlyOwner {
        _setTrustedForwarder(_trustedForwarder);
    }

    function _msgSender()
        internal
        view
        override(Context, ERC2771Recipient)
        returns (address sender)
    {
        sender = ERC2771Recipient._msgSender();
    }

    function _msgData()
        internal
        view
        override(Context, ERC2771Recipient)
        returns (bytes calldata)
    {
        return ERC2771Recipient._msgData();
    }

    function versionRecipient() external pure returns (string memory) {
        return "2.2.0";
    }
}
