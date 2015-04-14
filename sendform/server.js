// http://stackoverflow.com/questions/202605/repeat-string-javascript?lq=1
String.prototype.repeat = function(count) {
    if (count < 1) return '';
    var result = '', pattern = this.valueOf();
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
};

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


var pgMenus = require('./pgMenus');

var app = express();

// var logfile = fs.createWriteStream('./logfile.log', {flags: 'a'});
// app.use(express.logger({stream: logfile}));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
    pgMenus.getMenu(id, 
        function(row) {
            return res.json({
                success: true,
                menu: row
            });
        }, function(error) {
            return res.json({
                success: false,
                error: error
            });
        });
});

/*
 * Envoie les données d'une commande en json
 */
app.delete('/commande/:id', function (req, res) {
    var id = req.params.id;
    console.log("Deleting menu for id " + id);
    pgMenus.deleteMenu(id, 
        function(row) {
            return res.json({
                success: true
            });
        }, function(error) {
            return res.json({
                success: false,
                error: error
            });
        });
});

/*
 * Envoie les données d'une commande en json
 * Un json de confirmation est renvoyé
 */
app.post('/commande', function (req, res) {
    var data = req.body;
    var date = new Date();
    if (data.id) {
        pgMenus.updateMenu(data,
            function() {
                res.json({
                    success: true, 
                    message: "Commande modifiée à " + date, 
                    id: data.id});
            }, function(error) {
                res.json({
                    success: false, 
                    error: error});
            });
    } else {
        pgMenus.insertMenu(data,
            function(newId) {
                res.json({
                    success: true, 
                    message: "Commande ajoutée à " + date, 
                    id: newId});
            }, function(error) {
                res.json({
                    success: false, 
                    error: error});
            });
    }
});

/*
 * Envoie les données d'une commande en json
 */
app.get('/commandes', function (req, res) {
    pgMenus.getMenus(
        function(rows) {
            res.json({
                success: true, 
                menus: rows});
        }, function(error) {
            res.json({
                success: false,
                error: error
            });
        });
});

var mailer = require("../js/mailer")
        .use(process.env.EMAIL_SERVICE)
        .config(process.env.EMAIL_USER, process.env.EMAIL_PASS);

app.get('/sendconfirmation', function(req, res) {
    /*
    Obtenir les menus. Quand on les obtient:
        + Si ok: on formate et on envoie le mail. Quand on reçoit la réponse:
            + Si ok: on envoie res={success=true}
            + Si ko: on envoie res={success=false}
        + Si ko: on envoie res={success=false}
    */
    var subject = "Liste des menus";
    var options = {
       from: "My Name <me@example.com>", // sender address
       to: "Your Name <oliviergeorg@gmail.com>", // comma separated list of receivers
       subject: subject, // Subject line
       text: undefined, // plaintext body
       html: undefined, // html body
    };
    var titres = {id:"Id", notable:"Nº table", entree:"Entrée", principal:"Plat principal"};
    var getLineText= function(menu, lens) {
        var pad = lens.id - (""+menu.id).length;
        var text = " ".repeat(pad) + menu.id + " ";
        pad = lens.notable - (""+menu.notable).length;
        text += " ".repeat(pad) + menu.notable + " ";
        pad = lens.entree - menu.entree.length;
        text += " ".repeat(pad) + menu.entree + " ";
        pad = lens.principal - menu.principal.length;
        text += " ".repeat(pad) + menu.principal + " ";
        return text;
    };
    var getLineHtml = function(menu) {
        var html = "<tr>";
        html += "<td>" + menu.id + "</td>";
        html += "<td>" + menu.notable + "</td>";
        html += "<td>" + menu.entree + "</td>";
        html += "<td>" + menu.principal + "</td>";
        html += "</tr>\n";
        return html;
    };
    var onMenusOk = function(menus) {
        // On calcule les largeurs des colonnes, en commençant par les titres de colonnes
        var lens = Object.keys(titres).reduce(function(lens, t) {lens[t] = titres[t].length; return lens;}, {});
        lens = menus.reduce(function(lens, menu) {
            var l = (""+menu.id).length;
            if (lens.id < l) lens.id = l;
            l = (""+menu.notable).length;
            if (lens.notable < l) lens.notable = l;
            l = menu.entree.length;
            if (lens.entree < l) lens.entree = l;
            l = menu.principal.length;
            if (lens.principal < l) lens.principal = l;
            return lens;
        }, lens);

        // Titre principal du mail
        var text = "== "+subject+" ==\n";
        var html = "<h1>"+subject+"</h1><table>\n";

        // Header de la table
        text += getLineText(titres, lens) + "\n";
        html += getLineHtml(titres) + "\n";

        // Body de la table
        for(var m=0; m<menus.length; m++) {
            var menu = menus[m];
            text += getLineText(menu, lens) + "\n";
            html += getLineHtml(menu) + "\n";
        }
        html += "</table>";
        console.log(text);
        console.log(html);

        options.text = text;
        options.html = html;
        mailer.sendMail(options, function(error, info){
           if(error){
                res.json({
                    success: false,
                    error: error
                });
           } else {
                res.json({
                    success: true,
                    message: "Mail envoyé"
                });
           }
        });

    };
    var onMenusKo = function(error) {
        res.json({
            success: false,
            error: error
        });
    };
    pgMenus.getMenus(onMenusOk, onMenusKo);
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

