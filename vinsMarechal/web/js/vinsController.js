app.controller("vinsCtrl", function($scope, $http, compId) {
    $scope.client = new Client ();
    $scope.client.civi = "M.";
    $scope.client.nom = "Olivier Georg";
    $scope.client.email = "oliviergeorg@gmail.com";
    
    console.log("initCompId with compId =", compId);
    $scope.compId = compId;
    $http({method: 'GET', url: '/vinsMarechal/vins?compId=' + compId}).
    success(function(data, status, headers, config) {
        $scope.vins = new Vins(data);
    }).error(function(data, status, headers, config) {
        console.error("Could not load data");
        console.error(data);
    });

    $scope.send_form = function() 
    {
        console.log("SEND");
        var commande = this.vins.commande();
        var client = this.client;
        var data = {'client': client, 'commande': commande};
        $http.post("/vinsMarechal/commande", data
        ).success(function(data, status, headers, config) {
            alert("commande envoyée");
        }).error(function(data, status, headers, config) {
            alert("problème avec la commande");
        });
    }
    
    $scope.reset_form = function() {
        console.log("RESET");
    }
});
