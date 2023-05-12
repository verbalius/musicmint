pragma solidity ^0.8.0;

contract DonationContract {
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }
    
    Donation[] public donations;
    
    event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp);
    
    function donate() external payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        Donation memory newDonation;
        newDonation.donor = msg.sender;
        newDonation.amount = msg.value;
        newDonation.timestamp = block.timestamp;
        
        donations.push(newDonation);
        
        emit DonationReceived(newDonation.donor, newDonation.amount, newDonation.timestamp);
    }
}