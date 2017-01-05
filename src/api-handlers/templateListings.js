"use strict";

const   notificationTemplateQuery = require('../services/queries/notificationTemplateQuery'),
        notificationMediumsQuery = require('../services/queries/notificationMediumsQuery'),
        notificationTypesQuery = require('../services/queries/notificationTypesQuery'),
        templateParser = require('../parsers/templateParser');


        function _parseTemplates(templatesData){
            var data = [], parsedContent;
            templatesData = templatesData || [];
            for (var i = 0; i < templatesData.length; i++) {
                data[i] = templatesData[i];

                parsedContent = templateParser.getTemplateContent(data[i].template, data[i].id);

                data[i].template = parsedContent.template;
                data[i].prop1 = parsedContent.prop1;
                data[i].prop2 = parsedContent.prop2;
                data[i].type = parsedContent.type;
            }
            return data;
        }

        module.exports = function(req, res) {
            var mediumId = req.params.mediumId;

            var allTemplates = notificationTemplateQuery.getAllTemplates(mediumId),
                notificationMediums = notificationMediumsQuery.getNotificationMediums(),
                notificationTypes = notificationTypesQuery.getNotificationTypes();

            Promise.all([allTemplates, notificationMediums, notificationTypes]).then((promiseAllData) => {
                allTemplates = _parseTemplates(promiseAllData[0]);
                notificationMediums = promiseAllData[1];
                notificationTypes = promiseAllData[2];
                res.send({
                    data: {
                        allTemplates,
                        notificationTypes,
                        notificationMediums
                    }
                })
            }, (error) => {

            });
        }
