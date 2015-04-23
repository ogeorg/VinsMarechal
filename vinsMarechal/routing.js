var fs = require('fs');
var dao = require('./dao');
var mailer = require("../js/mailer")
        .use(process.env.EMAIL_SERVICE)
        .config(process.env.EMAIL_USER, process.env.EMAIL_PASS);

/**
 * Formatte un prix
 * @param prix le prix en centimes
 * @return le prix en string
 */
function formatFrancs(prix) 
{
    var cts = prix % 100;
    var frs = (prix-cts) / 100;
    cts = ""+cts;
    if (cts.length==1) cts = cts + "0";
    return "Frs. " + frs + "." + cts;
}

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
        function onSuccess(vins, shop) {
            console.log("Got app vins, value is " + vins);
            res.json(vins);
        }, function onError(error) {            
            if (error.rowCount == 0) {
                // Pas de registre pour ce widget. Il faut le créer
                console.log("Pas de registre pour ce widget ("+compId+"). un retourne un json vide");
                var vins = [];
                res.status(500).json(vins);
            } else {
                console.log("Error reading vins", error);
                var vins = [];
                res.status(500).json(vins);
            }
        });
};

/**
 * retourne la liste des vins et des données du magasin en format json
 */
exports.getSettingsData = function (req, res) {
    var compId = req.query.compId;
    dao.getData(compId, 
        function onSuccess(vins, shop) {
            console.log("Got settings data, value is " + vins);
            res.json({"vins": vins, "shop": shop});
        }, function onError(error) {            
            if (error.rowCount == 0) {
                // Pas de registre pour ce widget. Il faut le créer
                console.log("Pas de registre pour ce widget ("+compId+"). un retourne un json vide");
                res.status(500).json({"vins": [], "shop": {}});
            } else {
                console.log("Error reading data", error);
                res.status(500).json({"vins": [], "shop": {}});
            }
        });
};

/**
 * actualise la liste des vins
 */
exports.updateSettingsData = function (req, res) {
    console.log("Entering updateData");

    var data = req.body;
    console.log("data =", data);
    var compId = data.compId;
    var vins = data.vins;
    var shop = data.shop;
    
    dao.setData(compId, vins, shop,
        function onSuccess(result) {
            res.json({success: true});
        }, function onError(error) {
            res.status(500).json({success: false});
        });
}

/**
 * envoie la commande
 { client: 
   { civi: 'M.',
     nom: 'Olivier Georg',
     email: 'oliviergeorg@gmail.com',
     dirlivr: '-',
     dirfact: '-' },
  commandes: 
   [ { group: 'Vins rouges / Pinot-Gamay 50cl',
       item: 'bouteille(s)',
       prixuni: '670',
       units: '1' },
     { group: 'Vins blancs / Chasselas 50cl',
       item: 'bouteille(s)',
       prixuni: 670,
       units: '2' } ] }
 */
