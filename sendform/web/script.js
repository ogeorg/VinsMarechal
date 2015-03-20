// create the module and name it scotchApp
// also include ngRoute for all our routing needs
var scotchApp = angular.module('scotchApp', ['ngRoute']);

// configure our routes
scotchApp.config(function($routeProvider) {

    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : '/home.html',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/form', {
            templateUrl : '/formulaire.html',
            controller  : 'formController'
        })

        // route for the contact page
        .when('/list', {
            templateUrl : '/liste.html',
            controller  : 'listController'
        });
});

// create the controller and inject Angular's $scope
scotchApp.controller('mainController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
});

scotchApp.controller('formController', function($scope) {
    $scope.message = 'Look! I am the form.';
});

scotchApp.controller('listController', function($scope) {
    $scope.message = 'List of menus.';
});

