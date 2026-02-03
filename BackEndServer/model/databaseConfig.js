/*


Summary: The databaseConfig.js is used to create the connection with the server.
*/


var mysql =require('mysql2');
var dbconnect = {

    getConnection: function () {

        var conn = mysql.createConnection({

            host: "127.0.0.1",
            user: "root",
            password: "kakeforty",
            database: "sp_games"
        })
        return conn;
    }
}

module.exports = dbconnect