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
            if (data.success) {
                $scope.formdata = data.menu;
                $scope.message = 'Liste des menus bien chargée';
            } else {
                $scope.errorMessage = data.error;
            }
        }).error(function(data, status, headers, config) {
            $scope.errorMessage = "Impossible d'obtenir les menus";
        });
    }
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
            if (data.success) {
                // if successful, bind success message to message                
                $scope.errorMessage = "";
                $scope.message = data.message;
                $scope.formdata.id = data.id;
            } else {
                // if not successful, bind errors to error variables
                $scope.errorMessage = data.error;
                $scope.message = "";
            }
        });
    };
});

scotchApp.controller('listController', function($scope, $http) {
    $http({method: 'GET', url: '/commandes'}).
        success(function(data, status, headers, config) {
            if (data.success) {
                $scope.menus = data.menus;
                $scope.message = 'Liste of menus bien chargée';
            } else {
                $scope.errorMessage = data.error;
            }
        }).error(function(data, status, headers, config) {
            $scope.errorMessage = "Impossible d'obtenir les menus";
        });

    $scope.deleteUser = function(id) {
        $http({
            method  : 'DELETE',
            url     : '/commande/' + id,
        })
        .success(function(data) {
            console.log(data);
            if (data.success) {
                // if successful, bind success message to message                
                $scope.errorMessage = "";
                $scope.message = "Menu " + id + " éliminé";
                for(var i=0; i<$scope.menus.length; i++) {
                    var menu = $scope.menus[i];
                    if (menu.id == id) {
                        $scope.menus.splice(i, 1);
                    }
                } 
            } else {
                // if not successful, bind errors to error variables
                $scope.errorMessage = data.error;
                $scope.message = "";
            }
        });
    };

    $scope.sendConfirmation = function() {
       $http({method: 'GET', url: '/sendconfirmation'}).
            success(function(data, status, headers, config) {
                if (data.success) {
                    $scope.message = 'Mails envoyés';
                    $scope.errorMessage = "";
                } else {
                    $scope.message = "";
                    $scope.errorMessage = data.error;
                }
            }).error(function(data, status, headers, config) {
                $scope.message = "";
                $scope.errorMessage = "Impossible d'envoyer les mails";
            });
        };
});

