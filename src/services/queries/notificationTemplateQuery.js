"use strict";

var mysqlService = require('./mysqlService');

var tables = {
    NOTIFICATION_TYPE: 'notification.notification_type',
    NOTIFICATION_MEDIUM: 'notification.notification_medium',
    NOTIFICATION_TYPE_NOTIFICATION_MEDIUM_MAPPING : 'notification.notification_type_notification_medium_mapping'
}

function getAllTemplates(mediumId) {

    if (!mediumId)
        mediumId = `notification_medium_id`;
    else
        mediumId = parseInt(mediumId);

    var query = `SELECT
    t1.id AS id, t1.notification_type_id AS notificationTypeId, t1.notification_medium_id AS mediumId,
    t2.name AS mediumname, t3.name AS notificationname, t1.send_template AS template
    FROM ${tables.NOTIFICATION_TYPE_NOTIFICATION_MEDIUM_MAPPING} t1, ${tables.NOTIFICATION_MEDIUM} t2, ${tables.NOTIFICATION_TYPE} t3
    WHERE t2.id=t1.notification_medium_id AND t3.id=t1.notification_type_id
    AND t1.notification_medium_id = ${mediumId}
    ORDER BY t2.name`;

    return mysqlService.execQuery(query).then(function(rows) {
        return rows;
    });
}

function checkExistingTemplate(notificationTypeId, mediumId) {
    var obj = [notificationTypeId, mediumId];
    var query = `SELECT t1.id as id, t1.notification_type_id as notification_type_id, t1.notification_medium_id as notification_medium_id,
    t1.send_template as send_template, t3.name as notificationname, t2.name as mediumname
    FROM ${tables.NOTIFICATION_TYPE_NOTIFICATION_MEDIUM_MAPPING} t1, ${tables.NOTIFICATION_MEDIUM} t2, ${tables.NOTIFICATION_TYPE} t3
    WHERE t2.id = t1.notification_medium_id AND t3.id = t1.notification_type_id
    AND t1.notification_type_id =? AND t1.notification_medium_id=?`;

    return mysqlService.execQueryParams(query, obj).then(function(rows) {
        return rows;
    });
}

function getNotificationTypesByMedium(mediumId) {
    var query = `SELECT t2.id, t2.name AS name FROM ${tables.NOTIFICATION_TYPE_NOTIFICATION_MEDIUM_MAPPING} t1
    JOIN ${tables.NOTIFICATION_TYPE} t2 ON t2.id=t1.notification_type_id
    where notification_medium_id = ${mediumId}
    ORDER BY t2.name`;
    return mysqlService.execQuery(query).then(function(rows) {
        return rows;
    });
}

function getTemplate(templateId) {
    var query = `SELECT t1.id AS id, t1.notification_type_id AS notification_type_id, t1.notification_medium_id AS notification_medium_id,
    t2.name AS mediumname, t3.name AS notificationname, t1.send_template AS send_template
    FROM ${tables.NOTIFICATION_TYPE_NOTIFICATION_MEDIUM_MAPPING} t1, ${tables.NOTIFICATION_MEDIUM} t2, ${tables.NOTIFICATION_TYPE} t3
    WHERE t2.id=t1.notification_medium_id
    AND t3.id=t1.notification_type_id AND t1.id = ?`;
    var obj = templateId;
    return mysqlService.execQueryParams(query, obj).then(function(rows) {
        return rows;
    });
}

function updateNotificationTemplate(content, id) {
    var query = `UPDATE ${tables.NOTIFICATION_TYPE_NOTIFICATION_MEDIUM_MAPPING}
    SET send_template=? WHERE id=?`;
    var obj = [content, id];
    return mysqlService.execQueryParams(query, obj).then(function(rows) {
        return rows;
    });
}

function createTemplate({ notificationTypeId, mediumId, template }){
    var query = `INSERT INTO ${tables.NOTIFICATION_TYPE_NOTIFICATION_MEDIUM_MAPPING}
    (notification_type_id, notification_medium_id, send_template)
    VALUES (?,?,?)`;

    var obj = [notificationTypeId, mediumId, template];
    return mysqlService.execQueryParams(query,obj).then(function(rows) {
        return rows;
    });
}

function deleteTemplate(id) {
    var query = `DELETE FROM ${tables.NOTIFICATION_TYPE_NOTIFICATION_MEDIUM_MAPPING} WHERE id = ?`;
    var obj = id;

    return mysqlService.execQueryParams(query, obj).then(function(rows) {
        return rows;
    });
}

//
// function addGenericNotificationTemplate(content) {
//     var query = 'INSERT INTO notification_type_notification_medium_mapping SET ?';
//     var obj = content;
//
//     return mysqlService.execQueryParams(query, obj).then(function(rows) {
//         return rows;
//     });
//
// }
//
//
// function addEmailNotificationTemplate(content) {
//
//     var query = 'INSERT INTO notification_type_notification_medium_mapping SET ?';
//     var obj = content;
//
//     return mysqlService.execQueryParams(query, obj).then(function(rows) {
//
//         return rows;
//     });
//
// }
//
//

//
// function findNotificationName(name) {
//     var query = 'SELECT * from notification_type where name = ?';
//     var obj = name;
//     return mysqlService.execQueryParams(query, obj).then(function(rows) {
//
//         return rows;
//     });
//
// }
//
// function insertNewNotificationType(data) {
//     var query = 'INSERT INTO notification_type SET ?';
//     var obj = data;
//     return mysqlService.execQueryParams(query, obj).then(function(rows) {
//
//         return rows;
//     });
//
// }
//

//
//
// function getTemplateParams(type, medium) {
//
//     var query = 'SELECT send_template FROM notification_type_notification_medium_mapping WHERE notification_type_id =? AND notification_medium_id = ?';
//     var obj = [type, medium];
//
//     return mysqlService.execQueryParams(query, obj).then(function(rows) {
//
//         return rows;
//     });
// }
//
//

//
// function getBlogEmailId() {
//     var query = 'SELECT t1.id, t2.name FROM `notification_type_notification_medium_mapping` t1 JOIN notification_type t2 ON t2.id=t1.notification_type_id WHERE t1.notification_medium_id = 1';
//     return mysqlService.execQuery(query).then(function(rows) {
//
//         return rows;
//     });
// }
//
//
// function getNotificationTypeDetails(type) {
//     var query = 'SELECT * from notification_type WHERE id = ' + type;
//     return mysqlService.execQuery(query).then(function(rows) {
//         return rows;
//     });
// }

module.exports = {
    getTemplate,
    getAllTemplates,
    createTemplate,
    deleteTemplate,
    checkExistingTemplate,
    updateNotificationTemplate,
    getNotificationTypesByMedium
}
