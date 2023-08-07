module.exports = function(app, fredBlockchain, rp) {
    //it will create a new transaction and broadcast the transaction to all the other nodes in the blockchain
    app.post('/transaction/broadcast', function(req, res){
        const newTransaction = fredBlockchain.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
        
        console.log("Sending amount: "+req.body.amount)
        //checking if the address sending has the amount they want to send
        if ((req.body.amount < 0) && (req.body.sender !== req.body.recipient)) {
            res.json({note: 'The amount you are trying to send is less than zero; impossible!'});
        }else if ((req.body.amount == 0) && (req.body.sender !== req.body.recipient)) {
            res.json({note: 'You are trying to send zero as amount; impossible!'});
        }else if ((req.body.sender === req.body.recipient) && (req.body.amount < 0)) {
            res.json({note: 'You are trying to deposit a negative value as amount; impossible!'});
        }else if ((req.body.sender === req.body.recipient) && (req.body.amount == 0)) {
            res.json({note: 'You are trying to deposit zero as amount; impossible!'});
        }else if (req.body.sender === req.body.recipient) {
            //add this transaction to the pending transactions array on this node---> This is a deposit transaction
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
                res.json({note: 'Transaction created and broadcast successfully.', success: `You have Succesfully deposited Ksh.${req.body.amount}.`});
            });
        } else if (req.body.sender !== req.body.recipient){
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
                res.json({note: 'Transaction created and broadcast successfully.', success: `You have Succeeded sending Ksh.${req.body.amount} to address: ${req.body.recipient}`});
            });
        }
        
    })
}
