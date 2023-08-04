// var express = require('express');
// var app = express();
const express = require('express');
const app = express();
const path = require('path');
let initial_path = path.join(__dirname, "blockexplorer");
let customer_interface_path = path.join(__dirname, "customer-interface");
//let to_dashboard_path = path.join(__dirname, "")

app.use(express.static(initial_path));
app.use(express.static(customer_interface_path));

const bodyParser = require('body-parser');
const port = process.argv[2]; //process.argv[2] accesses the port specified on package.json start script which is in index 2 of that command

//this library allows a node to make requests to all the other nodes in the network
const rp = require('request-promise');

//fetches json data and the data can be used in any of the routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));

//importing blockchain data structure
const Blockchain = require('./blockchain');
const fredBlockchain = new Blockchain();

//importing uuid library for creating a miners address, it creates a unique string which will be this network's node address
const { v4: uuidV4 } = require('uuid');
const { post } = require('request');
const nodeAddress = uuidV4().split('-').join('');

//path
// const path = require("path");
// let initial_path = path.join(__dirname, "block-explorer");

//fetching entire blockchain
app.get('/blockchain', function(req, res){
    res.send(fredBlockchain);
}); 

//creating a transaction
app.post('/transaction', function(req, res){
   const newTransaction = req.body;
   const blockNumber = fredBlockchain.addTransactionToPendingTransactions(newTransaction);
   
   res.json({note: `Transaction will be added in block ${blockNumber}.`});
});

//it will create a new transaction and broadcast the transaction to all the other nodes in the blockchain
app.post('/transaction/broadcast', function(req, res){
    const newTransaction = fredBlockchain.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);

    //add this transaction to the pending transactions array on this node
    fredBlockchain.addTransactionToPendingTransactions(newTransaction);

    //broadcasting
    const requestPromises = []; //array of promises
    fredBlockchain.networkNodes.forEach(networkNodeUrl => {
        //making requests to the transaction endpoint on all the other nodes in the network
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        }

        requestPromises.push(rp(requestOptions));
    });

    //running all the requests
    Promise.all(requestPromises).then(data => {
        res.json({note: 'Transaction created and broadcast successfully.'});
    });
})


//mining a new block
app.get('/mine', function(req, res){
    const previousBlock = fredBlockchain.getLastBlock();
    const previousBlockHash = previousBlock['hash'];
   
    const currentBlockData = {
        transactions: fredBlockchain.pendingTransactions,
        index: previousBlock['index'] + 1
    }

    const nonce = fredBlockchain.proofOfWork(previousBlockHash, currentBlockData);
    const newBlockHash = fredBlockchain.hashBlock(previousBlockHash, currentBlockData, nonce);

    const newBlock = fredBlockchain.createNewBlock(nonce, previousBlockHash, newBlockHash);

    //broadcasting new block
    const requestPromises = []; //array of request promises
    
    fredBlockchain.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: {newBlock: newBlock},
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises).then(data => {
        const requestOptions = {
            uri: fredBlockchain.currentNodeUrl + '/transaction/broadcast',
            method: 'POST',
            body: {
                //rewarding this block's miner, who operates this api network node
                //mining reward will be added to the next block, thus, when a new block is mined, there will be pendinmg transactions which is the miners reward
                amount: 200,
                sender: "MINER's REWARD",
                recipient: nodeAddress
            },
            json: true
        };
        return rp(requestOptions);
    }).then(data => {
        res.json({
            note: "New block has been mined and broadcast successfully",
            block: newBlock
        })
    }).catch( error => {
        // handling error
        console.log(error);
      })
});

app.post('/receive-new-block', function(req, res){
    const newBlock = req.body.newBlock;
    const lastBlock = fredBlockchain.getLastBlock();

    //correctHash variable checks if indeed the new block is legitimate by checking whether it's previous block hash equals this nodes' last block hash, if they are equal, then it's legitimate
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;

    //checking if the new block has the correct index which means that the new block should be one index above the last block in our chain
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

    if (correctHash && correctIndex) {
        fredBlockchain.chain.push(newBlock); //adding the new block to the chain after fulfilling legitimacy checks
        fredBlockchain.pendingTransactions = []; //clearing out all pending transactions
        res.json({
            note: 'New block received and accepted.',
            newBlock: newBlock
        });
    } else {
        res.json({
            note: 'New block rejected!',
            newBlock: newBlock
        });
    }
});


//end point that will make possible registering of nodes with the network by first registering the node to itself and then broadcasting the node to all the other networks
app.post('/register-and-broadcast-node', function(req, res){
    const newNodeUrl = req.body.newNodeUrl;
    if (fredBlockchain.networkNodes.indexOf(newNodeUrl) == -1) fredBlockchain.networkNodes.push(newNodeUrl);

    //array of promises
    const regNodesPromises = [];
    fredBlockchain.networkNodes.forEach(networkNodeUrl => {
        // './register-node' 
        const requestOptions = {
            url: networkNodeUrl + '/register-node',
            method: 'POST',
            body: {newNodeUrl: newNodeUrl},
            json: true
        };

        regNodesPromises.push(rp(requestOptions));
    });

    //below, the promise cycles through all the nodes that are already through the network and using requestOptions to make a request to each one, the requests shall be assyncronous
    
    Promise.all(regNodesPromises).then(data => {
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {allNetworkNodes: [...fredBlockchain.networkNodes, fredBlockchain.currentNodeUrl]},
            json: true
        };
 
        return rp(bulkRegisterOptions);
    })
    .then(data => {
        res.json({note: 'New node registered with network successfully.'});
    })
    .catch( error => {
        // handle error
        // console.log(error);
      })
});

