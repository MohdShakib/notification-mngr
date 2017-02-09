"use strict";


const utils = require('services/utilService'),
      getURL = utils.getURL;

let apis = {
    sendNotification({} = {}){
        return {
            url: 'madelyne/data/v3/entity/notification/sender'
        }
    },
    flushApi({} = {}){
        return {
            url: 'madelyne/data/v1/notification/removeFromCache',
            mockUrl: '/flushApiResponse.js'
        }
    },
    socialLogin(provider){
        return {
            url: `madrox/app/v1/login/${provider}`
        }
    },
    userDetails(){
        return {
            url: `madrox/app/v1/user/details`
        }
    },
    logout(){
        return {
            url: `madrox/app/v1/logout`
        }
    },
    getAudienceAccessToken({} = {}){
        return {
            url: '/oauth/token',
            baseURL: 'https://api.demdex.com/'
        }
    },
    getSegementsList({} = {}){
        return {
            url: '/v1/segments/',
            baseURL: 'https://api.demdex.com/'
        }
    }
}

apis = utils._.mapValues(apis, func => function(options) {
    let urlDetails = func(options);

    if (options && options.query) {
        return getURL(urlDetails, options.query);
    }
    return urlDetails;
});

module.exports = apis;
