const Web3 = require('web3');
const schedule = require('node-schedule');
const request = require('request');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const uuid = require('uuid');
const IPFS = require('ipfs-core');

// Global Vars
const STREAMING_API_URL='http://127.0.0.1:1985'
const STREAMING_SERVER_URL='http://127.0.0.1:8082'

// Init IPFS Node
const IPFSGateway='ipfs.io'
const ipfs = await IPFS.create()
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
    const recordingTimeSeconds = 60;
    const recordedAudioFilePath = fs.readFileSync(await recordAudio(recordingTimeSeconds, `${STREAMING_SERVER_URL}/${artistName}/${streamID}.mp3`));
    const contract_info = await contract.methods.getTopArtistDonation(streamID).call();
    if(contract_info['1'] == '0'){
        console.log('Nobody donated. Discarding recording: ' + recordedAudioFilePath);
    } else {
        console.log('Uplading to IPFS: ', audioFileCid);
        const audioFileCid = await uploadFileToIPFS(recordedAudioFilePath);
        await pinCidOnInfuraIPFS(infuraProjectId, infuraProjectSecret, audioFileCid);

        console.log('Starting to mint: ', recordedAudioFilePath);
        const imageForNFTURL = await getImageForNFTURL(artistName, streamID);
        const jsonObject = {
            "name": "artistName date stream",
            "description": "This unique audio was captured during the DJ stream of artist",
            "image": image,
            "audio": {
              "file": `https://${IPFSGateway}/ipfs/`,
              "title": "Sound of the Ocean",
              "artist": artistName,
              "duration": `00:00:${recordingTime}`,
              "genre": "Live Mix",
              "year": date
            }
          }        
          
          // Convert JSON object to a JSON string
          const jsonString = JSON.stringify(jsonObject);
          
          // Convert the JSON string to a Buffer
          const fileBuffer = Buffer.from(jsonString);
          
          // Upload the file to IPFS
          ipfs.add(fileBuffer, (err, result) => {
            if (err) {
              console.error('Error uploading JSON object to IPFS:', err);
            } else {
              const ipfsHash = result[0].hash;
              console.log('JSON object uploaded successfully. IPFS hash:', ipfsHash);
            }
          });
        const NFTCreator = streamID;
        const NFTReceiver = contract_info['0'];
        const mintingNFTResult = await contract.methods.mintNFT(NFTReceiver, mtd, NFTCreator).call();
    }
    fs.rmSync(recordedAudioFilePath) || true;
}

async function recordAudio(recordingDurationSeconds, sourceURL) {
    const outputFilePath = 'records/' + uuid.v4() + '.aac';
    ffmpeg(sourceURL)
        .noVideo()
        .audioChannels(2)
        .audioBitrate(128)
        .duration(recordingDuration)
        .on('end', function () { console.log('saved!'); })
        .on('error', function (err) { console.log('error: ', err); })
        .save(outputFilePath);
    return outputFilePath;
}

async function uploadFileToIPFS(filePath) {
    const file = fs.readFileSync(filePath)
    const result = await ipfs.add(file)
    return result.cid
}

async function pinCidOnInfuraIPFS(projectId, projectSecret, CID){
    const options = {
        host: 'ipfs.infura.io',
        port: 5001,
        path: `/api/v0/pin/add?arg=${CID}`,
        method: 'POST',
        auth: projectId + ':' + projectSecret,
    };
    let req = https.request(options, (res) => {
        let body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            console.log("Pinned on infura: ", body);
        });
    });
    req.end();
}

async function getImageForNFTURL(artistName, streamID){
    const date = new Date();
    const baseURL = "https://noun-api.com/beta/pfp?name=";
    const imageFormat = ".png";
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    
    return baseURL + artistName + streamID + year + month + day + hour + minute + imageFormat;
}
