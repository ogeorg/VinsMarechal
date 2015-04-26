var pg = require('pg'),
    connStr = process.env.DATABASE_URL,
    client = new pg.Client(connStr);
client.connect();


function _selectData(compId, onGetDataSuccess, onError) {
    client.query(
        'SELECT lst_vins, lst_shop FROM listevins WHERE lst_compid=$1',
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
                    onGetDataSuccess(row.lst_vins, row.lst_shop);
                } else {
                    onError({command: "SELECT", rowCount: rows.length, message: "more than 1 row found"});
                }
            }
        });
}

function _insertData(compId, vins, shop, onSuccess, onError)
{
    console.log("_insertData", vins, shop)
    client.query(
        'INSERT INTO listevins (lst_compid, lst_vins, lst_shop, lst_datemod) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
        [compId, vins, shop],
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

function _updateDataOrInsert(compId, vins, shop, onSuccess, onError)
{
    vins = JSON.stringify(vins);
    shop = JSON.stringify(shop);
    console.log("_updateDataOrInsert", vins, shop)
    client.query(
        'UPDATE listevins SET lst_vins=$2, lst_shop=$3, lst_datemod=CURRENT_TIMESTAMP WHERE lst_compid=$1',
        [compId, vins, shop],
        function(error, result) {
            if (error) {
                console.log("_updateDataOrInsert - error, message =", error)
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
                    _insertData(compId, vins, shop, onSuccess, onError);
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
        'DELETE FROM listevins WHERE lst_compid = $1',
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
function getData(compId, onGetDataSuccess, onError) 
{
    if (compId) {
        var data = _selectData(compId, onGetDataSuccess, onError);
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
function setData(compId, vins, shop, onSuccess, onError)
{
    console.log("setData - compId =", compId);
    console.log("setData - vins =", vins);
    console.log("setData - shop =", shop);
    if (compId) {
        _updateDataOrInsert(compId, vins, shop, onSuccess, onError);
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

function insertCommand(compId, cl, cms, com, onSuccess, onError)
{
    if (compId) {
        console.log("insertCommand", compId, cl, com);
        console.log(cms);
        cms = JSON.stringify(cms);
        console.log(cms);
        client.query(
            "INSERT INTO commandesvins (cmd_date, cmd_compid, "+
                "cmd_name, cmd_email, cmd_dir_delivery, cmd_dir_facturation, "+
                "cmd_vins, "+
                "cmd_comment) "+
            "VALUES (CURRENT_TIMESTAMP, $1, "+
                "$2, $3, $4, $5, "+
                "$6, "+
                "$7) RETURNING cmd_id",
            [compId, 
                cl.civi + " " + cl.nom, cl.email, cl.dirlivr, cl.dirfact,
                cms,
                com],
            function(error, result) {
                if (error) {
                    onError({command: "INSERT", rowCount: 0, message: error});
                } else {
                    /*
                    INSERT: { command: 'INSERT',
                      rowCount: 1,
                      oid: 0,
                      rows: [ { cmd_id: '1' } ],
                      fields: 
                       [ { name: 'cmd_id',
                           tableID: 24610,
                           columnID: 1,
                           dataTypeID: 1700,
                           dataTypeSize: -1,
                           dataTypeModifier: -1,
                           format: 'text' } ],
                      _parsers: [ [Function] ],
                      RowCtor: [Function],
                      rowAsArray: false,
                      _getTypeParser: [Function] }
                    */
                    onSuccess({command: "INSERT", rowCount: 1});
                }
            });
    } else {
        onError({command: "insertCommand", rowCount:0, message: "id du composant non spécifié"});
    }
}

module.exports = {
    getData: getData,
    setData: setData,
    removeData: removeData,
    insertCommand: insertCommand
};
