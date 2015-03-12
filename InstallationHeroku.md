## Heroku

*Expliquer pourquoi j'ai choisi Heroku*

Par la suite, il est possible de transférer le compte à un autre utilisateur. Cela peut se faire une fois
que le site est transmis au client.

## Enregistrement

*Ce que j'ai fait pour avoir un compte*

L'application est disponible à l'adresse <http://vins-marechal.herokuapp.com>

## Déploiement

L'application se déploie avec le système de gestion de version `git`. On *pousse* les changements sur heroku. 
Dans mon environnement de travail, j'ai défini deux repositories git *remote*:

* `origin`: github.com/ogeorg/VinsMarechal
* `heroku`: le serveur heroku

Chaque fois qu'heroku reçoit une nouvelle version, le serveur est redémarré pour prendre en compte les changements.

## Variables d'environnement

Le code (la logique) qui se deploie sur Heroku est public; il est visible par exemple sur github. 
Cela n'amène aucun problème de sécurité. Par contre, les clés d'accès (clé privée de l'application
Wix, du compte email) doivent bien évidemment rester secrète, mais le serveur doit les connaitre.
Pour cela, on utilise des variables d'environnement. Elle peuvent en tout temps être changées, par
exemple si l'adresse email à qui envoyer les notifications de commandes change. Cela se fait par le
biais de la commande `heroku`:

    heroku config:set WIX_PRIVATE_KEY=1234
    heroku config:set EMAIL_ACCOUNT=oliviergeorg@gmail.com
    heroku config:set EMAIL_PASSWORD=MonMotDePasse

On peut voir les variables d'environnement existentes avec:

    heroku config

Référence: <https://devcenter.heroku.com/articles/config-vars>
