// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DonationContract is ERC721URIStorage, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Creator {
        address creatorAddress;
        uint256 creatorEarnings;
    }

    mapping(uint256 => Creator) public creators;

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        address artistAddress;
    }

    Donation[] public donations;
    uint256 public totalSupply;

    event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp, address indexed artistAddress);
    event NFTMinted(uint256 tokenId, address recipient, string metadataURI, address creator, uint256 creatorEarnings);

    constructor() ERC721("MusicMint", "MuMint") {}


    function donate(address _artistAddress) public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");

        Donation memory newDonation;
        newDonation.donor = msg.sender;
        newDonation.amount = msg.value;
        newDonation.timestamp = block.timestamp;
        newDonation.artistAddress = _artistAddress;

        donations.push(newDonation);

        emit DonationReceived(newDonation.donor, newDonation.amount, newDonation.timestamp, newDonation.artistAddress);
    }

    function getLastDonations() public view returns (Donation[] memory) {
        uint256 count = donations.length;
        uint256 resultLength = count > 10 ? 10 : count;

        Donation[] memory lastDonations = new Donation[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            lastDonations[i] = donations[count - resultLength + i];
        }

        return lastDonations;
    }

    function mintNFT(address recipient, string memory metadataURI, address creator, uint256 creatorEarnings) public onlyOwner {
        require(recipient != address(0), "Invalid recipient address");
        require(bytes(metadataURI).length > 0, "Invalid metadata URI");
        require(creator != address(0), "Invalid creator address");

        uint256 tokenId = totalSupply + 1;

        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, metadataURI);

        // Set the creator earnings
        creators[tokenId] = Creator({ creatorAddress: creator, creatorEarnings: creatorEarnings });

        totalSupply++;

        emit NFTMinted(tokenId, recipient, metadataURI, creator, creatorEarnings);
    }

}