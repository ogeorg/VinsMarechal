var fs = require('fs');
var pg = require('./pgTestConnection');

exports.appWidget = function (req, res) {
    console.log("Entering appWidget");
    var compId = req.query.compId;
    console.log("compId =", compId);
    pg.getData(compId, 
        function onSuccess(data) {
            console.log("Got data, value is " + data);
            res.render('app', { 
                name: data.name,
                age: data.age
            });                     
        }, function onError(error) {
            console.log("Error reading data.txt");
            res.render('app', { 
                name: "... unknown!",
                age: "... unknown!",
            }); 
        });
};

exports.appSetting = function (req, res) {
    console.log("Entering appSetting");
    var compId = req.query.origCompId;
    console.log("compId =", compId);
    var renderSuccess = function (data) {
        res.render('settings', { 
            name: data.name,
            age: data.age,
            compId: compId,
        });                     
    };
    var renderError = function(error) {
        res.render('settings', { 
            name: "",
            age: "",
            compId: compId,
            error: error,
        }); 
    };
    pg.getData(compId, 
        function onSuccess(data) {
            console.log("Got data, value is " + data);
            renderSuccess(data);
        }, function onError(error) {
            if (error.rowCount == 0) {
                // Pas de registre pour ce widget. Il faut le créer
                console.log("Pas de registre pour ce widget ("+compId+"). Il faut le créer");
                var data = {name: "Inconnu", age: "0"};
                pg.setData(compId,
                    data,
                    function onSuccess(result) {
                        console.log("Registre créé pour le widget ("+compId+")");
                        renderSuccess(data);
                    }, function onError(error) {
                        console.log("Pas pu créer de registre pour le widget ("+compId+")");
                        renderError(error);
                    });
            } else {
                console.log("Error reading data", error);
                renderError(error);
            }
        });
};

exports.updateData = function (req, res) {
    console.log("Entering updateData");

    var data = req.body;
    console.log("data =", data);
    var compId = data.compId;
    delete data.compId;
    
    pg.setData(compId, data,
        function onSuccess(result) {
            res.json({success: true});
        }, function onError(error) {
            res.json({success: false});
        });
};
