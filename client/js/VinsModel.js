function Item(opts)
{
    this.unit = "";
    this.desc = opts['desc'];
    this.prixuni = opts['prixuni'];
}
Item.prototype.fprixuni = function()
{
    return this.prixuni / 100;
};
Item.prototype.fprixtot = function()
{
    if (this.unit == 0)
        return "";
    else
        return this.prixuni * this.unit / 100;
};

/**
 * Classe de base pour les vins
 * 
 * <p>S'utilise avant de charger le modèle</p>
 */
function VinsBase()
{
    this.total = function() {
        
    };
}

/**
 * Classe représentant les commandes de vins
 */
function Vins(data)
{
    /**
     * Transforme le json en modèle, avec des Items
     */
    function vinsDict2Item(data) {
        for(var t=0; t<data.length; t++) {
            var type = data[t];
            for (var g=0; g<type.groups.length; g++) {
                var gp = type.groups[g];
                for(var i=0; i<gp.items.length; i++) {
                    // Remplace le dict par un Item
                    gp.items[i] = new Item(gp.items[i]);
                }
            }
        }
        return data;
    }
    this.classes = vinsDict2Item(data);
    this.total = function() {
        var tot = 0;
        for(var t=0; t<this.classes.length; t++) {
            var type = this.classes[t];
            for (var g=0; g<type.groups.length; g++) {
                var gp = type.groups[g];
                for(var i=0; i<gp.items.length; i++) {
                    var item = gp.items[i];
                    tot += item.unit * item.prixuni;
                }
            }
        }
        return tot / 100;
    };
    this.commande = function() {
        var articles = [];
        for(var t=0; t<this.classes.length; t++) {
            var type = this.classes[t];
            for (var g=0; g<type.groups.length; g++) {
                var gp = type.groups[g];
                for(var i=0; i<gp.items.length; i++) {
                    var item = gp.items[i];
                    if (item.unit) {
                        articles.push({
                            'type': type.title, 
                            'group': gp.desc,
                            'item': item.desc,
                            'prixuni': item.prixuni,
                            'units': item.unit
                        })
                    }
                }
            }
        }
        return articles;
    }
}

Vins.prototype.moveClassUp = function(index) {
    console.log("moving class of " + index + " up in model");
};

Vins.prototype.moveClassDown = function(index) {
    console.log("moving class of " + index + " down in model");
};

Vins.prototype.deleteClass = function(index) {
    console.log("removing class of " + index + " in model");
};

