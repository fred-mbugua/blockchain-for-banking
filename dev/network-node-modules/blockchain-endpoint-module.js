module.exports = function(app, fredBlockchain) { //receiving "app" and "blockchain" instances
  //fetching entire blockchain
    app.get('/blockchain', function(req, res){
        res.send(fredBlockchain);
    }); 
}

