const Web3 = require('web3');
const contract_info = require('./contract_info.js');
const record = require('./record.js');
const ipfs = require('./ipfs.js');

async function mintNFTFor(artistID,) {
    const sourceURL = `http://127.0.0.1:8080/live/${artistID}.aac`
    const recordedAudioFilePath = await record.recordAudio(recordingDurationSeconds = 10, sourceURL);
    
    
    ipfs.
}

await mintNFTFor(lolkek);

// const web3 = new Web3('https://rpc-mumbai.maticvigil.com');

// const privateKey = process.env.PRIVATE_KEY || 'k51qzi5uqu5dgk3paejboqvy6ojog9ikqrmr3pwkbtudf5xkt4181sj7leford';

// const contractABI = [];
// const contractAddress = 'YOUR_CONTRACT_ADDRESS';

// const contract = new web3.eth.Contract(contractABI, contractAddress);

// const uploadFile = async () => {
//   const fileUploadTx = await contract.methods.mint(tokenURI).send({ from: web3.eth.accounts.privateKeyToAccount(privateKey).address });
//   const tokenId = fileUploadTx.events.Transfer.returnValues[2];
//   const uploadTx = await contract.methods.setFile(tokenId, fileData).send({ from: web3.eth.accounts.privateKeyToAccount(privateKey).address });
//   console.log(`File uploaded to IPFS with hash ${uploadTx.events.FileUploaded.returnValues[0]}`);
// };

// uploadFile();
