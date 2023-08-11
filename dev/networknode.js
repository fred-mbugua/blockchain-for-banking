const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = {
    bcrypt,
    saltRounds,
}


let initial_path = path.join(__dirname, "blockexplorer");
let customer_interface_path = path.join(__dirname, "customer-interface");

app.use(express.static(initial_path));
app.use(express.static(customer_interface_path));

const bodyParser = require('body-parser');
const port = process.argv[2]; //process.argv[2] accesses the port specified on package.json start script which is in index 2 of that command

//this library allows a node to make requests to all the other nodes in the network
const rp = require('request-promise');

//fetches json data and the data can be used in any of the routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

//importing blockchain data structure
const Blockchain = require('./blockchain');
const fredBlockchain = new Blockchain();

//importing uuid library for creating a miners address, it creates a unique string which will be this network's node address
const { v4: uuidV4 } = require('uuid');
const { post } = require('request');
const nodeAddress = uuidV4().split('-').join('');

//requiring the db functions
const db = require('./postgres-db/queries');

//----IMPORTING MODULES----//
require('./network-node-modules/blockchain-endpoint-module')(app, fredBlockchain); //passing "app" and "blockchain" instances
require('./network-node-modules/consensus-endpoint-module')(app, fredBlockchain, rp); //passing "app", "blockchain" and "rp" instances
require('./network-node-modules/mining-endpoint-module')(app, fredBlockchain, nodeAddress, rp); //passing "app", "blockchain" and "rp" instances
require('./network-node-modules/receive-new-block-endpoint-module')(app, fredBlockchain); //passing "app" and "blockchain" instances
require('./network-node-modules/register-node-enpoint-module')(app, fredBlockchain); //passing "app" and "blockchain" instances
require('./network-node-modules/register-and-broadcast-endpoint-module')(app, fredBlockchain, rp); //passing "app", "blockchain" and "rp" instances
require('./network-node-modules/register-nodes-bulk-endpoint-module')(app, fredBlockchain); //passing "app" and "blockchain" instances
require('./network-node-modules/transaction-broadcast-endpoint-module')(app, fredBlockchain, rp); //passing "app", "blockchain" and "rp" instances
require('./network-node-modules/transaction-endpoint-module')(app, fredBlockchain); //passing "app" and "blockchain" instances
//-----END OF MODULES IMPORTS----//

//-----Users endpoints------------------//
app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/user/:address', db.getUserByAddress);
app.post('/users', db.createUser);
app.put('/users/:id', db.deleteUser);
app.delete('/users/:id', db.deleteUser);
app.post('/users/validate', db.loginUser);
//-----End of Users endpoints------------------//


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

//users will send a specific address and in response expect to get all of the pending transactions that have been made and correspond to this address; sent or received, plus the balance of this address
app.get('/pendingaddress/:address', function(req, res){
    const address = req.params.address;
    const addressData = fredBlockchain.getPendingTransactionsAddressData(address);
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

// cusomer-interface login endpoint
app.get('/fredblockchain-login', function(req, res) {
    // res.sendFile('./customer-interface/login.html', {root: __dirname}); //'{root: __dirname}' option says, look into the directory currently in and look for the file with the given path
    res.sendFile(path.join(customer_interface_path, "/access/login.html"))
});

// cusomer-interface login endpoiunt
app.get('/fredblockchain-signup', function(req, res) {
    res.sendFile(path.join(customer_interface_path, "/access/signup.html"))
});

//file-explorer endpoint
app.get('/block-explorer', (req, res) => {
    res.sendFile(path.join(initial_path, "main.html"))
});

//file-explorer endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "main.html"))
});

app.listen(port, function(){
    console.log('Listening on port ' + `${port}` + '...');
});
