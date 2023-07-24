const sha256 = require("sha256");
const currentNodeUrl = process.argv[3];

//importing uuid library for creating a unique ID for each transaction
const { v4: uuidV4 } = require("uuid");

class Blockchain {
  constructor() {
    this.chain = []; //this property stores the flesh of the blockchain i.e all the blocks that will be mined in this blockchain will be stored in this array
    this.pendingTransactions = []; //all new transactions created will be stored in this array before they are added to the blockchain

    this.currentNodeUrl = currentNodeUrl; //assigning the current node URL to the blockchain data structure
    this.networkNodes = []; //this will contain the urls of all the other nodes in the network so that each node will be aware of all the other nodes in the network

    //below is the genesis block which is the first block in this blockchain
    this.createNewBlock(100, "0", "GENESIS"); //the parameters are just arbitrary for this create genesis method
  }
  //The below the below method is it creates a new block, and inside this block, there are new transactions that have been created since the last block was mined, after creating the new block, previous transactions are cleared, the block is pushed into the blockchain and the new block is returned
  createNewBlock(nonce, previousBlockHash, hash) {
    //creating a new block object
    let time = new Date(Date.now());
    const newBlock = {
      //properties
      index: this.chain.length + 1,
      timestamp: `${time.getDate()}-${time.getMonth()}-${time.getFullYear()}-${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
      transactions: this.pendingTransactions,
      nonce: nonce,
      hash: hash,
      previousBlockHash: previousBlockHash, //is data from the previous block to this one hashed into a single string
    };

    this.pendingTransactions = []; //here the pendingTransactions  array is cleared out so that there can be a start over for the next block
    this.chain.push(newBlock); //pushes this new created block into the chain.

    return newBlock;
  }
  //below method will return the last block in the blockchain
  getLastBlock() {
    return this.chain[this.chain.length - 1]; //position 'this.chain.length - 1' is the last block in the chain
  }
  //below method creates a new transaction
  createNewTransaction(amount, sender, recipient) {
    const newTransaction = {
      amount: amount,
      sender: sender,
      recipient: recipient,
      transactionId: uuidV4().split("-").join(""), //unique transaction ID on every transaction made
    };

    return newTransaction;
  }
  //below method takes a transaction object and add it to the pending transactions of the blockchain
  addTransactionToPendingTransactions(transactionObj) {
    this.pendingTransactions.push(transactionObj);

    //returning index of the block that this transaction will be added to
    return this.getLastBlock()["index"] + 1;
  }
  //hashing blocks
  hashBlock(previousBlockHash, currentBlockData, nonce) {
    //sha 256 will be in use here
    const dataAsString =
      previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData); //JSON.stringify turns data into a string
    const hash = sha256(dataAsString);
    return hash;
  }
  //Proof of work method that is very important and essential one that will make this blockchain very secure
  /*
        How it works:
        1.Every block chain is a list of blocks
        2.Every single block has to be created and added to the chain
        3.But it's not good that every block created just gets added to the chain
        4.But that every block added to the chain is legitimate and has the correct transactions and correct data inside of it
        5.Because if it doesn't have the correct data, people could fake how much money/cash they have and esssentially cause fraud and steal money from other people
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
  proofOfWork(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== "0000") {
      nonce++;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
      // console.log(hash); //logging every hash generated in each iteration till the correct hash is found
    }

    return nonce; //equivalent to the number of iterations made till the correct hash is found
  }

  //method to validate the blockchain by comparing all of the hashes of all the blocks inside the chain
  chainIsValid(blockchain) {
    let validChain = true;

    //iterating through the entire chain
    for (var i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const previousBlock = blockchain[i - 1];
      const blockHash = this.hashBlock(
        previousBlock["hash"],
        {
          transactions: currentBlock["transactions"],
          index: currentBlock["index"],
        },
        currentBlock["nonce"]
      );

      //hashing every block and making sure every hash starts with zero else, the chain is not valid
      if (blockHash.substring(0, 4) !== "0000") validChain = false;

      //comparing the previousBlockHashh property on the current block with the hash property on the previous block
      if (currentBlock["previousBlockHash"] !== previousBlock["hash"])
        validChain = false;

      console.log("previousBlockHash =>", previousBlock["hash"]);
      console.log("currentBlockHash =>", currentBlock["hash"]);
    }

    //checking the 'GENESIS' block if its properties are correct; it will get checked independently since it's manually created and does not involve the proof of work method
    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock["nonce"] === 100;
    const correctPreviousBlockHash = genesisBlock["previousBlockHash"] === "0";
    const correctHash = genesisBlock["hash"] === "GENESIS";
    const correctTransactions = genesisBlock["transactions"].length === 0;

    if (
      !correctNonce ||
      !correctPreviousBlockHash ||
      !correctHash ||
      !correctTransactions
    )
      validChain = false;

    return validChain;
  }

  //get block method that returns the block from which a parsed/given hash was generated
  getBlock(blockHash){
    let correctBlock = null;

    this.chain.forEach(block => {
        if (block.hash === blockHash) correctBlock = block;
    });
    return correctBlock;
  }

  //get transaction method that returns transaction from a parsed/given transactionId
  getTransaction(transactionId) {

    let correctTransaction = null;
    let correctBlock = null;

    this.chain.forEach(block => { //iterating through blocks
        block.transactions.forEach(transaction => { //iterating through transactions in the current block
            if (transaction.transactionId === transactionId) { //checking if the parsed transaction Id equals the transaction id in this transaction
                correctTransaction = transaction;

                // sending the block that this transaction is in
                correctBlock = block;
            };
        });
    });

    return {
        transaction: correctTransaction,
        block: correctBlock
    };
  }

  //get all transactions associated with this address and put them into a single array
  getAddressData(address) {
    const addressTransactions = [];

    //looping through the transactions in the blockchain to see if there is one that has the sender or recipient as the parsed address and put the transaction into the addressTransactions array
    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if (transaction.sender === address || transaction.recipient === address) {
                addressTransactions.push(transaction);
            };
        });
    });

    //looping through the addressTransactions array to figure out what the balance of each address is
    let balance = 0;
    addressTransactions.forEach(transaction => {
        if (transaction.recipient === address) balance += transaction.amount;
        else if (transaction.sender === address) balance -= transaction.amount;
    });

    return {
        addressTransactions: addressTransactions,
        addressBalance: balance
    };
  };
}

//exporting the Blockchain constructor function:
module.exports = Blockchain;
