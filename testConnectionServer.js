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

if (process.env.APP_SECRET === undefined) {
    require('dotenv').load();
}
var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view options', { layout: false }); 
app.set('view engine', 'ejs'); 
app.set('views', __dirname);

// ###################### testConnection ######################

var routesTC = require('./testConnection/routesPg');
routesTC.set('views prefix', 'testConnection/');

app.use('/testConnection', express.static(__dirname + "/testConnection"));  // Serves /testConnection/client.js as ./client.js 

// API
app.post('/testConnection/data', routesTC.updateData);

// Pages
app.get('/testConnection/app', authenticate, routesTC.appWidget);
app.get('/testConnection/settings', authenticate, routesTC.appSetting);

// ###################### vinsMarechal ######################

var appPrefix = '/vinsMarechal/';                           // préfixe visible depuis le web
var modPrefix = 'vinsMarechal/';                            // répertoire du module
var routesVM = require('./' + modPrefix + '/routing');      // module de routing

// API
app.get('/vinsMarechal/vins', routesVM.getVins);            // retourne la liste des vins
app.post('/vinsMarechal/vins', routesVM.updateVins);        // actualise la liste des vins
app.post('/vinsMarechal/commande', routesVM.sendCommande);  // envoie la commande

// Pages
app.get('/vinsMarechal/app', authenticate, routesVM.appWidget);
app.get('/vinsMarechal/settings', authenticate, routesVM.settingsWidget);
app.use('/vinsMarechal', express.static(routesVM.getWebPath()));  // Serves /vinsMarechal/web/client.js as ./client.js 

function authenticate(req, res, next) {
    if (req.query.debug) {
        next();
    } else {
        var authentication = new Authentication(process.env.APP_SECRET);
        authentication.authenticate(req, res, next);
    }
}

// foreman établit les variables d'env PORT et IP
var server = app.listen(process.env.PORT, process.env.IP, function () 
{
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

