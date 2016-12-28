"use strict";

var mysqlService = require('./mysqlService');

var NOTIFICATION_MEDIUM = 'notification.notification_medium';

function getNotificationMediums() {
    var data = [];
    var query = `SELECT * from ${NOTIFICATION_MEDIUM} ORDER BY TRIM(name)`;

    return mysqlService.execQuery(query).then(function(rows) {
        for (var i = 0; i < rows.length; i++) {
            data[i] = rows[i];

        };
        return data;
    });
}

function getMediumNameById(id){
    var query = `SELECT name from ${NOTIFICATION_MEDIUM} WHERE id = ?`;
    var obj = id;

    return mysqlService.execQueryParams(query, obj).then(function(rows) {
        return rows;
    });
}

module.exports = {
    getMediumNameById,
    getNotificationMediums
};
