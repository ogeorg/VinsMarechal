var pg = require('pg'),
    connStr = process.env.DATABASE_URL,
    client = new pg.Client(connStr);
client.connect();


function _selectData(compId, onSuccess, onError) {
    client.query(
        'SELECT data FROM "TestConnection" WHERE "compId"=$1',
        [compId],
        function(error, result) {
            if (error) {
                console.log(Object.keys(error));
                onError(error);
            } else {
                var rows = result.rows;
                if (rows.length == 0) {
                    onError({command: "SELECT", rowCount: 0, message: "no row found"});
                } else if (rows.length == 1) {
                    var row = rows[0];
                    onSuccess(row.data);
                } else {
                    onError({command: "SELECT", rowCount: rows.length, message: "more than 1 row found"});
                }
            }
        });
}

function _insertData(compId, data, onSuccess, onError)
{
    client.query(
        'INSERT INTO "TestConnection" ("compId", data) VALUES ($1, $2)',
        [compId, data],
        function(error, result) {
            if (error) {
                onError({command: "INSERT", rowCount: 0, message: error});
            } else {
                // console.log("INSERT:", result);
                /*
                result { 
                    command: 'INSERT',
                    rowCount: 1,
                    oid: 0,
                    rows: [],
                    fields: [],
                    _parsers: [],
                    RowCtor: null,
                    rowAsArray: false,
                    _getTypeParser: [Function] }
                */
                onSuccess({command: "INSERT", rowCount: 1});
            }
        });
}
function _updateDataOrInsert(compId, data, onSuccess, onError)
{
    client.query(
        'UPDATE "TestConnection" SET data=$2 WHERE "compId"=$1',
        [compId, data],
        function(error, result) {
            if (error) {
                onError({command: "UPDATE", rowCount: 0, message: error});
            } else {
                /*
                result { 
                    command: 'UPDATE',
                    rowCount: 1,
                    oid: NaN,
                    rows: [],
                    fields: [],
                    _parsers: [],
                    RowCtor: null,
                    rowAsArray: false,
                    _getTypeParser: [Function] }
                */
                if (result.rowCount == 0) {
                    _insertData(compId, data, onSuccess, onError);
                } else if (result.rowCount == 1) {
                    onSuccess({command: "UPDATE", rowCount: 1});
                } else {
                    onError({command: "UPDATE", rowCount: result.rowCount, message: "More than one row updated"});
                }
            }
        });
}

function _deleteData(compId, onSuccess, onError) 
{
    client.query(
        'DELETE FROM "TestConnection" WHERE "compId" = $1',
        [compId],
        function(error, result) {
            if (error) {
                onError(error);
            } else {
                // console.log("DELETE:", result);
                /*
                result { command: 'DELETE',
                    rowCount: 1,
                    oid: NaN,
                    rows: [],
                    fields: [],
                    _parsers: [],
                    RowCtor: null,
                    rowAsArray: false,
                    _getTypeParser: [Function] }
                */
                if (result.rowCount == 0) {
                    onSuccess({command: "DELETE", rowCount: 0, message: "No row deleted"});
                } else if (result.rowCount == 1) {
                    onSuccess({command: "DELETE", rowCount: 1, message: "Row deleted"});
                } else {
                    onError({command: "DELETE", rowCount: result.rowCount, message: "More than one row deleted"});
                }
            }
        });

}

/**
 * Obtient les données associées à un widget
 *
 * @param compId id du widget
 * @param function onSuccess(data), avec data = {name: <name>, age: <age>}
 * @param function onError(error), avec error = {command: "SELECT", rowCount: <nbRows>, message: <message d'erreur>} 
 */
function getData(compId, onSuccess, onError) 
{
    if (compId) {
        var data = _selectData(compId, onSuccess, onError);
    } else {
        onError({command: "getData", rowCount:0, message: "id du composant non spécifié"});
    }
}

/**
 * Insert des données pour un widget
 * 
 * @param compId id du widget
 * @param data les données
 * @param function onSuccess(result), avec result = {command: "UPDATE"|"INSERT"} 
 * @param function onError(error), avec error = {command: "UPDATE"|"INSERT", rowCount: <nbRows>, message: <message d'erreur>} 
 */
function setData(compId, data, onSuccess, onError)
{
    if (compId) {
        var data = _updateDataOrInsert(compId, data, onSuccess, onError);
    } else {
        onError({command: "setData", rowCount:0, message: "id du composant non spécifié"});
    }
}

function removeData(compId, onSuccess, onError)
{
    if (compId) {
        var data = _deleteData(compId, onSuccess, onError);
    } else {
        onError({command: "removeData", rowCount:0, message: "id du composant non spécifié"});
    }
}

module.exports = {
    getData: getData,
    setData: setData,
    removeData: removeData
};

// select data->'name' from "TestConnection";
/*
    function(compId, onSuccess, onError) {
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

function setData(compId, data) 
{

}
function insertData(compId, data) 
{

}

function updateData(compId, data)
{

}
module.exports = {
    getData: getData,
    setData: function(compId, onSuccess, onError) {
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

*/