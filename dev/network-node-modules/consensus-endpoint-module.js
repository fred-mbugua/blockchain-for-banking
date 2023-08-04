module.exports = function(app, fredBlockchain, rp) { //receiving "app" and "blockchain" instances
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
}

