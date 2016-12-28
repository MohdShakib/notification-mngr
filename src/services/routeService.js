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


    app.get('/template-listings', require('api-handlers/templateListings'));
    app.get('/template-detail', require('api-handlers/templateDetail'));
    app.get('/notification-listings', require('api-handlers/notificationListings'));
}
