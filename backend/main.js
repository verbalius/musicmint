const Web3 = require('web3');
const schedule = require('node-schedule');
const request = require('request');
const fs = require('fs');
// const record = require('./record.js');
// const ipfs = require('./ipfs.js');

const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc-mumbai.maticvigil.com/'));
const contractAddress = '0xCC5349505847010c66aA667E91da8d3Ab309470A';
const abiData = fs.readFileSync('contractAbi.json', 'utf-8');
const contractAbiJson = JSON.parse(abiData);
const contract = new web3.eth.Contract(contractAbiJson, contractAddress);

// const scheduleRule = new schedule.RecurrenceRule();
// scheduleRule.second = 5;
// schedule.scheduleJob(scheduleRule, function(){
    const url = 'http://127.0.0.1:1985/api/v1/streams';
    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            console.log(data);
            data.streams.forEach(element => {
                console.log("stream id:", element.name)
                main(element.name);
            });
        } else {
            console.error(error);
        }
    });
    
// });

async function main(artistID) {
    const contract_info = await contract.methods.getTopArtistDonation(artistID).call();
    console.log(contract_info);
}

