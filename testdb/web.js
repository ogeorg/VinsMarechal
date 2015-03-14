var express = require('express'),
    logger = require('morgan'),
    pg = require('pg'),
    connStr = process.env.DATABASE_URL || 'pg://olivier:olivier@localhost:5432/olivier',
    start = new Date(),
    port = process.env.PORT || 3000,
    client;

// App express
var app = express();
app.use(logger('dev'));

// Un client pg se connecte au serveur pg
client = new pg.Client(connStr);
client.connect();

// Action à exécuter pour une connexion à '/'
app.get('/', function(req, res) {
    // Ajoute la date d'aujourd'hui dans la table 'visits'
    var date = new Date();
    client.query('INSERT INTO visits(date) VALUES ($1)', [date]);

    // Nombre de visite aujourd'hui
    query = client.query('SELECT COUNT(date) AS count FROM visits WHERE date=$1', [date]);
    query.on('row', function(result){
        console.log(result);
        if (!result) {
            return res.send('No data found');
        } else {
            // Il y a un résultat: en extraire l'entrée 'count'
            res.send('Visitors today: ' + result.count);
        }
    });
});

app.listen(port, function() {
    console.log('Listening on port ' + port);
});