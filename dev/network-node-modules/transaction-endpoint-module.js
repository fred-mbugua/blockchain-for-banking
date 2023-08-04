module.exports = function(app, fredBlockchain) {
    //creating a transaction
    app.post('/transaction', function(req, res){
        const newTransaction = req.body;
        const blockNumber = fredBlockchain.addTransactionToPendingTransactions(newTransaction);
        
        res.json({note: `Transaction will be added in block ${blockNumber}.`});
    });
}