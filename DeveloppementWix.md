== Compte Wix

Je me suis inscrit sur Wix avec mon compte Google. 

== Site

J'ai crée un site avec le Basic Shop Layout. 

Je le sauve et l'appelle testConnection. L'url est

    http://oliviergeorg.wix.com/testconnection

== App

Pour créer des apps, il faut aller sur dev.wix.com.

La première app que je crée est une app pour voir comment fonctionne la connection entre wix et une applicacion.
Je l'appelle TestConnectionApp. Je dois remplir un formulaire de contact.

=== Your App key

App Name: TestConnectionApp
App ID: 13ced715-1f6a-5e5e-a9f4-7f3dc8318c9a
App Secret key: 85f181cb-15f0-4a93-b913-ce022c352e18

=== Widget

Je crée un widget pour pouvoir l'insérer dans le site.

+ Widget Endpoint Definitions: Define your App configurations
  Widget URL:       http://localhost:5000/testConnection/app
  Default width:    250
  Default height:   250

+ App Settings Endpoint: Define your App Settings configurations
  App Settings URL: http://localhost:5000/testConnection/settings
  Width:            600
  Height:           750

+ Widget Endpoint Content: Define the extension text and image
  Component name: TestConnectionWidget
  Component Icon: --
  Component description: Widget de test de connexion
  Extension is Essential: No

Je peux maintenant tester mon application. Il y a un bouton sur la droite, "Test your app". 
Je dois choisir un de mes sites; je peux choisir entre le site "testConnection" et le site 
par défaut.

L'éditeur de site s'ouvre, et mon app apparaît sous Wix App Market -> Developper App. 
Je clique "Add to site".... "Add to site"... "Add app".

Un rectangle de 250 x 250 apparaît, avec le message "We're sorry, 'testConnectionApp' is currently experiencing problems....". Normal, l'app n'est pas écrite, et encore moins en marche!

=== Application

Je crée un réertoire testConnection, et j'y mets un script server.js.

Procfile: 
    
    web: testConnection/server.js

==== Problème et Workaround

olivier@HPCompaq:~/Projects/VinsMarechal$ foreman start
/usr/local/foreman/lib/foreman/process.rb:54:in `spawn': Permission denied - testConnection/server.js (Errno::EACCES)
    from /usr/local/foreman/lib/foreman/process.rb:54:in `block in run'
    from /usr/local/foreman/lib/foreman/process.rb:53:in `chdir'
    from /usr/local/foreman/lib/foreman/process.rb:53:in `run'
    from /usr/local/foreman/lib/foreman/engine.rb:356:in `block (2 levels) in spawn_processes'
    from /usr/local/foreman/lib/foreman/engine.rb:353:in `upto'
    from /usr/local/foreman/lib/foreman/engine.rb:353:in `block in spawn_processes'
    from /usr/local/foreman/lib/foreman/engine.rb:352:in `each'
    from /usr/local/foreman/lib/foreman/engine.rb:352:in `spawn_processes'
    from /usr/local/foreman/lib/foreman/engine.rb:57:in `start'
    from /usr/local/foreman/lib/foreman/cli.rb:41:in `start'
    from /usr/local/foreman/vendor/gems/thor-0.19.1/lib/thor/command.rb:27:in `run'
    from /usr/local/foreman/vendor/gems/thor-0.19.1/lib/thor/invocation.rb:126:in `invoke_command'
    from /usr/local/foreman/vendor/gems/thor-0.19.1/lib/thor.rb:359:in `dispatch'
    from /usr/local/foreman/vendor/gems/thor-0.19.1/lib/thor/base.rb:440:in `start'
    from /usr/bin/foreman:18:in `<main>'

foreman dois être downgradé, mais dans mon cas je k'ai installé avec heroku. Je ne sais pas trop comment faire.

https://github.com/ddollar/foreman/issues/473

Foreman, en plus d'être une commande simple pour lancer le serveur, me lit les variables
d'envireonnement dans .env. Pour palier à ce problème, j'ai installé dotenv avec

    npm install dotenv --save

et dans l'application:

    if (process.env.IP === undefined) {
        require('dotenv').load();
    }

==== EJS

J'ai choisi d'utiliser les templates EJS. Installation:

    npm install ejs --save

app.ejs:

    ...
    Hello <%= name %>
    ...

server.js:

    app.set('view options', { layout: false });     // 1
    app.set('view engine', 'ejs');                  // 2
    app.set('views', __dirname);                    // 3

    /*
     * Page de la app
     */
    app.get('/testConnection/app', function (req, res) {
        res.render('app', {                         // 4
            name: "Olivier"                         // 5
        }); 
    });

1) 
2) utilise ejs comme moteur de templates. Par défaut c'est jade
3) le répertoire des views est l'actuel. Par défaut le répertoire est views
4) utilise le template app.ejs
5) la variable 'name' a la valeur 'Olivier'

=== Connection avec wix (endpoints)

Une fois le serveur lancé, en éditant la page qui contient le widget, je vois que l'url suivant est appelé:

    GET /testConnection/app?
        cacheKiller=14274036587540&
        compId=i7p8bh4w&
        deviceType=desktop&
        instance=9-1MCUKv_nNV8_tDV9leF4q9PoDIH6IvWxf1CkPAYbw.
            eyJpbnN0YW5jZUlkIjoiMTNjZWRhMzUtZDdmYi1hOGY5LWMxNGUtYjM3Y2Q2NGE1YzdjIiwic2lnbkRhdGUiOiIyMDE1LTAzLTI2VDIxOjAwOjQ5LjA5MFoiLCJ1aWQiOiIyMWYyMmQ2Ny1iMWQxLTRkZWEtYjQyMS00N2NhNjZiODcyNGEiLCJwZXJtaXNzaW9ucyI6Ik9XTkVSIiwiaXBBbmRQb3J0IjoiODUuODYuMTQ2LjQvNDM5MzIiLCJkZW1vTW9kZSI6ZmFsc2V9&
        locale=es&
        viewMode=editor&
        width=250

