var fs = require('fs');
// var http = require('http');
// var qs = require('querystring');

exports.appWidget = function (req, res) {
    console.log("Entering appWidget");    
    fs.readFile(__dirname + "/data.txt", function (err, data) {
        if (err) {
            console.log("Error reading data.txt");
            res.render('app', { 
                name: "... unknown!"
            }); 
        } else {
            console.log("Got data.txt, value is " + data);
            res.render('app', { 
                name: data
            });                     
        }                    
    });
};

exports.appSetting = function (req, res) {
    console.log("Entering appSetting");
    fs.readFile(__dirname + "/data.txt", function (err, data) {
        if(err) {
            res.render('settings', { 
                name: ""
            }); 
        } else {
            res.render('settings', { 
                name: data
            }); 
        }
    }); 
};

exports.updateData = function (req, res) {
    console.log("Entering updateData");
    var data = req.body;
    fs.writeFile(__dirname + "/data.txt", data.name, function(err) {
        if(err) {
            res.json({success: false});
        } else {
            res.json({success: true});
        }
    }); 
};
