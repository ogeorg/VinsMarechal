var nodemailer = require("nodemailer");

/*
Le service de mail s'obtient par:
var mailer = require("mailer").use(EMAIL_SERVICE).config(EMAIL_USER, EMAIL_PASS);

La référence pour le module nodemailer:
https://github.com/andris9/Nodemailer
*/

/*
J'ai configuré 2 possibilités de passerelles d'envoi de mails
*/
var configurations = {
    "Gmail": {
        service: "Gmail",
        auth: {
            user: undefined,
            pass: undefined
        }
    }, 
    "OpenMailBox": {
        host: "smtp.openmailbox.org", // hostname
        secureConnection: true, // use SSL
        port: 587, // port for secure SMTP / STARTTLS
        auth: {
            user: undefined,
            pass: undefined
        }
    },
}

module.exports = {
    services: function() {
        return configurations.keys();
    },
    use: function(service) {
        return {
            config: function(user, pass) {
                if (service in configurations) {
                    var conf = configurations[service];
                    console.log("====== CONF =======");
                    conf.auth.user = user;
                    conf.auth.pass = pass;
                    console.log(conf);
                    return nodemailer.createTransport(conf);                    
                }
            }
        }
    }
}
