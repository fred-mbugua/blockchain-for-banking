module.exports = function(app, fredBlockchain, rp) {
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

        //below, the promise cycles through all the nodes that are already through the network and using requestOptions to make a request to each one, the requests shall be assyncronous
        
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
        })
        .catch( error => {
            // handle error
            // console.log(error);
        })
    });
}
