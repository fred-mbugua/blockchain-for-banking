module.exports = function(app, fredBlockchain) {
    //end point will register multiple nodes at once, only hit by the new node that is being added
    app.post('/register-nodes-bulk', function(req, res){
        const allNetworkNodes = req.body.allNetworkNodes;
        // console.log("req body: " + req.body.allNetworkNodes);
        allNetworkNodes.forEach(networkNodeUrl => {
            const nodeNotAlredyPresent = fredBlockchain.networkNodes.indexOf(networkNodeUrl) == -1; //checking whether the network node is already present in the allNetworkNodes array
            const notCurrentNode = fredBlockchain.currentNodeUrl !== networkNodeUrl;  //checking whether the url is the url for the current node
            if (nodeNotAlredyPresent && notCurrentNode) fredBlockchain.networkNodes.push(networkNodeUrl);
            // console.log('Network added............................');
        });

        res.json({note: "Bulk registration successful."});
    });
}