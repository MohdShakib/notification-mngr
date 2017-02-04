"use strict";
var mysqlService = require('./mysqlService');

var tables = {
    NOTIFICATION_TYPE: 'notification.notification_type',
    SAVED_NOTIFICATION: 'notification.saved_notification',
    NOTIFICATION_MEDIUM: 'notification.notification_medium',
    NOTIFICATION_GENERATED: 'notification.notification_generated',
    NOTIFICATION_OPENED: 'notification.notification_opened',
    NOTIFICATION_TYPE_NOTIFICATION_MEDIUM_MAPPING: 'notification.notification_type_notification_medium_mapping',
}

// function date6MonthAgo(){
//     var date = new Date();
//     var last = new Date(date.getTime() - ((6*30) * 24 * 60 * 60 * 1000));
//     var day =last.getDate();
//     var month=last.getMonth()+1;
//     var year=last.getFullYear();
//     return `${year}-${month}-${day}`;
// }

function getNotificationGenerated({notificationTypeId, mediumId, status, openStatus, page, fromDate, toDate, lastHour, orderBy}, showCount, checkNextPage) {

    var openQuerySelector = '',
        openSubQuerySelector = '',
        offset, perPageCount = 50;

    page = page || 1;
    status = status ? `"${status}"` : `status`;
    mediumId = mediumId ? parseInt(mediumId) : `notification_medium_id`;
    notificationTypeId = notificationTypeId ? parseInt(notificationTypeId) : `notification_type_id`;

    let openQuery = function(){
        return '';
    }
    if (openStatus == 'opened') {
        openQuery = function(ref){
            return ` inner join ${tables.NOTIFICATION_OPENED} t1 on ${ref}.id=t1.notification_generated_id `;
        }
        openQuerySelector = ', t1.is_open as is_open ';
        openSubQuerySelector = ', t1.id as is_open ';
    }

    if (checkNextPage) {
        offset = (page) * perPageCount;
    } else {
        offset = (page - 1) * perPageCount;
    }

    var dateFrom = 'DATE_SUB(DATE_ADD(NOW(),INTERVAL 19800 SECOND), INTERVAL 90 DAY)';
    if (fromDate) {
        dateFrom = '"' + fromDate + '"';
    }

    if (lastHour != undefined) {
        dateFrom = `DATE_SUB(DATE_ADD(NOW(),INTERVAL 19800 SECOND), INTERVAL ${lastHour} HOUR)`;
    }

    var dateTo = 'DATE_ADD(NOW(),INTERVAL 19800 SECOND)';
    if (toDate) {
        dateTo = `"${toDate}"`;
    }

    if (lastHour == 'true'){
        dateTo = 'DATE_ADD(NOW(),INTERVAL 19800 SECOND)';
    }

    var limit = ` LIMIT ${offset} ,${perPageCount}`,
        orderPrefix = ' ORDER BY ',
        orderSuffix = 'id DESC';

    if (orderBy != undefined) {
        var map = new Array();
        map['createDateAsc'] = 'created_at ASC';
        map['createDateDesc'] = 'created_at DESC';
        map['scheduleDateAsc'] = 'schedule_date ASC';
        map['scheduleDateDesc'] = 'schedule_date DESC';

        orderSuffix = map[orderBy] || orderSuffix;
    }


    var subQuerySelector = 't2.id AS id, ' +
        't2.notification_type_id AS notification_type_id, ' +
        't2.notification_medium_id AS notification_medium_id, ' +
        't2.notification_message_id AS notification_message_id, ' +
        't2.user_id AS user_id, ' +
        't2.data AS data, ' +
        't2.status AS status, ' +
        't2.schedule_date AS schedule_date, ' +
        't2.created_at AS created_at, ' +
        't2.updated_at AS updated_at ' +
        openSubQuerySelector;

    if (showCount) {
        subQuerySelector = 'count(t2.id) AS count ';
        //subQuerySelector = `t2.id AS id, t2.notification_type_id AS notification_type_id, t2.notification_medium_id AS notification_medium_id`;
    }

    var subQuery = `SELECT ${subQuerySelector}
        FROM ${tables.NOTIFICATION_GENERATED} as t2 ${openQuery('t2')}, (SELECT t2_0.id as id
            FROM ${tables.NOTIFICATION_GENERATED} as t2_0
            ${openQuery('t2_0')}
            WHERE DATE(t2_0.created_at) BETWEEN ${dateFrom} AND ${dateTo}
            AND t2_0.notification_medium_id = ${mediumId}
            AND t2_0.notification_type_id = ${notificationTypeId}
            AND t2_0.status = ${status} ${!showCount ?  'ORDER BY t2_0.id DESC '+ limit : ''}
        ) as t2_0_set
        WHERE t2_0_set.id = t2.id`;

    let selectorFields = `t1.id AS id, t1.notification_type_id AS typeId,
            t1.notification_medium_id AS mediumId, t2.name AS mediumname,
            t3.name AS notificationname, t1.notification_message_id AS messageId,
            t1.user_id AS userId, t1.status AS status,
            t1.schedule_date AS scheduleDate, t1.created_at AS createdAt,
            t1.updated_at AS updatedAt ${openQuerySelector}`;

        //selectorFields = showCount ? `count(t1.id) as count` : selectorFields;

    var query = `SELECT ${selectorFields} FROM
            ( ${subQuery} ) t1
            JOIN ${tables.NOTIFICATION_MEDIUM} t2 ON t2.id=t1.notification_medium_id
            JOIN ${tables.NOTIFICATION_TYPE} t3 ON t3.id=t1.notification_type_id`;

    if (showCount) {
        return mysqlService.execQuery(subQuery).then(function(rows) {
            return rows;
        }).catch(function(error){
            throw error;
        });
    } else {
        return mysqlService.execQuery(query).then(function(rows) {
            return rows;
        }).catch(function(error){
            throw error;
        });
    }
}

function getNotificationDataByGeneratedId(id) {
    var query = `SELECT
        nmt.name as mediumName,
        ngt.notification_medium_id as mediumId,
        ngt.notification_message_id as messageId,
        nolt.id as isOpen,
        ntt.name as typeName,
        ngt.notification_type_id as typeId,
        ngt.user_id as user_id,
        ngt.id as id,
        ngt.status as status,
        ngt.created_at as created_at,
        ngt.schedule_date as schedule_date,
        ngt.data as data,
        sn.populated_message as populated_message,
        ntnmm.send_template as send_template
        FROM ${tables.NOTIFICATION_GENERATED} ngt
        JOIN ${tables.NOTIFICATION_MEDIUM} nmt ON ngt.notification_medium_id = nmt.id
        JOIN ${tables.NOTIFICATION_TYPE} ntt ON ngt.notification_type_id = ntt.id
        LEFT OUTER JOIN ${tables.SAVED_NOTIFICATION} sn ON sn.notification_generated_id = ngt.id
        LEFT OUTER JOIN ${tables.NOTIFICATION_OPENED} nolt ON ngt.id = nolt.notification_generated_id
        LEFT OUTER JOIN ${tables.NOTIFICATION_TYPE_NOTIFICATION_MEDIUM_MAPPING} ntnmm
        ON (ntnmm.notification_type_id = ngt.notification_type_id and ntnmm.notification_medium_id = ngt.notification_medium_id)
        where ngt.id = ${id} `;



    return mysqlService.execQuery(query).then(function(rows) {
        return rows[0];
    }).catch(function(error){
        throw error;
    });

}

module.exports = {
    getNotificationGenerated,
    getNotificationDataByGeneratedId
}
