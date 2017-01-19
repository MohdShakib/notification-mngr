"use strict";

const   apiConfig = require('../config/apiConfig'),
        apiService = require('./apiService');

/** Authorization : Basic <base-64 clientID:clientSecret> **/
// Basic cHJvcHRpZ2VyLW9hdXRoOmNraW5mdjUyOHA5a2FoZHBhdWJram1vdDViMzE5dnJnbTlyMzJraXNya2p0a2FvNDdvMg==

/** body **/
// grant_type=password&username=mohd.shakib&password=Audience#222


let oauthTokenRes;

function getAccessToken(createNewToken){

    if(oauthTokenRes && !createNewToken){
        return new Promise(resolve => resolve(oauthTokenRes));
    }

    return apiService.post(apiConfig.getAudienceAccessToken(), {
        overrideHeaders: {
            'authorization': 'Basic cHJvcHRpZ2VyLW9hdXRoOmNraW5mdjUyOHA5a2FoZHBhdWJram1vdDViMzE5dnJnbTlyMzJraXNya2p0a2FvNDdvMg==',
            'content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=password&username=mohd.shakib&password=Audience#222'
    }).then((response) => {
        oauthTokenRes = response
        return response;
    });
}

module.exports = {
    getAccessToken
}