//end point below will register a node with the network
app.post('/register-node', function(req,res){
    const newNodeUrl = req.body.newNodeUrl;
    
    //registering the newNodeUrl with the node that received this request
    const nodeNotAlreadyPresent = fredBlockchain.networkNodes.indexOf(newNodeUrl) == -1; //checks if the newNodeUrl is present in the network nodes array
    const currentNode = fredBlockchain.currentNodeUrl != newNodeUrl; //making sure the newnode url is not this active nodes url
    if(nodeNotAlreadyPresent && currentNode) fredBlockchain.networkNodes.push(newNodeUrl);

    res.json({note: "New node registered successfully."});
});

//end point will register multiple nodes at once, only hit by the new node that is being added
app.post('/register-nodes-bulk', function(req, res){
    const allNetworkNodes = req.body.allNetworkNodes;
    // console.log("req body: " + req.body.allNetworkNodes);
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlredyPresent = fredBlockchain.networkNodes.indexOf(networkNodeUrl) == -1; //checking whether the network node is already present in the allNetworkNodes array
        const notCurrentNode = fredBlockchain.currentNodeUrl !== networkNodeUrl;  //checking whether the url is the url for the current node
        if (nodeNotAlredyPresent && notCurrentNode) fredBlockchain.networkNodes.push(networkNodeUrl);
        // console.log('Network added............................');
    });

    res.json({note: "Bulk registration successful."});
});

//consensus endpoint
app.get('/consensus', function(req, res){
    //make a request inside every node and get a copy of the blockchain in that node and compare it to the copy in the current node
    const requestPromises = [];
    fredBlockchain.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises).then(blockchains => {

        const currentChainLength = fredBlockchain.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions = null;

        //longest chain rule algorithm
        blockchains.forEach(blockchain => {
            if (blockchain.chain.length > maxChainLength) {
                maxChainLength = blockchain.chain.length;
                newLongestChain = blockchain.chain;
                newPendingTransactions = blockchain.pendingTransactions;
            }
        });

        if (!newLongestChain || (newLongestChain && !fredBlockchain.chainIsValid(newLongestChain))){ //if there is no chain is longer than the one on this current node
            res.json({
                note: 'Current chain has not been replaced.',
                chain: fredBlockchain.chain
            });
        } else if(newLongestChain && fredBlockchain.chainIsValid(newLongestChain)){ //if there is a chain is longer than the one on this current node
            fredBlockchain.chain = newLongestChain;
            fredBlockchain.pendingTransactions = newPendingTransactions;

            res.json({
                note: 'This chain has been replaced.',
                chain: fredBlockchain.chain
            });
        }
    });
});

//users will be sending in a specific block hash and this endpoint will return the block that this hash corresponds to
app.get('/block/:blockHash', function(req, res){ //localhost:3001/block/HGJGFADSJDFHJKJDJKHDJ
    const blockHash = req.params.blockHash;
    const correctBlock = fredBlockchain.getBlock(blockHash);
    console.log(correctBlock);
    res.json({
        block: correctBlock
    });
});

//users will send in a transaction ID and in response expect to get the correct transaction that this ID corresponds to
app.get('/transaction/:transactionId', function(req, res) {
    const transactionId = req.params.transactionId;
    const transactionData = fredBlockchain.getTransaction(transactionId);
    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    })
});

//users will send a specific address and in response expect to get all of the transactions that have been made and correspond to this address; sent or received, plus the balance of this address
app.get('/address/:address', function(req, res){
    const address = req.params.address;
    const addressData = fredBlockchain.getAddressData(address);
    res.json({
        addressData: addressData
    });
});

// cusomer-interface endpoiunt
app.get('/fredblockchain', function(req, res) {
    // res.sendFile(path.join(initial_path, "ui.html"));
    // res.sendFile('./customer-interface/main.html', {root: __dirname}); //'{root: __dirname}' option says, look into the directory currently in and look for the file with the given path
    res.sendFile(path.join(customer_interface_path, "main.html"))
});

// cusomer-interface login endpoiunt
app.get('/fredblockchain-login', function(req, res) {
    // res.sendFile('./customer-interface/login.html', {root: __dirname}); //'{root: __dirname}' option says, look into the directory currently in and look for the file with the given path
    res.sendFile(path.join(customer_interface_path, "login.html"))
});

//file-explorer endpoint
app.get('/block-explorer', (req, res) => {
    res.sendFile(path.join(initial_path, "main.html"))
});

app.listen(port, function(){
    console.log('Listening on port ' + `${port}` + '...');
});