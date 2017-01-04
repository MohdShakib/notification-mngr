"use strict";


const notificationTemplateQuery = require('../services/queries/notificationTemplateQuery'),
    templateLoggingQuery = require('../services/queries/templateLoggingQuery'),
    apiConfig = require('../config/apiConfig'),
    apiService = require('../services/apiService'),
    templateParser = require('../parsers/templateParser'),
    templateColumn = "send_template";

var getData = require('velocity').Data,
    Engine = require('velocity').Engine,
    engine, renderEngine,
    result, renderResult;

var additionalVariables = ['unSubscribedLink'];

var updatedObj = {
    data: null,
    message: 'template updated successfully.'
};

module.exports = function(req, res, next){

    let templateId = req.params.id,
        data = req.body || {},
        prevData = data.prevData || {},
        isTypeObject = data.type == 'object' ? true : false,
        currentTemplate = data.template,
        prevTemplate = prevData.template,
        validate = true;

    if(isTypeObject){
        prevTemplate = JSON.stringify(prevTemplate);
        currentTemplate = JSON.stringify(currentTemplate);
    }

    prevTemplate = prevTemplate.replace(/(?:\\[rnt])+/g, "").trim();
    prevTemplate = prevTemplate.replace(/  +/g, ' ');

    currentTemplate = currentTemplate.replace(/(?:\\[rnt])+/g, "").trim();
    currentTemplate = currentTemplate.replace(/  +/g, ' ');

    if(!isTypeObject && data.template == prevData.template){
        // no update required
        return res.send(updatedObj);
    }else if(isTypeObject && currentTemplate == prevTemplate) {
        // no update required
        return res.send(updatedObj);
    }else{

        try {

            let oldVars, newVars, oldProps, newProps,
                extractData, extractResult;

            extractData = new getData({
                template: currentTemplate
            });
            extractResult = extractData.extract({});

            oldVars = prevData.extractData;
            newVars = extractResult['raw'];
            oldProps = Object.getOwnPropertyNames(oldVars);
            newProps = Object.getOwnPropertyNames(newVars);

            for (var i = 0; i < additionalVariables.length; i++) {
                while(oldProps.indexOf(additionalVariables[i]) != -1){
                    oldProps.splice(oldProps.indexOf(additionalVariables[i]),1);
                }
                while(newProps.indexOf(additionalVariables[i]) != -1){
                    newProps.splice(newProps.indexOf(additionalVariables[i]),1);
                }
            }

            if (oldProps.length == newProps.length){
                for (var i = 0; i < newProps.length; i++) {
                    if (oldProps.indexOf(newProps[i]) == -1){
                        validate = false;
                    }
                }
            }else {
                validate = false;
            }

            if(!validate){
                let e = new Error('additional or deletion of existing variables is not allowed.');
                e.status = 400;
                return next(e);
            }

            notificationTemplateQuery.updateNotificationTemplate(currentTemplate, templateId).then((response) => {
                // template updated successfully

                let urlData = `notificationMediumId=${prevData.mediumId}&notificationTypeId=${prevData.notificationTypeId}`;
                let flushApi = apiService.get(apiConfig.flushApi, urlData);
                flushApi.then((flushData) => {
                    if (flushData.statusCode == '2XX') {
                        templateLoggingQuery.generateTemplateLog({
                            templateId,
                            notificationTypeId: prevData.notificationTypeId,
                            mediumId: prevData.mediumId,
                            content: prevTemplate,
                            userId: 6807740
                        }).then(() => {
                            return res.send(updatedObj);
                        });
                    }else {
                        return res.send(updatedObj);
                    }
                }, () => {
                    return res.send(updatedObj);
                });

            }, () => {
                let e = new Error('update template query failed.');
                return next(e);
            });

        } catch (err) {
            return next(err);
        }
    }
}
