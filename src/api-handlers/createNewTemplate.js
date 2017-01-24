"use strict";

const notificationTemplateQuery = require('../services/queries/notificationTemplateQuery'),
      Engine = require('velocity').Engine;


var engine, result;

module.exports = function(req, res, next){

    let subject = req.body.subject,
        content = req.body.content,
        mediumId = req.body.mediumId,
        notificationTypeId = req.body.notificationTypeId,
        template, err;

    if(mediumId == 1){
        template = {
            "subject" : subject,
            "body" : content
        }
        template = JSON.stringify(template).replace(/(?:\\[rnt])+/g, "").trim();
    }else {
        template = content;
    }

    engine = new Engine({ template: template });

    try {
        result = engine.render({});


        notificationTemplateQuery.checkExistingTemplate(notificationTypeId, mediumId).then((templateData) => {
            if(templateData && templateData[0]){
                err = new Error('Template for medium type and notification type alredy exist !');
                return next(err);
            }
            notificationTemplateQuery.createTemplate({
                template: template,
                mediumId: mediumId,
                notificationTypeId: notificationTypeId,
            }).then((result) => {
                return res.send({
                    data: null,
                    message: 'template created successfully.'
                });
            }, () => {
                err = new Error('Error while adding new template.');
                return next(err);
            });
        });


    } catch (e) {
        err = new Error('Error while rendering the template.');
        return next(err);
    }

}
