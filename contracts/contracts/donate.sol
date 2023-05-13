// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DonationContract is ERC721URIStorage, Ownable {

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        address artistAddress;
        bool claimed;
    }

    Donation[] public donations;
    uint256 public totalSupply;

    struct NFT {
        address recipient;
        string metadataURI;
        address artistAddress;
    }

    NFT[] public nfts;

    event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp, address indexed artistAddress);
    event NFTMinted(uint256 tokenId, address recipient, string metadataURI, address creator);
    event DonationClaimed(address indexed artistAddress, uint256 amount);

    constructor() ERC721("MusicMint", "MuMint") {}

    function donate(address _artistAddress) public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");

        Donation memory newDonation;
        newDonation.donor = msg.sender;
        newDonation.amount = msg.value;
        newDonation.timestamp = block.timestamp;
        newDonation.artistAddress = _artistAddress;
        newDonation.claimed = false;

        donations.push(newDonation);

        emit DonationReceived(newDonation.donor, newDonation.amount, newDonation.timestamp, newDonation.artistAddress);
    }

    function getLastDonations(address artistAddress) public view returns (Donation[] memory) {
        uint256 donationsCount = 0;
    
        for (uint256 i = 0; i < donations.length; i++) {
            if (donations[i].artistAddress == artistAddress) {
                donationsCount++;
            }
        }

        Donation[] memory lastDonations = new Donation[](donationsCount);

        uint256 index = 0;
        for (uint256 i = 0; i < donations.length; i++) {
            if (donations[i].artistAddress == artistAddress) {
                lastDonations[index] = donations[i];
                index++;
            }
        }

        return lastDonations;
    }

    function getTopArtistDonation(address artistAddress) public view returns (address, uint256) {
        uint256 highestDonation = 0;
        address highestDonor;
        uint256 donationTimestamp;

        for (uint256 i = 0; i < donations.length; i++) {
            if (donations[i].artistAddress == artistAddress && donations[i].amount > highestDonation && block.timestamp - donations[i].timestamp <= 1 minutes) {
                highestDonation = donations[i].amount;
                highestDonor = donations[i].donor;
                donationTimestamp = donations[i].timestamp;
            }
        }

        return (highestDonor, donationTimestamp);
    }


    function mintNFT(address recipient, string memory metadataURI, address creator) public onlyOwner {
        require(recipient != address(0), "Invalid recipient address");
        require(bytes(metadataURI).length > 0, "Invalid metadata URI");
        require(creator != address(0), "Invalid creator address");

        uint256 tokenId = totalSupply + 1;

        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, metadataURI);

        NFT memory newNFT;
        newNFT.recipient = recipient;
        newNFT.metadataURI = metadataURI;
        newNFT.artistAddress = creator;
        nfts.push(newNFT);

        totalSupply++;

        emit NFTMinted(tokenId, recipient, metadataURI, creator);
    }

    function getNFTs(address artistAddress) public view returns (NFT[] memory) {
        uint256 artistNFTCount = 0;

        for (uint256 i = 0; i < nfts.length; i++) {
            if (nfts[i].artistAddress == artistAddress) {
                artistNFTCount++;
            }
        }

        NFT[] memory artistNFTs = new NFT[](artistNFTCount);

        uint256 index = 0;
        for (uint256 i = 0; i < nfts.length; i++) {
            if (nfts[i].artistAddress == artistAddress) {
                artistNFTs[index] = nfts[i];
                index++;
            }
        }

        return artistNFTs;
    }

    function claim(address _artistAddress) public {
        require(_artistAddress != address(0), "Invalid artist address");

        uint256 totalClaimed = 0;

        for (uint256 i = 0; i < donations.length; i++) {
            if (donations[i].artistAddress == _artistAddress && !donations[i].claimed) {
                totalClaimed += donations[i].amount;
                donations[i].claimed = true;
            }
        }

        require(totalClaimed > 0, "No donations to claim");

        payable(_artistAddress).transfer(totalClaimed);

        emit DonationClaimed(_artistAddress, totalClaimed);
    }

}