## Requisitos

NectarDesign fait un site web pour Vins Maréchal. La plateforme web est Wix. 

Pour créer un formulaire sur cette plateforme Wix, il faut créer une application Wix. 
Cette application aura plusieurs "widgets", ou composants:

+ Un widget pour le formulaire
+ Un widget pour les "settings", ou gestion du formulaire (les produits qui y seront présentés).

Cette application est hébergée sur un serveur tiers. Je propose heroku, car il y existe un plan 
de base gratuit, avec quelques limitations.

## Analyse

### Cas d'utilisation

![Cas d'utilisation][usecases]


## Design

### API

web/commande: 
+ GET: montre le formulaire. Il s'agit en fait d'un template, les vins se chargent via ajax depuis la page
+ POST: envoie la commande

web/vins:
+ GET: renvoie les vins à montrer sur la page de commande, en format json

settings: 
+ GET: montre le formulaire de gestion des vins

settings/vins
+ GET: renvoie les vins à montrer dans le formulaire de gestion
+ POST: sauver les données du formulaire de gestion des vins


[usecases]: http://yuml.me/7e28d3a6 "Cas d'utilisation"
