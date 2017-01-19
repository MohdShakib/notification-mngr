"use strict";

const   apiConfig = require('../config/apiConfig'),
        apiService = require('../services/apiService'),
        async = require('async'),
        CHUNKS_SIZE = 100;

function scheduleNotification(req, res, next){

    let postData = req.body || {};

    let users = postData.users,
        mediumName = postData.mediumName,
        notificationTypeName = postData.notificationTypeName,
        userArr = [], mapArr = [];

    let senderPayload = {
        notificationType: notificationTypeName,
        payloadMap: postData.templateData,
        mediumDetails: [{
            mediumType: mediumName
        }]
    }

    if(postData.scheduling && postData.scheduling.holdingPeriodType && postData.scheduling.periodValue){
        senderPayload['scheduling'] = [{
            mediumScheduling: {
                holdingPeriodType: postData.scheduling.holdingPeriodType,
                periodValue: postData.scheduling.periodValue
            }
        }];
    }

    while (users.length) {
        userArr.push(users.splice(0, CHUNKS_SIZE));
    }

    for (var i = 0; i < userArr.length; i++) {
        let sendData = Object.assign({}, senderPayload);
            sendData['users'] = userArr[i];
        mapArr.push(JSON.parse(JSON.stringify(sendData)));
    }

    async.map(mapArr, (sendData, callback) => {
        apiService.post(apiConfig.sendNotification(), {
            body: sendData
        }).then(function(res) {
            callback(null, res);
        }, function(err) {
            callback(err, null);
        });
    }, (err, results) => {
        if(err){
            let message = err && err.message || 'Error while scheduling notification';
            let error = new Error(message);
            return next(error);
        }
        res.send({
            data: null,
            message: 'notification scheduled successfully.'
        });
    }, (error) => {
        return next(error);
    });
}

module.exports = {
    scheduleNotification
}
