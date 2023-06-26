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
Blockchain.prototype.hashBlock = function(blockData) {
    //sha 256 will be in use here 
}


//exporting the Blockchain constructor function:
module.exports = Blockchain;