
"use strict";

var mysql = require("mysql");

var connectionPool = mysql.createPool({
    connectionLimit: 50,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

connectionPool.on('connection', function (connection) {
  //console.log('__________________________connection craeted_______________');
});

connectionPool.on('enqueue', function () {
  //console.log('__________________________connection enqueued_______________');
});

module.exports.execQuery = function(q) {

    return new Promise(function(resolve, reject) {

        connectionPool.getConnection(function(err, connection) {
            if(err){
                let error = new Error('Could not create pool connection');
                return reject(error);
            }

            connection.query(q, function(err, rows) {
                if (err) {
                    connection.release();
                    reject(err);
                    throw err;
                }

                console.log("---QUERY: ", q)

                connection.release();
                return resolve(rows);

            });
        });

    });
}

module.exports.execQueryParams = function(q, obj) {

    return new Promise(function(resolve, reject) {
        connectionPool.getConnection(function(err, connection) {
            if(err){
                let error = new Error('Could not create pool connection');
                return reject(error);
            }

            connection.query(q, obj, function(err, rows) {
                if (err) {
                    connection.release();
                    reject(err);
                    throw err;
                }
                console.log("---QUERY: ", q, obj)

                connection.release();
                return resolve(rows);
            });
        });
    });
}
