var pg = require('pg'),
    connStr = process.env.DATABASE_URL || 'pg://olivier:olivier@localhost:5432/olivier',
    client = new pg.Client(connStr);
client.connect();

module.exports = {
    getMenu: function(id, onSuccess, onError) {
        if (id) {
            client.query(
                "SELECT * FROM commandesmenus WHERE id=$1",
                [id],
                function(error, result) {
                    if (error) {
                        onError(error);
                    } else {
                        var rows = result.rows;
                        var row = rows.length == 0 ? {} : rows[0];
                        onSuccess(row);
                    }
                });
        } else {
            onError("id non spécifié");
        }
    },
    deleteMenu: function(id, onSuccess, onError) {
        client.query(
            "DELETE FROM commandesmenus WHERE id=$1",
            [id],
            function(error, result) {
                if (error) {
                    onError(error);
                } else {
                    onSuccess();
                }
            });
    },
    updateMenu: function(menu, onSuccess, onError) {
        client.query(
            "UPDATE commandesmenus SET notable=$1, entree=$2, principal=$3 WHERE id=$4",
            [menu.notable, menu.entree, menu.principal, menu.id],
            function(error, result) {
                if (error) {
                    onError(error);
                } else {
                    onSuccess();
                }
            });
    },
    insertMenu: function(menu, onSuccess, onError) {
        client.query(
            "INSERT into commandesmenus (notable, entree, principal) VALUES($1, $2, $3) RETURNING id",
            [menu.notable, menu.entree, menu.principal],
            function(error, result) {
                if (error) {
                    onError(error);
                } else {
                    var newid = result.rows[0].id;
                    onSuccess(newid);
                }
            });
    },
    getMenus: function(onSuccess, onError) {
        client.query(
            "SELECT * FROM commandesmenus",
            function(error, result) {
                if (error) {
                    console.log("getMenus: error -> " + error);
                    onError(error);
                } else {
                    console.log("getMenus: ok -> " + result.rows);
                    onSuccess(result.rows);
                }
            });
    },
};