exports.sendCommande = function (req, res) {
    var data = req.body;
    console.log("Recu une commande");
    console.log(data);

    // TODO: guarder la commande en BD
    var compId = data.compId;
    var cl = data.client;
    var cms = data.commandes;
    var com = data.commentaire;

    var resJson = {};
    function saveInDb(resJson) {
        dao.insertCommand(compId, cl, cms, com,
            function onSuccess(result) {
                res.json({success: true});
            }, function onError(error) {
                res.status(500).json({success: false});
            });
    }
    
    function makeMailBody(data) {

        /* ======================= Début ======================= */

        var html = 
            "<body>";

        /* ======================= Client ======================= */

        var text = 
            "Client\r\n" + 
            "======\r\n" +
            "Nom:                    " + cl.civi + " " + cl.nom + "\r\n" +
            "Email:                  " + cl.email + "\r\n" + 
            "Adresse de livraison:   " + cl.dirlivr + "\r\n" +
            "Adresse de facturation: " + cl.dirfact + "\r\n" +
            "\r\n";
        
        var styleTh = "style='border: 1px solid black; padding: 3px;text-align: right; width: 200px;'";
        var styleTd = "style='border: 1px solid black; padding: 3px;'"
        html += 
            "<h2>Client</h2>" + 
            "<table style='border-collapse: collapse; border: 1px solid black' width='100%'>" +
            "<tr><th "+styleTh+">Nom:</th><td "+styleTd+">" + cl.civi + " " + cl.nom + "</td></tr>" +
            "<tr><th "+styleTh+">Email:</th><td "+styleTd+">" + cl.email + "</td></tr>" + 
            "<tr><th "+styleTh+">Adresse de livraison</th><td "+styleTd+">" + cl.dirlivr + "</td></tr>" +
            "<tr><th "+styleTh+">Adresse de facturation</th><td "+styleTd+">" + cl.dirfact + "</td></tr>" +
            "</table>";

        /* ======================= Commande ======================= */

        text += 
            "\r\n" +
            "Commande\r\n" +
            "========\r\n";

        var styleTd = "style='border: 1px solid black; padding: 3px;'"
        var styleTd2 = "style='border: 1px solid black; padding: 3px; text-align: right'"
        html += 
            "<h2>Commandes</h2>" + 
            "<table style='border-collapse: collapse; border: 1px solid black' width='100%'>";

        var total = 0;
        for(var c=0; c<cms.length; c++) {
            var cm = cms[c];
            var prix = cm.units * cm.prixuni;
            total += prix;
            var fprix = formatFrancs(prix);

            text += 
                cm.group + ": " + cm.units + " " + cm.item + " à " + cm.prixuni + " => " + fprix + "\r\n";
            html += 
                "<tr>"+
                    "<td "+styleTd+">"+cm.group+"</td>"+
                    //"<td "+styleTd+">&nbsp;-&nbsp;</td>"+
                    "<td "+styleTd+">"+cm.units + " " + cm.item + " à " + formatFrancs(cm.prixuni)+"</td>"+
                    "<td "+styleTd2+">"+fprix+"</td>"
                "</tr>";
        }

        var ftotal = formatFrancs(total);
        text +=
            "Total: " + ftotal;
        html +=
            "<tr>"+
                "<td "+styleTh+" bgcolor='#eeeeee' colspan='2'><div style='padding: 3px'>Total</div></td>"+
                "<td "+styleTd2+" bgcolor='#eeeeee'>"+ftotal+"</td>" +
            "</tr>" +
            "</table>";

        /* ======================= Commentaire ======================= */

        text += 
            "\r\n" +
            "Commentaire\r\n" +
            "===========\r\n" +
            com;

        html += 
            "<h2>Commentaire</h2>" + 
            "<table style='border-collapse: collapse; border: 1px solid black' width='100%'>" +
            "<tr><td>"+com+"</td></tr>" +
            "</table>";

        /* ======================= Fin ======================= */

        html +=
            "</body>";

        return {text: text, html: html};
    }

    // Envoie la commande par mail
    function sendMail(shop) {
        var body = makeMailBody(shop);
        var cliAdresse = cl.nom + " <" + cl.email + ">";
        var comAdresse = shop.name + " <" + shop.email + ">";
        var options = {
            to:      cliAdresse,            // adresse mail du client
            from:    comAdresse,            // adresse mail du commerce
            bcc:     comAdresse,            // adresse mail du commerce
            subject: shop.sujetmail,    // Subject line
            text:    body.text,             // plaintext body
            html:    body.html              // html body
        };
        mailer.sendMail(options, function(error, info){
           if(error) {
                console.log("======> ERROR");
                console.log(error);
                resJson.error = error;
                res.status(500).json(resJson);
           } else {
                console.log("Message sent: " + info.response);
                saveInDb(resJson);
           }
        });
    }

    function getMailData() {
        dao.getData(compId, 
            function onSuccess(vins, shop) {
                console.log("send mail to ", shop.name, shop.email);
                sendMail(shop);
            }, function onError(error) {
                console.log("Impossible d'obtenir le mail");
                res.status(500).json("Error à l'envoi")
            });
    }
    getMailData();
};

exports.settingsWidget = function (req, res) {
    console.log("Entering appSetting");
    var compId = req.query.origCompId;
    console.log("compId =", compId);
    var renderSuccess = function (data) {
        res.render(viewsPrefix + 'settings', { 
            compId: compId,
        });                     
    };
    var renderError = function(error) {
        res.render(viewsPrefix + 'settings', { 
            compId: compId,
            error: error,
        }); 
    };

    /* 
    Pour renderiser la page, j'ai besoin de données du registre
    Est-ce bien vrai??? j'ai des doutes
    ON va faire sans
    */
    /*
    dao.getData(compId, 
        function onGetDataSuccess(vins, shop) {
            console.log("Got data, value is " + data);
            renderSuccess(data);
        }, function onError(error) {
            if (error.rowCount == 0) {
                // Pas de registre pour ce widget. Il faut le créer
                console.log("Pas de registre pour ce widget ("+compId+"). Il faut le créer");
                var data = {};
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
    */
    renderSuccess();
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
