const   mysqlService = require('./mysqlService');

        let SAVED_NOTIFICATION = 'notification.saved_notification';

        function getPopulatedMessage (id) {
            var query = `SELECT * from ${SAVED_NOTIFICATION} WHERE notification_generated_id = ${id}`;

            return mysqlService.execQuery(query).then(function(rows) {
                return rows;
            });
        }

        module.exports = {
            getPopulatedMessage
        }
