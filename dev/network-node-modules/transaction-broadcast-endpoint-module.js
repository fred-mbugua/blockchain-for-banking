module.exports = function(app, fredBlockchain, rp) {
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
}
