"use strict";

const _ = require('lodash');

module.exports._ = _;

module.exports.getURL = function(urlObj, query) {
    if (!query) {
        return urlObj;
    }

    let queryStr, seperator;
    if (typeof query === 'string') {
        queryStr = query;
    } else {
        queryStr = '';
        for (let key in query) {
            if(query[key] || query[key] == 0){
                queryStr = queryStr + '&' + key + '=' + query[key];
            }
        }
        queryStr = queryStr.slice(1);
    }
    seperator = urlObj.url.indexOf('?') > -1 ? '&' : '?';
    urlObj.url += `${seperator}${queryStr}`;
    return urlObj;
}
