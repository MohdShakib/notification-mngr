"use strict";

var mysqlService = require('./mysqlService');

var NOTIFICATION_TYPE = 'notification.notification_type';

function getNotificationTypes() {
    var query = `SELECT * from ${NOTIFICATION_TYPE} ORDER BY TRIM(name)`;
    return mysqlService.execQuery(query).then(function(rows) {
        return rows || [];
    });
}


function getTypeNameById(id) {
    var query = `SELECT name from ${NOTIFICATION_TYPE} WHERE id = ?`;
    var obj = id;

    return mysqlService.execQueryParams(query, obj).then(function(rows) {
        return rows;
    });
}

module.exports = {
    getTypeNameById,
    getNotificationTypes

}
