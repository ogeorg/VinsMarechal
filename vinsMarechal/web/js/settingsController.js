app.controller("settingsCtrl", function($scope, $http, $compile, compId, Wix) 
{
    console.log("initCompId with compId =", compId);
    // On met l'id du widget Wix dans le scope
    $scope.compId = compId;
    
    // On récupère la liste des vins par ajax et on la met dans le scope
    $http({method: 'GET', url: '/vinsMarechal/settingsData?compId=' + compId}).
    success(function(data, status, headers, config) {
        console.log(data);
        $scope.vins = new Vins(data.vins);
        $scope.shop = data.shop;
    }).error(function(data, status, headers, config) {
        console.error("Could not load data");
        console.error(data);
        $scope.vins = new Vins([]);
        $scope.shop = {};
    });

    $scope.$on("$destroy", function() {
        this.$$nextSibling = null;
    });

    $scope.toggleGroup = function(group, $event)
    {
        var $elem = $($event.target);
        var $group = $elem.closest('.group');
        var $groups = $(".group-body", $group).first();

        group.isOpen = !group.isOpen;
        if (group.isOpen) 
            $elem.addClass("open");
        else
            $elem.removeClass("open");
        $groups.toggle();
    };

    $scope.reset_form = function() {
        console.log("RESET");
    };

    $scope.submit_settings = function() {
        console.log("SEND SETTINGS");
        var vins = this.vins;
        var shop = this.shop;
        $http
            .post("/vinsMarechal/vins", {compId: $scope.compId, vins: vins.children, shop: shop})
            .success(function(data, status, headers, config) {
                alert("settings envoyés");
                Wix.Settings.refreshApp({param1: "value1", param2: "value2"})
                })
            .error(function(data, status, headers, config) {
                alert("problème avec la commande");
                });
    };
    
    $scope.moveGroupUp = function(parentGroup, $index, $event) {
        $event.stopPropagation();
        // move in model
        parentGroup.moveChildUp($index);
        /*
        // move in DOM
        var $elem = $($event.target);
        var $classvin = $elem.closest('classvin');
        $classvin.insertBefore( $classvin.prev() );
        */
        };
    $scope.moveGroupDown = function(parentGroup, $index, $event) {
        $event.stopPropagation();
        // move in model
        parentGroup.moveChildDown($index);
        /*
        // move in DOM
        var $elem = $($event.target);
        var $classvin = $elem.closest('classvin');
        $classvin.insertAfter( $classvin.next() );
        */
        };
    $scope.deleteGroup = function(parentGroup, $index, $event) {
        $event.stopPropagation();
        // remove in model
        parentGroup.deleteChild($index);
        /*
        // remove in DOM
        var $elem = $($event.target);
        var $classvin = $elem.closest('classvin');
        $classvin.remove();
        */
        };
    $scope.appendGroup = function(parentGroup, $event) {
        $event.stopPropagation();
        // add in model
        parentGroup.appendGroup();
        // add in DOM
        };
    $scope.appendArticle = function(parentGroup, $event) {
        $event.stopPropagation();
        // add in model
        parentGroup.appendArticle();
        // add in DOM
        };
});
app.directive('couleurVin', function(){
    var directive = {
        'restrict': 'AE',
        'templateUrl': "tmplCouleurVin.html",
    };
    return directive;
});
app.directive('typeBouteille', function(){
    var directive = {
        'restrict': 'AE',
        'templateUrl': "tmplTypeBouteille.html",
    };
    
    return directive;
});
app.directive('article', function(){
    var directive = {
        'restrict': 'AE',
        'templateUrl': "tmplArticle.html",
    };
    
    return directive;
});
