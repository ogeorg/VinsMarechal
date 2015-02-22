
     ,-----.,--.                  ,--. ,---.   ,--.,------.  ,------.
    '  .--./|  | ,---. ,--.,--. ,-|  || o   \  |  ||  .-.  \ |  .---'
    |  |    |  || .-. ||  ||  |' .-. |`..'  |  |  ||  |  \  :|  `--, 
    '  '--'\|  |' '-' ''  ''  '\ `-' | .'  /   |  ||  '--'  /|  `---.
     `-----'`--' `---'  `----'  `---'  `--'    `--'`-------' `------'
    ----------------------------------------------------------------- 


Welcome to your Node.js project on Cloud9 IDE!

This chat example showcases how to use `socket.io` with a static `express` server.

## Running the server

1) Open `server.js` and start the app by clicking on the "Run" button in the top menu.

2) Alternatively you can launch the app from the Terminal:

    $ node server.js

Once the server is running, open the project in the shape of 'https://projectname-username.c9.io/'. As you enter your name, watch the Users list (on the left) update. Once you press Enter or Send, the message is shared with all connected clients.

## Cloud9

    $ git init
    $ git add *
    $ # créer un ficher .gitignore, y mettre .c9/ et node\_modules. Le propore fichier .gitignore n'est _pas_ ignoré.
    $ git remote add origin https://github.com/ogeorg/VinsMarechal.git
    $ git push origin master
    $ git pull origin master
    $ git remote -v
    origin  https://github.com/ogeorg/VinsMarechal.git (fetch)
    origin  https://github.com/ogeorg/VinsMarechal.git (push)

## Local

    $ git clone https://github.com/ogeorg/VinsMarechal.git

Une fois l'app créée sur Heroku, j'ai les remote suivant:

    $ git remote -v
    heroku	https://git.heroku.com/vins-marechal.git (fetch)
    heroku	https://git.heroku.com/vins-marechal.git (push)
    origin	https://github.com/ogeorg/VinsMarechal.git (fetch)
    origin	https://github.com/ogeorg/VinsMarechal.git (push)

## Heroku

1) Sur Heroku, j'ai créé une nouvelle app: vins-marechal

2) En local:

    $ heroku git:remote -a vins-marechal
    $ git push heroku master

Et Heroku détecte une nouvelle app node.js, analyse package.json, et déploye la nouvelle application. 



