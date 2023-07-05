//importing the Blockchain constructor function from blockchain.js
const Blockchain = require('./blockchain');
// import Blockchain from './blockchain';

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
// console.log(fredBlockchain);

//testing chainIsValid() method
const bc1 = {
    "chain": [
    {
    "index": 1,
    "timestamp": 1688596721290,
    "transactions": [],
    "nonce": 100,
    "hash": "GENESIS",
    "previousBlockHash": "0"
    },
    {
    "index": 2,
    "timestamp": 1688596770437,
    "transactions": [],
    "nonce": 155758,
    "hash": "00009448fe56f2e6ccc682d1e654837ad98c6c44981606a08a4e1822ad1163d9",
    "previousBlockHash": "GENESIS"
    }
    ],
    "pendingTransactions": [
    {
    "amount": 200,
    "sender": "MINER's REWARD",
    "recipient": "2b357f42c3a94696bf05fa59922896d5",
    "transactionId": "f32cf7fdd96342dcbe434f8ccb761fcd"
    },
    {
    "amount": 3000,
    "sender": "PGGTJGFRJKIJHJHJGFHFJ",
    "recipient": "ERFDGSFDPOVYTYJHJLHGJHJ",
    "transactionId": "2f863f05fa99472586bd9c687d11444e"
    },
    {
    "amount": 1000,
    "sender": "PGGTJGFRJFDKIJHJHJGFHFJ",
    "recipient": "ERFDGSFDDSPOVYTYJHJLHGJHJ",
    "transactionId": "230bb40467fe40a08e9d0224d689c78a"
    }
    ],
    "currentNodeUrl": "http://localhost:3006",
    "networkNodes": []
    };


    console.log('VALID: '+ fredBlockchain.chainIsValid(bc1.chain));