"use strict";

function getURL(urlObj, query) {
    if (!query) {
        return urlObj;
    }

    let queryStr, seperator;
    if (typeof query === 'string') {
        queryStr = query;
    } else {
        queryStr = '';
        for (let key in query) {
            if(query[key]){
                queryStr = queryStr + '&' + key + '=' + query[key];
            }
        }
        queryStr = queryStr.slice(1);
    }
    seperator = urlObj.url.indexOf('?') > -1 ? '&' : '?';
    urlObj.url += `${seperator}${queryStr}`;
    return urlObj;
}

let config = {
    apiHandlers: {
        getTemplateDetails({id}){
            return {
                url: id ? `/template-detail/${id}` : '/template-detail'
            }
        },
        getTemplateListings({mediumId}){
            return {
                url: mediumId ? `/template-listings/${mediumId}` : '/template-listings'
            }
        },
        createTemplate(){
            return {
                url: `/template/create`
            }
        },
        updateTemplate({
            id
        }){
            return {
                url: `/template/update/${id}`
            }
        },
        getNotificationListings(){
            return {
                url: '/notification-listings'
            }
        },
        getNotificationDetail({
            id
        }){
            return {
                url: `/notification-detail/${id}`
            }
        }
    }
}

Object.keys(config.apiHandlers).map((key) => {
    let func = config.apiHandlers[key];
    config.apiHandlers[key] = (function() {
        return function(options) {
            if (options && options.query) {
                return getURL(func(options), options.query);
            }
            return func(options);
        };
    })();
});

export default config;
