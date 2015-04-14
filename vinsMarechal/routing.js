var fs = require('fs');
var dao = require('./dao');

var viewsPrefix = __dirname + "/web/";
exports.getWebPath = function() {
    return viewsPrefix;
};

/**
 * Retourne le widget de commande
 */
exports.appWidget = function (req, res) {
    console.log("Entering appWidget");
    var compId = req.query.compId;
    console.log("compId =", compId);
    res.render(viewsPrefix + 'vins', { 
        compId: compId,
    });                     
};

/**
 * retourne la liste des vins en format json
 */
exports.getVins = function (req, res) {
    var compId = req.query.compId;
    dao.getData(compId, 
        function onSuccess(data) {
            console.log("Got data, value is " + data);
            res.json(data);
        }, function onError(error) {            
            if (error.rowCount == 0) {
                // Pas de registre pour ce widget. Il faut le créer
                console.log("Pas de registre pour ce widget ("+compId+"). un retourne un json vide");
                var data = [];
                res.json(data);
            } else {
                console.log("Error reading data", error);
                var data = [];
                res.json(data);
            }
        });
};

/**
 * actualise la liste des vins
 */
exports.updateVins = function (req, res) {
    console.log("Entering updateData");

    var data = req.body;
    console.log("data =", data);
    var compId = data.compId;
    var vins = data.vins;
    
    dao.setData(compId, vins,
        function onSuccess(result) {
            res.json({success: true});
        }, function onError(error) {
            res.json({success: false});
        });
}

/**
 * envoie la commande
 */
exports.sendCommande = function (req, res) {
    var data = req.body;
    console.log("Recu une commande");
    console.log(data);
    // TODO: guarder la commande en BD
    var commande = data.commande;
    var total = 0;
    for(var i=0; i<commande.length; i++) {
        var art = commande[i];
        total += art.units * art.prixuni;
    }
    res.json({"done":"yes", "total": total});
};

/**
 * envoie la commande
 */
exports.sendCommande = function (req, res) {
    var data = req.body;
    console.log("Recu une commande");
    console.log(data);
    // TODO: guarder la commande en BD
    var commande = data.commande;
    var total = 0;
    for(var i=0; i<commande.length; i++) {
        var art = commande[i];
        total += art.units * art.prixuni;
    }
    res.json({"done":"yes", "total": total});
};

exports.settingsWidget = function (req, res) {
    console.log("Entering appSetting");
    var compId = req.query.origCompId;
    console.log("compId =", compId);
    var renderSuccess = function (data) {
        res.render(viewsPrefix + 'settings', { 
            name: data.name,
            age: data.age,
            compId: compId,
        });                     
    };
    var renderError = function(error) {
        res.render(viewsPrefix + 'settings', { 
            name: "",
            age: "",
            compId: compId,
            error: error,
        }); 
    };
    dao.getData(compId, 
        function onSuccess(data) {
            console.log("Got data, value is " + data);
            renderSuccess(data);
        }, function onError(error) {
            if (error.rowCount == 0) {
                // Pas de registre pour ce widget. Il faut le créer
                console.log("Pas de registre pour ce widget ("+compId+"). Il faut le créer");
                var data = {name: "Inconnu", age: "0"};
                dao.setData(compId,
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
    
    dao.setData(compId, data,
        function onSuccess(result) {
            res.json({success: true});
        }, function onError(error) {
            res.json({success: false});
        });
};
