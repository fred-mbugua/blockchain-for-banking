module.exports = function(app, fredBlockchain, nodeAddress, rp) {//receiving "app", "blockchain", "nodeAddress" and "rp" instances
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
}

