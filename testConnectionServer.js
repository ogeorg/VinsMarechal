// http://forum.codecall.net/topic/74559-the-nodejs-part6-form-programming/
// http://stackoverflow.com/questions/15427220/how-to-handle-post-request-in-node-js
var express = require('express')
var logger = require('morgan');
// var util = require('util');
// var url = require('url');
var bodyParser = require('body-parser');

var Authentication = require('./testConnection/authentication');

console.log("starting app...");
// console.log(process.env);

if (process.env.APP_SECRET_VML === undefined) {
    require('dotenv').load();
}
var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view options', { layout: false }); 
app.set('view engine', 'ejs'); 
app.set('views', __dirname);

function authenticate(req, res, next, secret) {
    if (req.query.debug) {
        next();
    } else {
        var authentication = new Authentication(secret);
        authentication.authenticate(req, res, next);
    }
}

// ###################### testConnection ######################

function authenticate_TCN(req, res, next) { authenticate(req, res, next, process.env.APP_SECRET_TCN); }

var routes_TCN = require('./testConnection/routesPg');
routes_TCN.set('views prefix', 'testConnection/');

app.use('/testConnection', express.static(__dirname + "/testConnection"));  // Serves /testConnection/client.js as ./client.js 

// API
app.post('/testConnection/data', routes_TCN.updateData);

// Pages
app.get('/testConnection/app', authenticate_TCN, routes_TCN.appWidget);
app.get('/testConnection/settings', authenticate_TCN, routes_TCN.appSetting);

// ###################### vinsMarechal ######################

function authenticate_VML(req, res, next) { authenticate(req, res, next, process.env.APP_SECRET_VML); }

var appPrefix = '/vinsMarechal/';                                   // préfixe visible depuis le web
var modPrefix = 'vinsMarechal/';                                    // répertoire du module
var routes_VML = require('./' + modPrefix + '/routing');            // module de routing

// API
app.get('/vinsMarechal/vins', routes_VML.getVins);                  // retourne la liste des vins

app.get('/vinsMarechal/settingsData', routes_VML.getSettingsData);  // retourne la liste des vins, email, ...
app.post('/vinsMarechal/vins', routes_VML.updateSettingsData);      // actualise la liste des vins, email, ...
app.post('/vinsMarechal/commande', routes_VML.sendCommande);        // envoie la commande

// Pages
app.get('/vinsMarechal/app', authenticate_VML, routes_VML.appWidget);
app.get('/vinsMarechal/settings', authenticate_VML, routes_VML.settingsWidget);
app.use('/vinsMarechal', express.static(routes_VML.getWebPath()));  // Serves /vinsMarechal/web/client.js as ./client.js 

// foreman établit les variables d'env PORT et IP
var server = app.listen(process.env.PORT, process.env.IP, function () 
{
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

