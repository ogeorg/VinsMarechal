# SendForm

Je veux faire une petite application web pour envoyer le résultat d'un formulaire:

1) Par mail
2) A une base de donnée

## Description

### Page principale

+ Entête et 
+ formulaire

### Commande d'un menu

+ Table
+ 3 entrées (Salade, soupe ou jambon)
+ 3 plats principaux (Steak, poisson ou lasagne)

Quand on envoye la commande, on passe à la liste

### Base de données

faire un script qui a un certain nombre de commande, dont
+ créer la table
+ recréer la table
+ éliminer la table
+ faire un dump de la table

Comment éxécuter:
    
    node sendform/execdb.js mon_script_pg

Cela execute le script sendform/sqls/mon_script_pg.sql

### Liste des commandes

Liste des commandes par ordre chronologique inverse

Possibilité de valider la commande

Une commande a un id. Si l'Id envoyé au serveur est null/vide, il s'agit d'une nouvelle commande. Si l'ID existe, il s'agit d'une existente.

## API

### GET / 

Montre la page principale

### GET /form

Renvoie le formulaire

### GET /liste

Renvoie la page de liste

### GET /commande/:id

Envoie les données d'une commande en json

### POST /commande

Envoie les données du formulaire au serveur. Un json de confirmation est renvoyé.

### GET /commandes

Envoie la liste des commandes

