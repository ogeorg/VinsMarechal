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
app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/data'));

app.post("/login", function(req,res) {
    var email   =   req.body.email;
    var password  = req.body.password;
    res.json({"done":"yes"});
    // res.render('account');
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

/*
function MyForm(name, age)
{
    this.name = name;
    this.age = age;
}

function processPost(request, response, callback) 
{
    var queryData = "";
    if(typeof callback !== 'function') return null;

    if(request.method == 'POST') {
        request.on('data', function(data) {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            var data = qs.parse(queryData);
            callback(data);
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

app.post("/login", function(req,res) {
    var cb = function(data) {
        var form = new MyForm(data.name, data.age);
        var text = "Sent data are name:"+form.name+" age:"+form.age
        var link = "<p><a href='/'>To forms</a></p>";
        res.writeHead(200, "OK", {'Content-Type': 'text/html'});
        res.end(text + link);
    }
    processPost(req, res, cb);
});
*/

/*
function processGet(request, response, callback) 
{
    if(typeof callback !== 'function') return null;

    if(request.method == 'GET') {
        var url_parts = url.parse(request.url,true);
        var data = url_parts.query;
        callback(data);
    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}
app.get("/login", function(req,res) {
    var cb = function(data) {
        var form = new MyForm(data.name, data.age);
        var text = "Sent data are name:"+form.name+" age:"+form.age
        var link = "<p><a href='/'>To forms</a></p>";
        res.writeHead(200, "OK", {'Content-Type': 'text/html'});
        res.end(text + link);
    }
    processGet(req, res, cb);
});
*/

var server = app.listen(process.env.PORT, process.env.IP, function () 
{
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
