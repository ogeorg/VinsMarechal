var pg = require('pg'),
    connStr = process.env.DATABASE_URL || 'pg://olivier:olivier@localhost:5432/olivier',
    client,
    query

// Un client pg se connecte au serveur pg
client = new pg.Client(connStr);
client.connect();

// Query de création d'une table dans la BD
query = client.query('CREATE TABLE visits (date date)');
query.on('end', function() { client.end(); });
