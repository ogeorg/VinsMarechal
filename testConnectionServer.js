// http://forum.codecall.net/topic/74559-the-nodejs-part6-form-programming/
// http://stackoverflow.com/questions/15427220/how-to-handle-post-request-in-node-js
var express = require('express')
var logger = require('morgan');
// var util = require('util');
// var url = require('url');
var bodyParser = require('body-parser');

var routes = require('./testConnection/routesPg.js');
var Authentication = require('./testConnection/authentication');

console.log("starting app...");
console.log(process.env);

if (process.env.APP_SECRET === undefined) {
    require('dotenv').load();
}
var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/testConnection', express.static(__dirname + "/testConnection"));  // Serves /testConnection/client.js as ./client.js 

app.set('view options', { layout: false }); 
app.set('view engine', 'ejs'); 
app.set('views', __dirname + "/testConnection");

// API
app.post('/testConnection/data', routes.updateData);

// Pages
app.get('/testConnection/app', authenticate, routes.appWidget);
app.get('/testConnection/settings', authenticate, routes.appSetting);

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

