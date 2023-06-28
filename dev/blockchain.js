const sha256 = require('sha256');

// A constructor function wil be used to create the blockchain data structure instead of a class because in js there really are no classes in js are a some of sugar cotting o0n top of constructor functions and prototypes
// class Blockchain {
//     constructor(){
//         this.chain = [];
//         this.pendingTransactions  = [];
//     }

//     //methods...
// }
function Blockchain(){
    this.chain = []; //this property stores the flesh of the blockchain i.e all the blocks that will be mined in this blockchain will be stored in this array
    this.pendingTransactions = []; //all new transactions created will be stored in this array before they are added to the blockchain 

    //below is the genesis block which is the first block in this blockchain
    this.createNewBlock(100, '0', 'GENESIS'); //the parameters are just arbitrary for this create genesis method
}

//The below the below method is it creates a new block, and inside this block, there are new transactions that have been created since the last block was mined, after creating the new block, previous transactions are cleared, the block is pushed into the blockchain and the new block is returned
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    //creating a new block object
    const newBlock = {
        //properties
        index: this.chain.length + 1, //this is the block number, describes which number this block is in the blockchain
        timestamp: Date.now(), //shows which time this block was created
        transactions: this.pendingTransactions , //when a new block is created, the transactions that are made in the block which are pending transactions are stored here
        nonce: nonce, // a nonce comes from a proof of work, it is a proof that this block was created in a legitimate way using a proof of work algorithm
        hash: hash, //will be the data from our new block. New transactions will be passed through a hashing function and be converted into a single string
        previousBlockHash: previousBlockHash //is data from the previous block to this one hashed into a single string
    };

    this.pendingTransactions  = []; //here the pendingTransactions  array is cleared out so that there can be a start over for the next block
    this.chain.push(newBlock); //pushes this new created block into the chain.

    return newBlock;
}

//below method will return the last block in the blockchain
Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1]; //position 'this.chain.length - 1' is the last block in the chain
}

//below method creates a new transaction
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient
    };

    this.pendingTransactions.push(newTransaction); //everytime a new transaction is created, it will be pushed to the new transaction array and are recoreded into the blockchain when a new block is created/mined-They are not validated and are just pending transactions

    return this.getLastBlock()['index'] + 1; //the number of the block that this transaction will be added to. This new transaction will be in the next created block when it's mined
}

//hashing blocks
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) { //this data passed as parameters will come from a single block in the chain
    //sha 256 will be in use here
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData); //JSON.stringify turns data into a string
    const hash = sha256(dataAsString);
    return hash;
}

//Proof of work method that is very important and essencial one that will make this blockchain very secure
/*
    How it works:
    1.Every block chain is a list of blocks
    2.Every single block has to be created and added to the chain
    3.But it's not good that every block created just gets added to the chain
    4.But that every block added to the chain is legitimate and has the correct transactions and correct data inside of it
    5.Because if it doesn't have the correct data, people could fake how many cash they have and esssentially cause fraud and steal money from other people
    6.So everytime a block is created, it must be ensured it is a legitimate block by mining it through proof of work
*/
/*
    What a proof of work actually does:
    1.Takes in the current block of data and the previous block hash
    2.From this data supplied, it will create a specific hash that starts with 4 zeros
    3.So the hashblock method will run many times until a hash with 4 zeros at the beginning is generated
    4.This means the nonce value will constantly be incrementing
    5.Now the reason this proof of work will secure the blockchain is because in order to generate the correct hash, the block method will run many many times, even upto tens of thousands and may result in using lots of computing power and lots of energy
    6.If somebody wanted to go back into the blockchain and try and change a block or try to change some data maybe to have some more cash, they would have to do a ton of calculations and use alot of energy to create the correct hash
    7.So, in most cases, going back and trying to recreate an already existing block or trying to re-mine an already existing block with your own data is not feasible
    8.Not only does the hash method take in the currentBlock data, but it also takes the previous block data and that means if someone was to recreate the data, that person also have to re-mine/re-create every single block that comes after the first one they re-created and this would take an incredible amount of energy and is not just feasible for a well-developed blockchain,  a person would have to go in, recreate a block by using a proof of work and then re-create every block after that by doing a new proof of work for every block.
    9.So this proof of work method will repeatedly hash the previous block hash and current block data and the nonce until it gets to an acceptable hash that starts with 4 zeros
*/
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData){
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while(hash.substring(0, 4) !== '0000'){
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        console.log(hash); //logging every hash generated in each iteration till the correct hash is found
    }

    return nonce; //equivalent to the number of iterations made till the correct hash is found
}

//exporting the Blockchain constructor function:
module.exports = Blockchain;