var notificationTemplateService = require('../services/queries/notificationTemplateQuery'),
    templateParser = require('../parsers/templateParser'),
    getData = require('velocity').Data

var templateColumn = "send_template";



function getTemplateDetails(req, res){
    let notificationTypeId = req.query.notificationTypeId,
        mediumId = req.query.mediumId;

    if(notificationTypeId && mediumId){
        notificationTemplateService.checkExistingTemplate(notificationTypeId, mediumId).then(function(templateDetails) {
            let data = null, parsedContent,
                extractData, extractResult;

            templateDetails = templateDetails && templateDetails[0];
            if(templateDetails){

                parsedContent = templateParser.getTemplateContent(templateDetails[templateColumn]);

                data = {};
                data.id = templateDetails.id;
                data.mediumId = templateDetails.notification_medium_id;
                data.notificationTypeId = templateDetails.notification_type_id;
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
