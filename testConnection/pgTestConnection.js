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
                    onError({command: "SELECT", message: "no row found"});
                } else if (rows.length == 1) {
                    var row = rows[0];
                    onSuccess(row.data);
                } else {
                    onError({command: "SELECT", message: "more than 1 row found"});
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
                onError(error);
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
                if (result.rowCount == 1) {
                    onSuccess(result.command);
                } else {
                    onError({command: "INSERT", message: "could not insert data"});
                }
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
                onError({command: "UPDATE", message: error});
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
                if (result.rowCount == 1) {
                    onSuccess(result.command);
                } else {
                    _insertData(compId, data, onSuccess, onError);
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
                    onSuccess({command: result.command, rowCount: 0, message: "No row deleted"});
                } else if (result.rowCount == 1) {
                    onSuccess({command: result.command, rowCount: 1, message: "Row deleted"});
                } else {
                    onError({command: result.command, rowCount: result.rowCount, message: "More than one row deleted"});
                }
            }
        });

}

/**
 * 
 * @param compId id du widget
 * @param onSuccess == function(data)
 * @param onError == function(errMsg)
 */
function getData(compId, onSuccess, onError) 
{
    if (compId) {
        var data = _selectData(compId, onSuccess, onError);
    } else {
        onError("id du composant non spécifié");
    }
}

function setData(compId, data, onSuccess, onError)
{
    if (compId) {
        var data = _updateDataOrInsert(compId, data, onSuccess, onError);
    } else {
        onError({command: "setData", message: "id du composant non spécifié"});
    }
}

function removeData(compId, onSuccess, onError)
{
    if (compId) {
        var data = _deleteData(compId, onSuccess, onError);
    } else {
        onError({command: "removeData", message: "id du composant non spécifié"});
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