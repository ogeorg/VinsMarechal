// http://forum.codecall.net/topic/74559-the-nodejs-part6-form-programming/
// http://stackoverflow.com/questions/15427220/how-to-handle-post-request-in-node-js

var http = require('http');
var util = require('util');
var fs = require('fs');
var qs = require('querystring');
var url = require('url');
var express = require('express');

var app = express();

// var logfile = fs.createWriteStream('./logfile.log', {flags: 'a'});
// app.use(express.logger({stream: logfile}));

app.use(express.logger());
app.use(express.bodyParser());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

/*
app.configure(function() {
  console.log("Configuring");
  app.use(express.bodyParser());
});
*/

/* Serves /client/...  */
app.use(express.static(__dirname + '/client'));
/* Serves /data/...  */
app.use(express.static(__dirname + '/data'));

app.post("/login", function(req,res) {
    var email   =   req.body.email;
    var password  = req.body.password;
    res.json({"done":"yes"});
    // res.render('account');
});

app.post("/settings", function(req, res) {
    var artFile = "data/articles2.json";
    var data = req.body;
    console.log("Recu les settings");
    console.log(data);
    var data = JSON.stringify(data, null, 4);
    console.log(data);
    fs.writeFile(artFile, data, function(err) {
        if(err) {
            console.log("error saving to " + artFile);
            res.json({"done":"no"});
        } else {
            console.log("JSON saved to " + artFile);
            res.json({"done":"yes"});
        }
    }); 
});

app.post("/commande", function(req,res) {
    var data = req.body;
    console.log("Recu une commande");
    console.log(data);
    var commande = data.commande;
    var total = 0;
    for(var i=0; i<commande.length; i++) {
        var art = commande[i];
        total += art.units * art.prixuni;
    }
    res.json({"done":"yes", "total": total});
});

var server = app.listen(process.env.PORT, process.env.IP, function () 
{
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
