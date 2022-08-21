//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/contracts/src/ERC2771Recipient.sol";

interface ISupporterNFT {
    function safeMint(address to) external;

    function setSupporterTokenURI(string memory uri) external;

    function burn(uint256 tokenId) external;

    function revoke(uint256 tokenId) external;

    function balanceOf(address owner) external view returns (uint256);
}

contract DArchive is ERC2771Recipient, Ownable {
    event ArchiveAdded(string contentID);
    error AlreadyArchived(string contentID);

    mapping(string => bool) public archiveAdded;
    ISupporterNFT public supporterNFT;

    constructor(address _trustedForwarder, address supporterNFTAddress) {
        _setTrustedForwarder(_trustedForwarder);
        supporterNFT = ISupporterNFT(supporterNFTAddress);
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

    function setSupporterTokenURI(string memory uri) public onlyOwner {
        supporterNFT.setSupporterTokenURI(uri);
    }

    function revoke(uint256 tokenId) external onlyOwner {
        supporterNFT.revoke(tokenId);
    }

    function withdraw(uint256 amount) external onlyOwner {
        if (address(this).balance >= amount) {
            (bool sent, ) = msg.sender.call{value: amount}("");
            require(sent, "Failed to send Ether");
        }
    }

    receive() external payable {
        if (supporterNFT.balanceOf(msg.sender) == 0) {
            supporterNFT.safeMint(msg.sender);
        }
    }
}
