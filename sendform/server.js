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

var pg = require('pg'),
    connStr = process.env.DATABASE_URL || 'pg://olivier:olivier@localhost:5432/olivier',
    client = new pg.Client(connStr);
client.connect();

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
app.get('/commande/:id', function (req, res) {
    var id = req.params.id;
    console.log("Getting menu for id " + id);
    if (id) {
        client.query(
            "SELECT * FROM commandesmenus WHERE id=$1",
            [id],
            function(error, result) {
                if (error) {
                    console.log(error);
                    return res.send(500);
                }
                if (result.rows.length == 0) return res.json({});
                var row = result.rows[0];
                return res.json(row);
            });
    } else {
        return res.send(500);
    }
});

/*
 * Envoie les données d'une commande en json
 * Un json de confirmation est renvoyé
 */
app.post('/commande', function (req, res) {
    var data = req.body;
    console.log(data);
    var message = "";
    var date = new Date();
    var success = false;
    if (data.id) {
        client.query(
            "UPDATE commandesmenus SET notable=$1, entree=$2, principal=$3 WHERE id=$4",
            [data.notable, data.entree, data.principal, data.id],
            function(err, result) {
                if (err) {
                    success = false;
                    message = err;
                    console.log(err);
                } else {
                    success = true;
                    message = "Commande modifiée à " + date;
                    console.log('row modified with id: ' + data.id);
                }

                console.log(">> post commande: success=" + success );
                res.json({"success":success, "message": message, "id": data.id});
            });
    } else {
        client.query(
            "INSERT into commandesmenus (notable, entree, principal) VALUES($1, $2, $3) RETURNING id",
            [data.notable, data.entree, data.principal],
            function(err, result) {
                if (err) {
                    success = false;
                    message = err;
                    console.log(err);
                } else {
                    success = true;
                    data.id = result.rows[0].id;
                    message = "Commande enregistrée à " + date;
                    console.log('row inserted with id: ' + data.id);
                }

                console.log(">> post commande: success=" + success );
                res.json({"success":success, "message": message, "id": data.id});
            });
    }
});

/*
 * Envoie les données d'une commande en json
 */
app.get('/commandes', function (req, res) {
    client.query(
        "SELECT * FROM commandesmenus",
        function(error, result){
            if (error) return res.send(500);
            if (result.rows.length == 0) return res.json(result.rows);
            result.rows.map(function(row){
                try {
                    row.data = JSON.parse(row.data);
                } catch (e) {
                    row.data = null;
                }
                return row;
            });
            res.json(result.rows);
        });
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

