const Web3 = require('web3');

async function getContractInfo(contractAddress, contractAbi) {
    // Connect to Mumbai Polygon network
    const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc-mumbai.maticvigil.com/'));
    // Get contract instance
    const contract = new web3.eth.Contract(contractAbi, contractAddress);
    const result = await contract.methods.getLastDonations().call();
    // Call a contract method
    console.log(result);
}