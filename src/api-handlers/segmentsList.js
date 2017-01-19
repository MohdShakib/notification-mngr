"use strict";"use strict";

const   apiConfig = require('../config/apiConfig'),
        apiService = require('../services/apiService'),
        audienceManagerService = require('../services/audienceManagerService'),
        segmentsParser = require('../parsers/segmentsParser');


function getAllSegements(req, res, next, createNewToken = false){
    let getSegementsList = apiConfig.getSegementsList;
    audienceManagerService.getAccessToken(createNewToken).then((response) => {
        let access_token = response && response.access_token;
        if(!access_token){
            next();
        }
        return access_token;
    }, (err) => {
        throw err;
    }).then((access_token) => {

        let apiUrl = apiConfig.getSegementsList({
            query: {
                page: 0,
                pageSize: 100,
                sortBy: 'name'
            }
        });

        apiService.get(apiUrl, {
            overrideHeaders: {
                'authorization': `Bearer ${access_token}`,
                'content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {

            let data = segmentsParser.parseSegmentsList(response);
            return res.send({
                data
            });

        }, (err) => {
            if((err.status && err.status == 401) && (err.body && err.body.error === 'invalid_token')){
                return getAllSegements(req, res, next, true);
            }else {
                next(err);
            }
        });
    }).catch(function(err){
        next(err);
    });
}


module.exports = {
    getAllSegements
};
