var express = require('express');
var app = express();
const bodyParser = require('body-parser');

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


let port = 3000;
app.listen(port, function(){
    console.log('Listening on port ' + `${port}` + '...');
});