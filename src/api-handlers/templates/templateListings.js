"use strict";

const   notificationTemplateQuery = require('../../services/queries/notificationTemplateQuery'),
        templateParser = require('../../parsers/templateParser');


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

        module.exports = function(req, res, next) {
            var mediumId = req.params.mediumId;
            var allTemplates = notificationTemplateQuery.getAllTemplates(mediumId);
            allTemplates.then((templatesData) => {
                let templates = _parseTemplates(templatesData);
                res.send({
                    data: templates
                })
            }, () => {
                next(err);
            });
        }
