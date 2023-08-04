module.exports = function(app, fredBlockchain) {
    //end point below will register a node with the network
    app.post('/register-node', function(req,res){
        const newNodeUrl = req.body.newNodeUrl;
        
        //registering the newNodeUrl with the node that received this request
        const nodeNotAlreadyPresent = fredBlockchain.networkNodes.indexOf(newNodeUrl) == -1; //checks if the newNodeUrl is present in the network nodes array
        const currentNode = fredBlockchain.currentNodeUrl != newNodeUrl; //making sure the newnode url is not this active nodes url
        if(nodeNotAlreadyPresent && currentNode) fredBlockchain.networkNodes.push(newNodeUrl);

        res.json({note: "New node registered successfully."});
    });
}