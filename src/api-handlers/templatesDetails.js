var notificationTemplateService = require('../services/notificationTemplateService');
    notificationMediumsService = require('../services/notificationMediumsService');
    notificationTypesService = require('../services/notificationTypesService');


function _parseTemplates(templatesData){
    var data = [], templatesData = templatesData || [];
    for (var i = 0; i < templatesData.length; i++) {
        data[i] = templatesData[i];
        data[i].template = (data[i].template).replace(/\n|\t/g, "")

        data[i].template = (data[i].template).replace(/  +/g, ' ');
        try {
            data[i].template = JSON.parse(data[i].template);
            data[i].type = 'object';

            if (typeof(data[i].template) != 'object') {
                data[i].template = JSON.parse(data[i].template);
                data[i].type = 'object';

            }

            data[i].prop1 = (Object.getOwnPropertyNames(data[i].template)[0])
            data[i].prop2 = (Object.getOwnPropertyNames(data[i].template)[1])
        } catch (e) {
            data[i].type = 'string';
        }
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
