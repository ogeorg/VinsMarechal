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

scotchApp.controller('formController', function($scope, $http) {
    $scope.formdata = {
        id: undefined,
        table: 10,
        entree: 'Soupe',
        principal: 'Lasagne'
    };
    $scope.errorMessage = "";
    $scope.processForm = function() {
        $http({
            method  : 'POST',
            url     : '/commande',
            // pass in data as strings
            data    : $.param($scope.formdata),  
            // set the headers so angular passing info as form data (not request payload)
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
        })
        .success(function(data) {
            console.log(data);
            if (!data.success) {
                // if not successful, bind errors to error variables
                $scope.errorName = data.errors.name;
                $scope.errorSuperhero = data.errors.superheroAlias;
            } else {
                // if successful, bind success message to message
                $scope.message = data.message;
                $scope.formdata.id = data.id;
            }
        });
    };
});

scotchApp.controller('listController', function($scope) {
    $scope.message = 'List of menus.';
});

