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



    app.get('/audience-manager/segments', require('api-handlers/segmentsList').getAllSegements);

    app.get('/template-detail/:id?', require('api-handlers/templates/templateDetail'));
    app.get('/template-listings/:mediumId?', require('api-handlers/templates/templateListings'));
    app.post('/template/create', require('api-handlers/templates/createTemplate'));
    app.post('/template/update/:id', require('api-handlers/templates/updateTemplateDetail').updateTemplate);
    app.delete('/template/delete/:id', require('api-handlers/templates/updateTemplateDetail').deleteTemplate);

    app.get('/notification-types', require('api-handlers/notifications/notificationDetail').notificationTypesList);
    app.get('/notification-mediums', require('api-handlers/notifications/notificationDetail').notificationMediumsList);
    app.get('/notification-detail/:id', require('api-handlers/notifications/notificationDetail').notificationDetailsById);
    app.get('/notification-listings', require('api-handlers/notifications/notificationListings'));
    app.post('/notification-types/create/:notificationTypeName', require('api-handlers/notifications/notificationDetail').createNotificationType);
    app.post('/notification-types/schedule', require('api-handlers/notifications/scheduleNotification').scheduleNotification);

    app.get('/campaign-detail/:id', require('api-handlers/campaigns/campaignDetail').getCampaignDetailsById);
    app.get('/campaign-listings', require('api-handlers/campaigns/campaignListings'));
    app.post('/campaign/create', require('api-handlers/campaigns/upsertCampaign').upsertCampaign);
    app.post('/campaign/update/:id', require('api-handlers/campaigns/upsertCampaign').upsertCampaign);
    app.delete('/campaign/delete/:id', require('api-handlers/campaigns/upsertCampaign').deleteCampaign);

    app.get('/apis/users/details', require('api-handlers/users/usersAuth').userDetails);
    app.post('/apis/users/doSocialLogin/:provider', require('api-handlers/users/usersAuth').doSocialLogin);
    app.post('/apis/users/logout', require('api-handlers/users/usersAuth').logout);

    app.use(function(err, req, res, next) {
        let statusCode = err.status || 500;
        return res.status(statusCode).send({
            message: err && err.message,
            stack: err && err.stack
        });
    });
}
