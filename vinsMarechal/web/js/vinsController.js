app.controller("vinsCtrl", function($scope, $http, compId) {
    $scope.client = new Client ();
    $scope.client.civi = "M.";
    $scope.client.nom = "Olivier Georg";
    $scope.client.email = "oliviergeorg@gmail.com";

    $scope.commentaire = "comment!!!";
    
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
        console.log("scope =", $scope);
        console.log("this =", this.vins);
        var commandes = [];
        this.vins.collectCommands(commandes, []);
        if (commandes.length == 0)
            return;

        /*
        On a donc à ce stade:
        commandes = [
            {group="Vins rouges / Pinot-Gamay 50cl", item: "bouteille(s)", prixuni: "670", units: "1"},
            {group="Vins blancs / Chasselas 50cl", item: "bouteille(s)", prixuni: "670", units: "2"},
        ]
        */
        var total = 0;
        for(var c=0; c<commandes.length; c++) {
            var commande = commandes[c];
            total += commande.units * commande.prixuni;
        }
        var data = {
            'compId': compId,
            'client': this.client, 
            'commandes': commandes, 
            'commentaire': this.commentaire};
        $http.post("/vinsMarechal/commande", data
        ).success(function(data, status, headers, config) {
            console.log(data, status, headers, config);
            alert("commande envoyée");
        }).error(function(data, status, headers, config) {
            console.log(data, status, headers, config);
            alert("problème avec la commande");
        });
    }
    
    $scope.reset_form = function() {
        console.log("RESET");
    }
});
