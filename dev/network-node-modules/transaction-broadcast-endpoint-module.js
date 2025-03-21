module.exports = function(app, fredBlockchain, rp) {
    //it will create a new transaction and broadcast the transaction to all the other nodes in the blockchain
    app.post('/transaction/broadcast', function(req, res){
        let transactionCharges;
        let withdrawTotalAmount;
        let newWithdrawTransaction;
        
        if (req.body.charges !== undefined) {
            transactionCharges = req.body.charges;
            withdrawTotalAmount = Number(req.body.amount + (-transactionCharges));
            console.log("transactionCharges: "+transactionCharges)
            console.log("withdrawTotalAmount: "+withdrawTotalAmount)
            newWithdrawTransaction = fredBlockchain.createNewTransaction(withdrawTotalAmount, req.body.sender, req.body.recipient);
        }
        const newTransaction = fredBlockchain.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
        
        // console.log("Sending amount: "+req.body.amount)
        //checking if the address sending has the amount they want to send
        if ((req.body.amount < 0) && (req.body.sender !== req.body.recipient)) {
            res.json({note: 'The amount you are trying to send is less than zero; impossible!'});
        }else if ((req.body.amount == 0) && (req.body.sender !== req.body.recipient)) {
            res.json({note: 'You are trying to send zero as amount; impossible!'});
        }else if ((req.body.sender === req.body.recipient) && (req.body.amount < 0) && (transactionCharges === undefined)) {
            res.json({note: 'You are trying to deposit a negative value as amount; impossible!'});
        }else if ((req.body.sender === req.body.recipient) && (req.body.amount == 0) && (transactionCharges === undefined)) {
            res.json({note: 'You are trying to deposit zero as amount; impossible!'});
        }else if ((req.body.sender === req.body.recipient) && (transactionCharges === undefined)) { //this is a deposit transaction
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
        } else if ((req.body.sender === req.body.recipient) && (withdrawTotalAmount < 0) && (transactionCharges !== undefined)) { //this is a withdrawal transaction
            //add this transaction to the pending transactions array on this node---> This is a withdrawal transaction
            fredBlockchain.addTransactionToPendingTransactions(newWithdrawTransaction);

            //broadcasting
            const requestPromises = []; //array of promises
            fredBlockchain.networkNodes.forEach(networkNodeUrl => {
                //making requests to the transaction endpoint on all the other nodes in the network
                const requestOptions = {
                    uri: networkNodeUrl + '/transaction',
                    method: 'POST',
                    body: newWithdrawTransaction,
                    json: true
                }

                requestPromises.push(rp(requestOptions));
            });

            //running all the requests
            Promise.all(requestPromises).then(data => {
                res.json({note: 'Transaction created and broadcast successfully.', success: `You have Succesfully withdrawn Ksh.${Number(-req.body.amount)}. You charge is Ksh.${transactionCharges}.`});
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
