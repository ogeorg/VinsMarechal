Array.prototype.moveUp = function(index, by) {
    var value = this[index],
        newPos = index - (by || 1);
    
    if(newPos < 0) 
        newPos = 0;
        
    this.splice(index,1);
    this.splice(newPos,0,value);
};

Array.prototype.moveDown = function(index, by) {
    var value = this[index],
        newPos = index + (by || 1);
    
    if(newPos >= this.length) 
        newPos = this.length;
    
    this.splice(index, 1);
    this.splice(newPos,0,value);
};

/**
 * A group is defined by a description and a list of children
 * A child can be another group or an article
 */
function Group(opts)
{
    opts = opts || {};
    this.type = "Group";
    this.description = opts.description;
    this.children = [];
}

/**
 * Recursively calculates the total of orders
 *
 * @return the total of the subgroups and articles
 */
Group.prototype.total = function() 
{
    var tot = 0;
    for(var c=0; c<this.children.length; c++) {
        tot += this.children[c].total();
    }
    return tot;
};

/**
 * Recursively collects the commands
 * 
 * @param commands list of commands
 * @param descriptions stack of descriptions of the distints levels of groups
 */
Group.prototype.collectCommands = function(commands, descriptions)
{
    descriptions.push(this.description);
    for(var c=0; c<this.children.length; c++) {
        tot += this.children[c].collectCommands(commands, descriptions);
    }
    descriptions.pop();
}

Group.prototype.moveChildUp = function(index) {
    this.children.moveUp(index);
    console.log("moving class of " + index + " up in model");
};

Group.prototype.moveChildDown = function(index) {
    this.children.moveDown(index);
    console.log("moving class of " + index + " down in model");
};

Group.prototype.deleteChild= function(index) {
    this.children.splice(index, 1);
    console.log("removing class of " + index + " in model");
};

Group.prototype.appendGroup = function() {
    var child = new Group();
    child.description = "Groupe d'articles";
    this.children.push(child);
    console.log("adding a new group");
};

Group.prototype.appendArticle = function() {
    var child = new Article();
    child.description = "Article";
    this.children.push(child);
    console.log("adding a new article");
};

/**
 * An article is defined by a number of units, a description and a unitry price
 */
function Article(opts) 
{
    opts = opts || {};
    this.type = "Article";
    this.unit = "";
    this.description = opts['description'];
    this.prixuni = opts['prixuni'];
}
Article.prototype.total = function() 
{
    return this.unit * this.prixuni;
}
Article.prototype.collectCommands = function(commands, descriptions)
{
    if (this.unit) {
        commands.push({
            'group': descriptions.join(" / "),
            'item': item.desc,
            'prixuni': item.prixuni,
            'units': item.unit
        })
    }
}
Article.prototype.fprixuni = function()
{
    return this.prixuni / 100;
};

Article.prototype.fprixtot = function()
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
        return "";
    };
}

/**
 * Classe représentant les commandes de vins
 */
function Vins(data)
{
    /**
     * Transforme le json en modèle, avec des Groupes et des Articles
     */
    function parse(items) 
    {
        var groups = [];
        for(var c=0; c<items.length; c++) {
            var child = items[c];
            var type = child.type;
            if (type == 'Group') {
                var group = new Group(child);
                group.children = parse(child.children);
                groups.push(group);
            } else if (type == 'Article') {
                var art = new Article(child);
                groups.push(art);
            }
        }
        return groups;
    }
    this.children = parse(data);
}
Vins.prototype = new Group();

Vins.prototype.total = function()
{
    var tot = 0;
    for(var c=0; c<this.children.length; c++) {
        tot += this.children[c].total();
    }
    return tot / 100;
}