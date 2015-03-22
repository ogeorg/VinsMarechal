var fs = require('fs'),
    pg = require('pg'),
    connStr = process.env.DATABASE_URL;

console.log(process.env);
console.log(process.argv);
var argv = process.argv;
if (argv.length < 3) {
    console.log("node execsql.js script.sql");
    return;
}

var script = argv[2];
var sql = fs.readFileSync(script).toString();

console.log(sql);

if (sql) pg.connect(connStr, function(err, client, done){
    if(err){
        console.log('error: ', err);
        process.exit(1);
    }
    client.query(sql, function(err, result){
        done();
        if(err){
            console.log('error: ', err);
            process.exit(1);
        }
        process.exit(0);
    });
});
