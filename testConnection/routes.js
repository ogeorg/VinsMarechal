var fs = require('fs');
// var http = require('http');
// var qs = require('querystring');

exports.appWidget = function (req, res) {
    fs.readFile(__dirname + "/data.txt", function (err, data) {
        if (err) {
            res.render('app', { 
                name: "... unknown!"
            }); 
        } else {
            res.render('app', { 
                name: data
            });                     
        }                    
    });
};

exports.appSetting = function (req, res) {
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
    var data = req.body;
    fs.writeFile(__dirname + "/data.txt", data.name, function(err) {
        if(err) {
            res.json({success: false});
        } else {
            res.json({success: true});
        }
    }); 
};
