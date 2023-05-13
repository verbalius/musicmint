const IPFS = require('ipfs-http-client');
const fs = require('fs');

async function uploadFileToIPFS(filePath) {
  const ipfs = await IPFS.create({ host: 'localhost', port: '5001', protocol: 'http' });
  const fileContent = fs.readFileSync(filePath);
  const filesAdded = await ipfs.add(fileContent);
  const ipfsLink = `https://ipfs.io/ipfs/${filesAdded.cid}`;
  console.log(`File uploaded to IPFS at: ${ipfsLink}`);
}

uploadFileToIPFS('test.wav');

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
