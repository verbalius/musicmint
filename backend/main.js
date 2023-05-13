require('dotenv').config();

const Web3 = require('web3');
const schedule = require('node-schedule');
const request = require('request');
const https = require('https');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const uuid = require('uuid');
const IPFS = require('ipfs-core');

// Global Vars
const STREAMING_API_URL = 'http://127.0.0.1:1985'
const STREAMING_SERVER_URL = 'http://127.0.0.1:8082'

// const mainPath = path.join(__dirname, '..', process.env.npm_package_main);

// Init IPFS Node
const IPFSGateway = 'ipfs.io'
const infuraProjectId = process.env.INFURA_PROJECT_ID
const infuraProjectSecret = process.env.INFURA_PROJECT_SECRET

// Certificate connection init block
const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc-mumbai.maticvigil.com/'));
const contractAddress = '0xCC5349505847010c66aA667E91da8d3Ab309470A';
const abiData = fs.readFileSync('contractAbi.json', 'utf-8');
const contractAbiJson = JSON.parse(abiData);
const contract = new web3.eth.Contract(contractAbiJson, contractAddress);

// const scheduleRule = new schedule.RecurrenceRule();
// scheduleRule.second = 5;
// schedule.scheduleJob(scheduleRule, function(){
const url = `${STREAMING_API_URL}/api/v1/streams`;
request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        data.streams.forEach(element => {
            main(element.name, element.app);
        });
    } else {
        console.error(error);
    }
});
// });

async function main(streamID, artistName) {
    const recordingTimeSeconds = 10;
    const recordedAudioFilePath = await recordAudio(recordingTimeSeconds, `${STREAMING_SERVER_URL}/${artistName}/${streamID}.mp3`)
    const recordedAudioFile = fs.readFileSync(recordedAudioFilePath);
    const contract_info = { '0': '0xb79a97118Ce74D7BB1F96d54E89b9207412F53d3', '1': '1' } //await contract.methods.getTopArtistDonation(streamID).call();
    if (contract_info['1'] == '0') {
        console.log('Nobody donated. Discarding recording: ' + recordedAudioFile);
    } else {
        const date = new Date();
        console.log('Uplading to IPFS: ', recordedAudioFilePath);
        const ipfs = await IPFS.create();

        const audioFileOnIPFS = await ipfs.add(recordedAudioFile);
        const audioFileCid = audioFileOnIPFS.path;
        // await pinCidOnInfuraIPFS(infuraProjectId, infuraProjectSecret, audioFileCid);

        console.log('Starting to mint: ', recordedAudioFile);
        const imageForNFTURL = await getImageForNFTURL(artistName, streamID, date);
        const metadataJSON = {
            "name": `${artistName} stream unique part #${audioFileCid}`,
            "description": `This unique audio NFT was created during the DJ stream of artist on ${date.getUTCDate}`,
            "image": imageForNFTURL,
            "audio": {
                "file": `https://${IPFSGateway}/ipfs/${audioFileCid}`,
                "title": `${artistName} stream unique part ${date.getUTCDate}`,
                "artist": artistName,
                "duration": `00:00:${recordingTimeSeconds}`,
                "genre": "Live Mix",
                "year": date.getUTCFullYear
            }
        }
        const metadataJSONSting = JSON.stringify(metadataJSON);
        const metadataFileBuffer = Buffer.from(metadataJSONSting);
        const metadataOnIPFS = await ipfs.add(metadataFileBuffer);
        const metadataOnIPFSCid = metadataOnIPFS.path;
        // infura is experiencing downtimes
        // await pinCidOnInfuraIPFS(infuraProjectId, infuraProjectSecret, metadataOnIPFSCid);
        const metadataOnIPFSURL = `https://${IPFSGateway}/ipfs/${metadataOnIPFSCid}`;

        const NFTCreator = streamID;
        const NFTReceiver = contract_info['0'];
        const mintingNFTResult = await contract.methods.mintNFT(NFTReceiver, metadataOnIPFSURL, NFTCreator).call();
    }
    fs.rmSync(recordedAudioFilePath) || true;
}

async function recordAudio(recordingDurationSeconds, sourceURL) {
    const outputFilePath = 'records/' + uuid.v4() + '.mp3';
    return new Promise((resolve, reject) => {
        ffmpeg(sourceURL)
            .noVideo()
            .audioChannels(2)
            .audioBitrate(128)
            .duration(recordingDurationSeconds)
            .on('end', () => {
                resolve(outputFilePath);
            })
            .on('error', (err) => {
                return reject(new Error(err));
            })
            .save(outputFilePath);
    });
}

async function pinCidOnInfuraIPFS(projectId, projectSecret, CID) {
    const options = {
        host: 'ipfs.infura.io',
        port: 5001,
        path: `/api/v0/pin/add?arg=${CID}`,
        method: 'POST',
        auth: projectId + ':' + projectSecret,
    };
    return new Promise((resolve) => {
        let data = ''
        https.request(options, res => {
            res.on('data', chunk => { data += chunk })
            res.on('end', () => {
                console.log("Pinned on infura: ", body);
                resolve();
            })
        })
    })
}

async function getImageForNFTURL(artistName, streamID, date) {
    const baseURL = "https://noun-api.com/beta/pfp?name=";
    const imageFormat = ".png";

    const year = date.getUTCFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');

    return baseURL + artistName + streamID + year + month + day + hour + minute + imageFormat;
}
