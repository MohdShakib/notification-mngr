"use strict";

var mysql = require("mysql");

var connection = mysql.createPool({
    connectionLimit: 50,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

module.exports.execQuery = function(q) {

    console.time("Query time");
    return new Promise(function(resolve, reject) {

        connection.query(q, function(err, rows) {
            if (err) {
                reject(err);
                throw err;
            }
            console.log("---QUERY: ", q)
            console.timeEnd("Query time");

            resolve(rows);

        });
    });
}

module.exports.execQueryParams = function(q, obj) {
    console.time("Query time");
    return new Promise(function(resolve, reject) {
        connection.query(q, obj, function(err, rows) {
            if (err) {
                reject(err);
                throw err;
            }
            console.log("---QUERY: ", q, obj)
            console.timeEnd("Query time");
            resolve(rows);
        });
    });
}
