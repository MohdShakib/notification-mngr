var notificationTemplateService = require('../services/queries/notificationTemplateQuery');
    notificationMediumsService = require('../services/queries/notificationMediumsQuery');
    notificationTypesService = require('../services/queries/notificationTypesQuery'),
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
    var mediumId = req.query.medium;
    if (!req.query.medium)
        mediumId = 0;

    var allTemplates = notificationTemplateService.getAllTemplates(mediumId),
        notificationMediums = notificationMediumsService.getNotificationMediums(),
        notificationTypes = notificationTypesService.getNotificationTypes();

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
