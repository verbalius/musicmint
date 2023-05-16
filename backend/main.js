require('dotenv').config();

const Web3 = require('web3');
const schedule = require('node-schedule');
const request = require('request');
const https = require('https');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const uuid = require('uuid');
const axios = require('axios');

// Global Vars
const recordingDuration = 59; //seconds
const STREAMING_API_URL = process.env.STREAMING_API_URL;
const STREAMING_SERVER_URL = process.env.STREAMING_SERVER_URL;
const NFT_STORAGE_TOKEN = process.env.NFT_STORAGE_TOKEN

// Certificate connection init block
const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc-mumbai.maticvigil.com/'));
const web3_account = web3.eth.accounts.privateKeyToAccount(process.env.ETH_PRIVATE_KEY);
const contractAddress = '0x56f0312E3a3ef06C6b085c952c497B719d268e65';
const abiData = fs.readFileSync('contractAbi.json', 'utf-8');
const contractAbiJson = JSON.parse(abiData);
const contract = new web3.eth.Contract(contractAbiJson, contractAddress);

console.log(new Date(), `Starting cycling every minute, recording ${recordingDuration}.`);
const streamingInfoURL = `${STREAMING_API_URL}/api/v1/streams`;

const job = schedule.scheduleJob('*/1 * * * *', ()=>{entrypoint();});
job.schedule()

async function entrypoint() {
    console.log('Cycle');
    let data = '';
    request.get(streamingInfoURL, async function (error, response, body) {
        if (!error && response.statusCode == 200) {
            data = JSON.parse(body);
            data.streams.forEach(element => {
                main(element.name, element.app);
            });
        } else {
            console.error(error);
        }
    })
}

async function main(streamID, artistName) {
    console.log("StreamID:",streamID,"ArtistName:",artistName);
    const date = new Date();
    console.log(date);
    const recordingTimeSeconds = recordingDuration;
    const recordedAudioFilePath = await recordAudio(recordingTimeSeconds, `${STREAMING_SERVER_URL}/${artistName}/${streamID}.mp3`)
    const recordedAudioFile = fs.readFileSync(recordedAudioFilePath);
    const contract_info = await contract.methods.getTopArtistDonation(streamID).call();
    if (contract_info['1'] == '0') {
        // when we call getTopArtistDonation we get this kind of JSON back
        // {
        //   "0": "<wallet address>",
        //   "1": "<timestamp>"
        // }
        // if the timestamp is 0 then this means that nobody had donated to the target wallet
        console.log('Nobody donated. Discarding recording: ' + recordedAudioFilePath);
    } else {
        //
        // Uploading the juice
        //
        const audioFileCid = await uploadToNFTStorage(recordedAudioFile, 'audio/mp3');

        //
        // Baking the metadata
        //
        const imageForNFT = await getImageForNFTURL(artistName, streamID, date);
        const imageForNFTCid = await uploadToNFTStorage(imageForNFT, 'image/svg+xml');
        const metadataJSON = {
            "name": `${artistName} stream unique part #${audioFileCid}`,
            "description": `This unique audio NFT was created during the DJ stream of artist ${artistName}`,
            "image": `ipfs://${imageForNFTCid}`,
            "version": "1",
            "title": `${artistName} stream unique part #${audioFileCid}`,
            "artist": artistName,
            "duration": 1,
            "mimeType": "audio/mp3",
            "losslessAudio": `ipfs://${audioFileCid}`,
            "trackNumber": 1,
            "license": "CC0",
            "locationCreated": "WEB 3",
            "external_url": `ipfs://${audioFileCid}`,
            "animation_url": `ipfs://${audioFileCid}`,
            "project": {
            "title": `${artistName} stream unique part #${audioFileCid}`,
            "artwork": {
            "uri": `ipfs://${audioFileCid}`,
            "mimeType": "dnb_logo/png",
            "nft": "nft"
            },
            "description": `This unique audio NFT was created during the DJ stream of artist ${artistName}`,
            "type": "nft",
            "originalReleaseDate": "05-13-2023",
            "recordLabel": "MusicMint",
            "publisher": "MusicMint",
            "upc": "03600029145"
            },
            "isrc": "CC-XXX-YY-NNNNN",
            "artwork": {
            "uri": `ipfs://${audioFileCid}`,
            "mimeType": "audio/mp3",
            "nft": "music nfts"
            },
            "lyrics": {
            "text": "Nft",
            "nft": "nft"
            },
            "visualizer": {
            "uri": `ipfs://${audioFileCid}`,
            "mimeType": "audio/mp3",
            "nft": "music nfts"
            }
        }

        const metadataJSONSting = JSON.stringify(metadataJSON);
        const metadataFileBuffer = Buffer.from(metadataJSONSting);
        const metadataIPFSCid = await uploadToNFTStorage(metadataFileBuffer, 'applicaton/json');
        const metadataIPFSUrl = `ipfs://${metadataIPFSCid}`;

        //
        // Minting
        // 
        const NFTCreator = streamID;
        const NFTReceiver = contract_info['0'];
        console.log("Reciver:", NFTReceiver);
        console.log("Metadata IPFS Url:", metadataIPFSUrl);
        console.log("Creator:", NFTCreator);

        const mintingNFTResult = await contract.methods.mintNFT(NFTReceiver, metadataIPFSUrl, NFTCreator).encodeABI();
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await contract.methods.mintNFT(NFTReceiver, metadataIPFSUrl, NFTCreator).estimateGas({ from: web3_account.address });;

        const transaction = {
            from: web3_account.address,
            to: contractAddress,
            data: mintingNFTResult,
            gasPrice: gasPrice,
            gas: gasEstimate
        };
        const signedTransaction = await web3.eth.accounts.signTransaction(transaction, process.env.ETH_PRIVATE_KEY);
        web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
            .on('transactionHash', (hash) => {
                console.log('Transaction hash:', hash);
            })
            .on('receipt', (receipt) => {
                console.log('Transaction receipt:', receipt);
            })
            .on('error', (error) => {
                console.error('Error:', error);
            });
    }
    fs.rmSync(recordedAudioFilePath);
}

async function recordAudio(recordingDurationSeconds, sourceURL) {
    const outputFilePath = 'records/' + uuid.v4() + '.mp3';
    console.log('Starting to record audio from ' + sourceURL);
    return new Promise((resolve, reject) => {
        ffmpeg(sourceURL)
            .noVideo()
            .audioChannels(2)
            .audioBitrate(128)
            .duration(recordingDurationSeconds)
            .on('end', () => {
                console.log('Recorded!',outputFilePath);
                resolve(outputFilePath);
            })
            .on('error', (err) => {
                return reject(new Error(err));
            })
            .save(outputFilePath);
    });
}

async function getImageForNFTURL(artistName, streamID, date) {
    const baseURL = "https://noun-api.com/beta/pfp?name=";
    const imageFormat = ".png";

    const year = date.getUTCFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');

    const imageOriginUrl = baseURL + artistName + year + month + day + hour + minute + imageFormat;;
    console.log(imageOriginUrl);
    const response = await axios.get(imageOriginUrl, { responseType: 'arraybuffer' });
    return response.data;
}

async function uploadToNFTStorage(fileData, contentType) {
    const nftStorageResponse = await axios.post('https://api.nft.storage/upload', fileData, {
        headers: {
            'Content-Type': contentType,
            Authorization: `Bearer ${NFT_STORAGE_TOKEN}`,
        },
    });
    return nftStorageResponse.data.value.cid;
}