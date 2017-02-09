"use strict";


const notificationTemplateQuery = require('../../services/queries/notificationTemplateQuery'),
    templateLoggingQuery = require('../../services/queries/templateLoggingQuery'),
    campaignsQuery = require('../../services/queries/campaignsQuery'),
    apiConfig = require('../../config/apiConfig'),
    apiService = require('../../services/apiService'),
    templateParser = require('../../parsers/templateParser'),
    templateColumn = "send_template";

var getData = require('velocity').Data,
    Engine = require('velocity').Engine,
    engine, renderEngine,
    result, renderResult;

var additionalVariables = ['unSubscribedLink'];

var successRes = {
    data: null,
    message: 'template updated successfully.'
};

function updateTemplate(req, res, next){

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
        return res.send(successRes);
    }else if(isTypeObject && currentTemplate == prevTemplate) {
        // no update required
        return res.send(successRes);
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

                let flushApi = apiService.get(apiConfig.flushApi({
                    query: {
                        notificationMediumId: prevData.mediumId,
                        notificationTypeId: prevData.notificationTypeId
                    }
                }));
                flushApi.then((flushData) => {
                    if (flushData.statusCode == '2XX') {
                        templateLoggingQuery.generateTemplateLog({
                            templateId,
                            notificationTypeId: prevData.notificationTypeId,
                            mediumId: prevData.mediumId,
                            content: prevTemplate,
                            userId: req.user && req.user.id
                        }).then(() => {
                            return res.send(successRes);
                        });
                    }else {
                        return res.send(successRes);
                    }
                }, () => {
                    return res.send(successRes);
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



function deleteTemplate(req, res, next){

    let templateId = req.params.id,
        customErr;

    // var getCampaignsByTemplateIdPromise = function(){
    //     return campaignsQuery.getCampaignsByTemplateId(templateId);
    // }

    /* to bypass campaign check for now */
    var getCampaignsByTemplateIdPromise = function(){
        return new Promise((resolve, reject)=>{
            resolve(null);
        });
    }

    notificationTemplateQuery.getTemplate(templateId).then((templateData) => {
        let templateDetail = templateData && templateData[0];

        templateLoggingQuery.generateTemplateLog({
            templateId: templateDetail.id,
            notificationTypeId: templateDetail.notification_type_id,
            mediumId: templateDetail.notification_medium_id,
            content: templateDetail['send_template'],
            userId: req.user && req.user.id
        });

        getCampaignsByTemplateIdPromise().then((rows) => {
            let campaignsCount = rows && rows[0].count;
            if(campaignsCount){
                customErr = new Error(`template is in use by ${campaignsCount} campaigns. Can not be deleted !`);
                customErr.status = 403;
                return next(customErr);
            }else {
                return notificationTemplateQuery.deleteTemplate(templateDetail.id);
            }
        }, () => {
            customErr = new Error('get template campaigns query failed');
            return next(customErr);
        }).then(() => {
            return res.send({
                data: null,
                message: 'template deleted successfully, refresh to see changes.'
            });
        }).catch(() => {
            customErr = new Error('delete template query failed.');
            return next(customErr);
        });

    }, () => {
        customErr = new Error('error whilte checking template existence.');
        return next(customErr);
    });

}

module.exports = {
    updateTemplate,
    deleteTemplate
}
