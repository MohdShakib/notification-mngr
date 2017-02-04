"use strict";

var notificationGeneratedQuery = require('../../services/queries/notificationGeneratedQuery');
var typeId, mediumId;
var async = require('async')


module.exports = function(req, res) {

    var query  = req.query || {};
    var locals = {};

    async.parallel([
        function(callback) {
            notificationGeneratedQuery.getNotificationGenerated(query, false).then(function(rows) {
                locals.content = rows;
                callback();
            });
        },
        function(callback) {
            notificationGeneratedQuery.getNotificationGenerated(query, true).then(function(rows) {
                locals.totalCount = rows && rows[0] && rows[0].count;
                callback();
            });
        }
    ], function(err) {
        if (err) return next(err); //If an error occured, we let express/connect handle it by calling the "next" function
        //Here locals will be populated with 'user' and 'posts'
            res.send({
                data: {
                    totalCount: locals.totalCount,
                    content: locals.content
                }
            });
    });
};
