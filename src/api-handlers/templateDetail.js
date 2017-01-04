"use strict";

var notificationTemplateQuery = require('../services/queries/notificationTemplateQuery'),
    templateParser = require('../parsers/templateParser'),
    getData = require('velocity').Data

var templateColumn = "send_template";



function getTemplateDetails(req, res){
    let templateId = req.params.id,
        notificationTypeId = req.query.notificationTypeId,
        mediumId = req.query.mediumId;

    let data = null, parsedContent,
        extractData, extractResult,
        getTemplatePromise;

    if(templateId){
        getTemplatePromise = notificationTemplateQuery.getTemplate(templateId);
    }else if(notificationTypeId && mediumId){
        getTemplatePromise = notificationTemplateQuery.checkExistingTemplate(notificationTypeId, mediumId);
    }

    if(getTemplatePromise){
        getTemplatePromise.then((templateDetails) => {
            templateDetails = templateDetails && templateDetails[0];
            if(templateDetails){

                parsedContent = templateParser.getTemplateContent(templateDetails[templateColumn]);

                data = {};
                data.id = templateDetails.id;
                data.mediumId = templateDetails.notification_medium_id;
                data.notificationTypeId = templateDetails.notification_type_id;
                data.notificationName = templateDetails.notificationname;
                data.mediumName = templateDetails.mediumname;
                data.template = parsedContent.template;
                data.extractData = parsedContent.extractData;
                data.prop1 = parsedContent.prop1;
                data.prop2 = parsedContent.prop2;
                data.type  = parsedContent.type;
            }

            res.send({
                data
            });
        });
    }
}


module.exports = function(req, res, next){
    var method = req.method;

    switch (method) {
        case 'GET':
            getTemplateDetails(req, res);
            break;
        default:

    }
}
