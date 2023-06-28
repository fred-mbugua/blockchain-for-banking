var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const port = process.argv[2]; //process.argv[2] accesses the port specified on package.json start script which is in index 2 of that command

//this library allows a node to make requests to all the other nodes in the network
// const rp = require('request-promise');
const rp = require('axios');
// import axios from 'axios';
//const axios = require('axios'); // legacy way

//fetches json data and the data can be used in any of the routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));

//importing blockchain data structure
const Blockchain = require('./blockchain');
const fredBlockchain = new Blockchain();

//importing uuid library for creating a miners address, it creates a unique string which will be this network's node address
const { v4: uuidV4 } = require('uuid');
const nodeAddress = uuidV4().split('-').join('');

//fetching entire blockchain
app.get('/blockchain', function(req, res){
    res.send(fredBlockchain);
}); 

//creating a transaction
app.post('/transaction', function(req, res){
    //blockNumber is the next block where this pending transaction will be added to
    const blockNumber = fredBlockchain.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({note: `Transaction will be added in block ${blockNumber}.`});
});

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

    //rewarding this block's miner, who operates this api network node
    fredBlockchain.createNewTransaction(200, "MINING REWARD", nodeAddress);

    const newBlock = fredBlockchain.createNewBlock(nonce, previousBlockHash, newBlockHash);
    res.json({
        note: "New block has been mined successfully",
        block: newBlock
    })
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

    //below, the promise cycles through all the nodes are already through the network and using requestOptions to make a request to each one, the requests shall be assyncronous
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
    });
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
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlredyPresent = fredBlockchain.networkNodes.indexOf(networkNodeUrl) == -1; //checking whether the network node is already present in the allNetworkNodes array
        const notCurrentNode = fredBlockchain.currentNodeUrl !== networkNodeUrl;  //checking whether the url is the url for the current node
        if (nodeNotAlredyPresent && notCurrentNode) fredBlockchain.networkNodes.push(networkNodeUrl);
    });

    res.json({note: "Bulk registration successful."});
});

// let port = 3000;
app.listen(port, function(){
    console.log('Listening on port ' + `${port}` + '...');
});