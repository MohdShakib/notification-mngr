//var notificationTemplateService = require('../services/notificationTemplateService');
//var notificationMediumsService = require('../services/notificationMediumsService');
//var notificationTypesService = require('../services/notificationTypesService');
var notificationGeneratedService = require('../services/queries/notificationGeneratedQuery');
var typeId, mediumId;
var async = require('async')


module.exports = function(req, res) {

    var query  = req.query || {};
    var locals = {};

    async.parallel([
        function(callback) {
            notificationGeneratedService.getNotificationGenerated(query, false).then(function(rows) {
                locals.content = rows;
                callback();
            });
        },
        function(callback) {
            notificationGeneratedService.getNotificationGenerated(query, true).then(function(rows) {
                locals.totalCount = rows && rows[0] && rows[0].count;
                callback();
            });
        },

        // function(callback) {
        //     notificationGeneratedService.getNotificationGenerated(query, false, true).then(function(rows) {
        //         locals.checkNextPage = rows;
        //         callback();
        //     });
        // },

        // function(callback) {
        //     notificationMediumsService.getNotificationMediums().then(function(notificationMediums) {
        //         locals.mediums = notificationMediums;
        //         callback();
        //     });
        // },

        // function(callback) {
        //     if (mediumId == 0) {
        //         notificationTypesService.getNotificationTypes().then(function(notificationTypes) {
        //             locals.types = notificationTypes;
        //             callback();
        //         });
        //     } else {
        //         notificationTemplateService.getNotificationTypesByMedium(mediumId).then(function(notificationTypes) {
        //             locals.types = notificationTypes;
        //             callback();
        //         });
        //     }
        // }
    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
        if (err) return next(err); //If an error occured, we let express/connect handle it by calling the "next" function
        //Here locals will be populated with 'user' and 'posts'

            res.send({
                data: {
                    totalCount: locals.totalCount,
                    content: locals.content
                }
            });

                // medium: locals.mediums,
                // notification: locals.types,
                // content: locals.content,
                // totalCount: locals.totalCount,
                // pageNo: pageNo,
                // scheduleDate: sortScheduleDate,
                // createDate: sortCreateDate,
                // updateDate: sortUpdateDate,
                // loggedIn: loggedIn,
                // recordsCount: locals.content.length,
                // nextPage: locals.checkNextPage.length,
                // home: process.env['HOME_URL']

    });


};
