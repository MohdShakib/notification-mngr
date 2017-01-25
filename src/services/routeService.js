"use strict";

const slash = require('express-slash'),
    logger = require('./loggerService');

var routeService = {};

module.exports.setup = function(app, router){

    app.use('*', function(req, res, next){
        logger.info('hi...... yoho....');
        next();
    });

    app.use(router);
    //app.use(slash());
    app.use((req, res, next) => {
        res.setHeader('Vary', 'User-Agent');
        return next();
    });


    app.get('/template-detail/:id?', require('api-handlers/templateDetail'));
    app.get('/template-listings/:mediumId?', require('api-handlers/templateListings'));

    app.get('/notification-types', require('api-handlers/notificationDetail').notificationTypesList);
    app.get('/notification-mediums', require('api-handlers/notificationDetail').notificationMediumsList);
    app.get('/notification-detail/:id', require('api-handlers/notificationDetail').notificationDetailsById);
    app.get('/notification-listings', require('api-handlers/notificationListings'));

    app.get('/audience-manager/segments', require('api-handlers/segmentsList').getAllSegements);

    app.post('/template/create', require('api-handlers/createNewTemplate'));
    app.post('/template/update/:id', require('api-handlers/updateTemplateDetail').updateTemplate);
    app.delete('/template/delete/:id', require('api-handlers/updateTemplateDetail').deleteTemplate);

    app.post('/notification-types/create/:notificationTypeName', require('api-handlers/notificationDetail').createNotificationType);
    app.post('/notification-types/schedule', require('api-handlers/scheduleNotification').scheduleNotification);

    app.get('/campaign-detail/:id', require('api-handlers/campaignDetail').getCampaignDetailsById);
    app.post('/campaign/create', require('api-handlers/upsertCampaign'));
    app.post('/campaign/update/:id', require('api-handlers/upsertCampaign'));

    app.use(function(err, req, res, next) {
        let statusCode = err.status || 500;
        return res.status(statusCode).send({
            message: err && err.message,
            stack: err && err.stack
        });
    });
}
