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
        .when('/form/:id?', {
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
    // $scope.message = 'Everyone come and see how good I look!';
});

scotchApp.controller('formController', function($scope, $http, $routeParams) {
    var id = $routeParams.id;
    if (id) {
        $http({method: 'GET', url: '/commande/'+id})
        .success(function(data, status, headers, config) {
            $scope.formdata = data;
            $scope.message = 'Liste des menus bien chargée';
        }).error(function(data, status, headers, config) {
            $scope.errorMessage = "Impossible d'obtenir les menus";
        });

    }
    $scope.formdata = {
        id: $routeParams.id,
        notable: 10,
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
                $scope.errorMessage = data.message;
                $scope.message = "";
            } else {
                // if successful, bind success message to message
                $scope.errorMessage = "";
                $scope.message = data.message;
                $scope.formdata.id = data.id;
            }
        });
    };
});

scotchApp.controller('listController', function($scope, $http) {
   $http({method: 'GET', url: '/commandes'}).
        success(function(data, status, headers, config) {
            $scope.menus = data;
            $scope.message = 'Liste of menus bien chargée';
        }).error(function(data, status, headers, config) {
            $scope.errorMessage = "Impossible d'obtenir les menus";
        });
});

