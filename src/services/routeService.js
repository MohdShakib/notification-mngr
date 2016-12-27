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


    app.get('/templates-details', require('api-handlers/templatesDetails'));
    app.get('/notifications-details', require('api-handlers/notificationsDetails'));
}
