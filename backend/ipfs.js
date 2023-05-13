const IPFS = require('ipfs-core');
const fs = require('fs');

async function uploadFile(filePath, IPFSGateway='ipfs.io') {
    const file = fs.readFileSync(filePath)
    const ipfs = await IPFS.create()
    const result = await ipfs.add(file)
    console.log(result)
    console.log('https://' + IPFSGateway + '/ipfs/' + result.path)
    

}

async function IPFSInfuraPinCID(projectId, projectSecret, CID){
    const options = {
        host: 'ipfs.infura.io',
        port: 5001,
        path: `/api/v0/pin/add?arg=${CID}`,
        method: 'POST',
        auth: projectId + ':' + projectSecret,
    };
    
    let req = https.request(optionss, (res) => {
        let body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            console.log(body);
        });
    });
    req.end();
}