"use strict";

const   notificationTypesQuery = require('../services/queries/notificationTypesQuery'),
        notificationMediumsQuery = require('../services/queries/notificationMediumsQuery'),
        notificationTemplateQuery = require('../services/queries/notificationTemplateQuery'),
        savedNotificationQuery = require('../services/queries/savedNotificationQuery'),
        notificationGeneratedQuery = require('../services/queries/notificationGeneratedQuery'),
        templateParser = require('../parsers/templateParser'),
        Engine = require('velocity').Engine,
        async = require('async');

var     templateColumn = "send_template",
        populatedMessageColumn = "populated_message";

        function notificationDetailsById(req, res){
            async.auto({
                notificationData: function(callback) {
                    return notificationGeneratedQuery.getNotificationDataByGeneratedId(req.params.id).then((response) => {
                        callback(null, response);
                    });
                },
                savedNotificationData: function(callback) {
                    return savedNotificationQuery.getPopulatedMessage(req.params.id).then((response) => {
                        callback(null, response);
                    });
                },
                existingTemplateData: ['notificationData', function(results, callback) {
                    return notificationTemplateQuery.checkExistingTemplate(results.notificationData.typeId, results.notificationData.mediumId).then((response) => {
                        callback(null, response);
                    });
                }],
                // userDetail: ['notificationData', function(results, callback) {
                //     return apiService.get(config.getUserDetails, "userId=" + results.notificationData.user_id).then(function(response) {
                //         callback(null, response);
                //     }).catch(function(error) {
                //         callback(error, null);
                //     });
                // }],
            }, function(err, results) {

                    let data = {}, content;

                    let savedNotificationData = results.savedNotificationData || [],
                        notificationData = results.notificationData;

                    if(savedNotificationData.length){
                        content = savedNotificationData[0][populatedMessageColumn];
                        content = content.replace(/\n|\t/g, "").replace(/  +/g, ' ');
                        content = JSON.stringify(content);
                    }else {
                        let extraAttributes = JSON.parse(results.notificationData.data).extraAttributes;
                        let velocityTemplate = results.existingTemplateData && results.existingTemplateData[0] && JSON.stringify(results.existingTemplateData[0][templateColumn]);
                        velocityTemplate = velocityTemplate.replace(/\n|\t/g, "").replace(/  +/g, ' ');

                        try {
                            velocityTemplate = JSON.parse(velocityTemplate)
                        } catch (e) {

                        }

                        let engine = new Engine({ template: velocityTemplate });
                        content = engine.render(extraAttributes);
                        content = content.replace(/\n|\t/g, "").replace(/  +/g, ' ');
                    }

                    let parsedContent = templateParser.getTemplateContent(content);

                    data.template = parsedContent.template;
                    data.prop1 = parsedContent.prop1;
                    data.prop2 = parsedContent.prop2;
                    data.type = parsedContent.type;

                    Object.assign(data, notificationData);

                    res.send({
                        data
                    });

                    //
                    // res.send({
                    //     sentTemplate: result,
                    //     content: results.notificationData,
                    //     mediumName: results.notificationData.mediumName,
                    //     typeName: results.notificationData.typeName,
                    //     loggedIn: loggedIn,
                    //     id: req.params.id,
                    //     //userData: results.userDetail && results.userDetail.data ? results.userDetail.data[0] : {},
                    // });
                    return;
            });
        }

        function notificationTypesList(req, res){

            notificationTypesQuery.getNotificationTypes().then((rows) => {
                res.send({
                    data: rows
                });
            });
        }

        function notificationMediumsList(req, res){

            notificationMediumsQuery.getNotificationMediums().then((rows) => {
                res.send({
                    data: rows
                });
            });
        }


        module.exports = {
            notificationTypesList,
            notificationMediumsList,
            notificationDetailsById
        }
