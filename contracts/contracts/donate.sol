// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationContract {
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    Donation[] public donations;

    event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp);

    function donate() public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");

        Donation memory newDonation;
        newDonation.donor = msg.sender;
        newDonation.amount = msg.value;
        newDonation.timestamp = block.timestamp;

        donations.push(newDonation);

        emit DonationReceived(newDonation.donor, newDonation.amount, newDonation.timestamp);
    }

    function getLastDonations() public view returns (Donation[] memory) {
        uint256 count = donations.length;
        uint256 start = count > 5 ? count - 5 : 0;
        uint256 resultLength = count > 5 ? 5 : count;

        Donation[] memory lastDonations = new Donation[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            lastDonations[i] = donations[start + i];
        }

        return lastDonations;
    }
}