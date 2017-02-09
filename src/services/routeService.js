"use strict";

const slash = require('express-slash'),
    logger = require('./loggerService'),
    userService = require('./userService');

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

    function userData(req, res, next) {
        let error = new Error('Authencation failed !');
        error.status = 401;

        userService.isValidUserLoggedIn(req).then((response) => {
            next();
        }, (err) => {
            next(error);
        });
    }

    app.get('/apis/audience-manager/segments', require('api-handlers/segmentsList').getAllSegements);

    app.get('/apis/template-detail/:id?', require('api-handlers/templates/templateDetail'));
    app.get('/apis/template-listings/:mediumId?', require('api-handlers/templates/templateListings'));
    app.post('/apis/template/create', userData, require('api-handlers/templates/createTemplate'));
    app.post('/apis/template/update/:id', userData, require('api-handlers/templates/updateTemplateDetail').updateTemplate);
    app.delete('/apis/template/delete/:id', userData, require('api-handlers/templates/updateTemplateDetail').deleteTemplate);

    app.get('/apis/notification-types', require('api-handlers/notifications/notificationDetail').notificationTypesList);
    app.get('/apis/notification-mediums', require('api-handlers/notifications/notificationDetail').notificationMediumsList);
    app.get('/apis/notification-detail/:id', require('api-handlers/notifications/notificationDetail').notificationDetailsById);
    app.get('/apis/notification-listings', require('api-handlers/notifications/notificationListings'));
    app.post('/apis/notification-types/create/:notificationTypeName', userData, require('api-handlers/notifications/notificationDetail').createNotificationType);
    app.post('/apis/notification-types/schedule', userData, require('api-handlers/notifications/scheduleNotification').scheduleNotification);

    app.get('/apis/campaign-detail/:id', require('api-handlers/campaigns/campaignDetail').getCampaignDetailsById);
    app.get('/apis/campaign-listings', require('api-handlers/campaigns/campaignListings'));
    app.post('/apis/campaign/create', userData, require('api-handlers/campaigns/upsertCampaign').upsertCampaign);
    app.post('/apis/campaign/update/:id', userData, require('api-handlers/campaigns/upsertCampaign').upsertCampaign);
    app.delete('/apis/campaign/delete/:id', userData, require('api-handlers/campaigns/upsertCampaign').deleteCampaign);

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
