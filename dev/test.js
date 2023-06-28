//importing the Blockchain constructor function from blockchain.js
const Blockchain = require('./blockchain');

//making an insance of the blockchain constructor function
const fredBlockchain = new Blockchain();

// // fredBlockchain.createNewBlock(777, 'UIEWUUIHYURU', 'JKHGVFHJHJHKJ');
// // fredBlockchain.createNewBlock(7689, 'FGHDFH', 'HGHGHG');
// // fredBlockchain.createNewBlock(9098, 'JHKMHJK', 'GHBFDGD');

// // fredBlockchain.createNewBlock('78478', 'JFHEJHFUE', 'UFHEGHEF');
// // fredBlockchain.createNewTransaction(7, 'MOSESHJUUHJUH', 'FAITHDHJD');
// // fredBlockchain.createNewBlock('876', 'RRSWR', 'WFSFDD');

// // fredBlockchain.createNewTransaction(7, 'MOSEShhhHJUUHJUH', 'FAITHgfbDHJD');
// // fredBlockchain.createNewTransaction(8, 'MOSEShtghHJUUHJUH', 'FAInnbggfTHDHJD');
// // fredBlockchain.createNewTransaction(9, 'MOSESnbnHJUUHJUH', 'FAITnbgnHDHJD');

// // fredBlockchain.createNewBlock('789', 'RRhtrhSWR', 'WFSFgbDD');
// // console.log(fredBlockchain.chain[2]);

// //testing hashblock method
// const previousBlockHash = 'IEUFIEUFEIYF';
// const currentBlockData = [
//     {
//         amount: 10,
//         sender: 'GYEGYUEGYUFG',
//         recipient: 'HJFJEDHFUI'
//     },
//     {
//         amount: 100,
//         sender: 'DCFGYEGYUEGYUFG',
//         recipient: 'FDSAHJFJEDHFUI'
//     },
//     {
//         amount: 1000,
//         sender: 'FEDASFGYEGYUEGYUFG',
//         recipient: 'FDASHJFJEDHFUI'
//     }
// ];

// //using hashBlock() method
// //to verify that the nonce is correct, the nonce can be passed into the hashblock method and the generated hash should have 4 zeros
// console.log(fredBlockchain.hashBlock(previousBlockHash, currentBlockData, 9936));

//testing the genesis block
console.log(fredBlockchain);