La page de settings quant à elle:

    GET /testConnection/settings?
        instance=9-1MCUKv_nNV8_tDV9leF4q9PoDIH6IvWxf1CkPAYbw.
            eyJpbnN0YW5jZUlkIjoiMTNjZWRhMzUtZDdmYi1hOGY5LWMxNGUtYjM3Y2Q2NGE1YzdjIiwic2lnbkRhdGUiOiIyMDE1LTAzLTI2VDIxOjAwOjQ5LjA5MFoiLCJ1aWQiOiIyMWYyMmQ2Ny1iMWQxLTRkZWEtYjQyMS00N2NhNjZiODcyNGEiLCJwZXJtaXNzaW9ucyI6Ik9XTkVSIiwiaXBBbmRQb3J0IjoiODUuODYuMTQ2LjQvNDM5MzIiLCJkZW1vTW9kZSI6ZmFsc2V9&
        width=600&
        locale=es&
        origCompId=i7p8bh4w&
        compId=i7qnxprx

L'appel a Wix.getSiteInfo depuis la page de settings renvoie les valeurs suivantes:

    baseUrl: "http://oliviergeorg.wix.com/testconnection"
    pageTitle: "HOME"
    referer: "http://www.wix.com/my-account/sites/c17b89da-c379-4955-8c64-f89ef52dec8f"
    siteDescription: ""
    siteKeywords: ""
    siteTitle: ""
    url: "http://editor.wix.com/html/editor/web/renderer/edit/300e223c-5566-467d-bd33-6c2c9fdc9e3d?metaSiteId=c17b89da-c379-4955-8c64-f89ef52dec8f&editorSessionId=B95E5257-CC00-4A47-A778-A21ADBD7F40A"

Depuis la page publiée l'url est:

    GET /testConnection/app?
        compId=i7p8bh4w&
        deviceType=desktop&
        instance=dUQPUfBEBD1fzfmnaVwIMRxVdSBiLYdhyF945BKlpmE.
            eyJpbnN0YW5jZUlkIjoiMTNjZWRhMzUtZDdmYi1hOGY5LWMxNGUtYjM3Y2Q2NGE1YzdjIiwic2lnbkRhdGUiOiIyMDE1LTAzLTI2VDIxOjM4OjA0LjA5M1oiLCJ1aWQiOiIyMWYyMmQ2Ny1iMWQxLTRkZWEtYjQyMS00N2NhNjZiODcyNGEiLCJwZXJtaXNzaW9ucyI6Ik9XTkVSIiwiaXBBbmRQb3J0IjoiODUuODYuMTQ2LjQvNjA0NjUiLCJ2ZW5kb3JQcm9kdWN0SWQiOm51bGwsImRlbW9Nb2RlIjpmYWxzZSwiYWlkIjoiZGQ0MzUwNTMtN2EzYS00ZTM4LWEyYmYtMWViMjk3Y2MzN2ExIn0&
        locale=en&
        viewMode=site&
        cacheKiller=1427405885926&
        width=367

L'appel a Wix.getSiteInfo depuis la page de apps publiée renvoie les valeurs suivantes:

    baseUrl: "http://oliviergeorg.wix.com/testconnection"
    pageTitle: "HOME"
    referer: ""
    siteDescription: ""
    siteTitle: "testconnection"
    url: "http://oliviergeorg.wix.com/testconnection"

=== Application, suite

Comme modèle, je vais utiliser l'app 'london-hackathon-vine-app' du compte github de wix.
Entre autre, je vois qu'ils utilisent aussi ejs, et que presque tout le code est dans un module, 
comme une sorte de facade.

=== Passage à Heroku

Je push les fichiers sur Heroku, et je configure la variable d'environnement APP_SECRET

    heroku config:set APP_SECRET=85f181cb-15f0-4a93-b913-ce022c352e18

Sur http://dev.wix.com/, je configure un nouveau widget pour l'application testConnectionApp:

    nom:        TestConnectionWidgetHeroku
    app:        https://vins-marechal.herokuapp.com/testConnection/app
    settings:   https://vins-marechal.herokuapp.com/testConnection/settings
    descript:   Widget de test de connexion, hébergé sur heroku

Et j'essaie le nouveau widget avec "Test your app". Problème: je ne vois que le widget 
TestConnectionWidget.  En fait, dans les settings du widget TestConnectionWidget, il y a 
un lien "add extensions", qui me permet de choisir entre les 2 widgets. Pas très évident
il est vrai...

== Base de donnée

Je dois définir une table avec les données de settings à stocker:

Une définition par widget. Le widget a la clé CompId, qui est le même que le compOrigId
dans les settings. Cela peut me servir de clé primaire pour la table des settings

Plus tard, pour la commande, Je peux utiliser compid / siteinfo.url / sitetitle pour
savoir d'où vient la commande.

Postgres a un type json qui semble adapté à mon cas, pour représenter par exemple

    data = {"name": "Olivier", "age": 44}

Table TestConnection

Field       | Type
------------|--------------- 
compId      | string not null
data        | json
