// http://forum.codecall.net/topic/74559-the-nodejs-part6-form-programming/
// http://stackoverflow.com/questions/15427220/how-to-handle-post-request-in-node-js

var express = require('express'),
    logger = require('morgan'),
    http = require('http'),
    util = require('util'),
    fs = require('fs'),
    qs = require('querystring'),
    url = require('url'),
    bodyParser = require('body-parser');

var app = express();

// var logfile = fs.createWriteStream('./logfile.log', {flags: 'a'});
// app.use(express.logger({stream: logfile}));

app.use(logger('dev'));
app.use(bodyParser.urlencoded());

/*
 * Montre la page principale
 */
app.get('/', function (req, res) {
    res.sendFile("web/index.html", { root: __dirname });
});

/*
 * Renvoie le formulaire
 */
app.get('/formulaire.html', function (req, res) {
    console.log(">> formulaire")
    res.sendFile("web/formulaire.html", { root: __dirname });
});

/*
 * Renvoie la page de liste
 */
app.get('/liste.html', function (req, res) {
    res.sendFile("web/liste.html", { root: __dirname });
});

/*
 * Envoie les données d'une commande en json
 */
app.get('/commande', function (req, res) {
    // res.json({"done":"yes", "total": total});
});

/*
 * Envoie les données d'une commande en json
 * Un json de confirmation est renvoyé
 */
app.post('/commande', function (req, res) {
    // res.json({"done":"yes", "total": total});
});

/*
 * Envoie les données d'une commande en json
 */
app.get('/commandes', function (req, res) {
    // res.json({"done":"yes", "total": total});
});

/* Serves /web/client.js as /client.js  */
app.use(express.static(__dirname + '/web'));

// foreman établit les variables d'env PORT et IP
// console.log(process.env);
var server = app.listen(process.env.PORT, process.env.IP, function () 
{
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

