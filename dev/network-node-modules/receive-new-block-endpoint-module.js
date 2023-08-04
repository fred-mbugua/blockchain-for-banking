module.exports = function(app, fredBlockchain) {
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
}
