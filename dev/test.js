//importing the Blockchain constructor function from blockchain.js
const Blockchain = require('./Blockchain');

//making an insance of the blockchain constructor function
const fredBlockchain = new Blockchain();

// fredBlockchain.createNewBlock(777, 'UIEWUUIHYURU', 'JKHGVFHJHJHKJ');
// fredBlockchain.createNewBlock(7689, 'FGHDFH', 'HGHGHG');
// fredBlockchain.createNewBlock(9098, 'JHKMHJK', 'GHBFDGD');

fredBlockchain.createNewBlock('78478', 'JFHEJHFUE', 'UFHEGHEF');
fredBlockchain.createNewTransaction(7, 'MOSESHJUUHJUH', 'FAITHDHJD');
fredBlockchain.createNewBlock('876', 'RRSWR', 'WFSFDD');

fredBlockchain.createNewTransaction(7, 'MOSEShhhHJUUHJUH', 'FAITHgfbDHJD');
fredBlockchain.createNewTransaction(8, 'MOSEShtghHJUUHJUH', 'FAInnbggfTHDHJD');
fredBlockchain.createNewTransaction(9, 'MOSESnbnHJUUHJUH', 'FAITnbgnHDHJD');

fredBlockchain.createNewBlock('789', 'RRhtrhSWR', 'WFSFgbDD');
console.log(fredBlockchain.chain[2]);