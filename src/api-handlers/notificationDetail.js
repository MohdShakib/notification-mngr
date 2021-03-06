"use strict";

const   notificationTypesQuery = require('../services/queries/notificationTypesQuery'),
        notificationMediumsQuery = require('../services/queries/notificationMediumsQuery'),
        notificationGeneratedQuery = require('../services/queries/notificationGeneratedQuery'),
        templateParser = require('../parsers/templateParser'),
        Engine = require('velocity').Engine,
        async = require('async');

var     templateColumn = "send_template",
        populatedMessageColumn = "populated_message";

        function notificationDetailsById(req, res, next){
            async.auto({
                notificationData: function(callback) {
                    return notificationGeneratedQuery.getNotificationDataByGeneratedId(req.params.id).then((response) => {
                        callback(null, response);
                    });
                },
                // userDetail: ['notificationData', function(results, callback) {
                //     return apiService.get(config.getUserDetails, "userId=" + results.notificationData.user_id).then(function(response) {
                //         callback(null, response);
                //     }).catch(function(error) {
                //         callback(error, null);
                //     });
                // }],
            }, function(err, results) {

                    let data = {}, content;

                    let notificationData = results.notificationData || {};

                    if(notificationData[populatedMessageColumn]){
                        content = notificationData[populatedMessageColumn];
                        content = content.replace(/\n|\t/g, "").replace(/  +/g, ' ');
                        content = JSON.stringify(content);
                    }else {
                        let extraAttributes = JSON.parse(notificationData.data).extraAttributes;
                        let velocityTemplate = notificationData[templateColumn] || '';
                        velocityTemplate = velocityTemplate.replace(/\n|\t/g, "").replace(/  +/g, ' ');

                        try {
                            let engine = new Engine({ template: velocityTemplate });
                            content = engine.render(extraAttributes);
                            content = content.replace(/\n|\t/g, "").replace(/  +/g, ' ');
                        } catch (err) {
                            //next(err);
                        }
                    }


                    delete notificationData[templateColumn];
                    delete notificationData[populatedMessageColumn];

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
