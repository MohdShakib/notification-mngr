var mysqlService = require('./mysqlService');

const NOTIFICATION_TYPE_NOTIFICATION_MEDIUM_MAPPING_LOGS = 'notification.notification_type_notification_medium_mapping_logs';
function generateTemplateLog({templateId, mediumId, notificationTypeId, content, userId}) {
    var query = `INSERT INTO ${NOTIFICATION_TYPE_NOTIFICATION_MEDIUM_MAPPING_LOGS}
    (notification_type_notification_medium_mapping_id,notification_type_id,notification_medium_id,send_template_log,user_id)
    VALUES (?,?,?,?,?)`;

    var obj = [templateId, notificationTypeId, mediumId, content, userId];
    return mysqlService.execQueryParams(query,obj).then(function(rows) {
        return rows;
    }).catch(function(error){
        throw error;
    });
}


module.exports = {
    generateTemplateLog
}
