"use strict";

var request = require('request');
var fs = require('fs');
var path = require('path');

var apiUrls = [{
    regex: new RegExp(/^\/?pixie/),
    baseUrl: process.env['BASE_URL_PIXIE']
}, {
    regex: new RegExp(/^\/?compass/),
    baseUrl: process.env['BASE_URL_COMPASS']
}, {
    regex: new RegExp(/^\/?madelyne/),
    baseUrl: process.env['BASE_URL_MADELYNE']
}, {
    regex: new RegExp(/^\/?madrox/),
    baseUrl: process.env['BASE_URL_MADROX']
}, {
    regex: new RegExp(/^\/?dawnstar/),
    baseUrl: process.env['BASE_URL_DAWNSTAR']
}, {
    regex: new RegExp(/^\/?columbus/),
    baseUrl: process.env['BASE_URL_COLUMBUS']
}, {
    regex: new RegExp(/^\/?petra/),
    baseUrl: process.env['BASE_URL_PETRA']
}, {
    regex: new RegExp(/^\/?sapphire/),
    baseUrl: process.env['BASE_URL_SAPPHIRE']
}, {
    regex: new RegExp(/^\/?kira/),
    baseUrl: process.env['BASE_URL_KIRA']
}];


var _getBaseUrl = function(url, baseUrl) {
    if (baseUrl) {
        return baseUrl;
    } else if (process.env['SKIP_MICRO_SERVICE_URL'] != 'false') {
        return process.env['API_BASE_URL'];
    } else {
        var filteredAPITypes = apiUrls.filter(function(apiType) {
            return url.match(apiType.regex);
        });
        if (filteredAPITypes.length) {
            return filteredAPITypes[0].baseUrl;
        }
        return process.env['API_BASE_URL'];
    }
};

var _getIP = function(req) {
    var ip;
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else {
        ip = req.ip;
    }

    return ip;
};

var _getHeaders = function(config, req) {
    let headers = req.headers;
    let reqHeaders = {};

    if (headers['cookie']) {
        reqHeaders['Cookie'] = headers['cookie'];
    }
    reqHeaders['User-Agent'] = headers['user-agent'];
    reqHeaders['referer'] = headers['referer'];
    if (headers['content-type']) {
        reqHeaders['Content-Type'] = headers['content-type'];
    }

    if (headers['X-host']) {
        reqHeaders['X-host'] = headers['X-host'];
    } else if (process.env.NODE_ENV !== 'development') {
        reqHeaders['X-host'] = process.env.HOST;
    }

    if (headers['sellerListingTimestamp']) {
        reqHeaders['sellerListingTimestamp'] = headers['sellerListingTimestamp'];
    }
    if (headers['applicationType']) {
        reqHeaders['applicationType'] = headers['applicationType'];
    }
    if (!config.noClientIP) {
        reqHeaders['Client-IP'] = _getIP(req);
    }
    reqHeaders['Accept-Encoding'] = 0;

    return reqHeaders;
};

var _initOptions = function(method, config, req) {
    var options = {
        method: method,
        url: _getBaseUrl(config.uri, config.baseUrl) + config.uri,
        json: true
    };
    if (req && req.headers) {
        options.headers = _getHeaders(config, req);
    }
    return options;
};

var _setResponseHeaders = function(res, apiResponse) {
    if (res) { //write cookie and other header values to response
        if (apiResponse['headers']['set-cookie']) {
            res.setHeader('Set-Cookie', apiResponse['headers']['set-cookie']);
        }

        if (apiResponse.headers['content-encoding']) {
            res.setHeader('Content-Encoding', apiResponse.headers['content-encoding']);
        }

        if (apiResponse.headers['content-type']) {
            res.setHeader('Content-Type', apiResponse.headers['content-type']);
        }
    }
};


module.exports.post = function(config, bodyData, req, res) {
    return new Promise(function(resolve, reject) {
        if (config.mockResponse) {
            let mockRes = require('mocks' + config.mockUri);
            logger.log('info', 'using mock', config.mockUri);
            return new Promise(resolve => resolve(mockRes));

        } else {
            var options = _initOptions('POST', config, req);

            if (bodyData && bodyData['option']) {
                options[bodyData['option']] = (bodyData['data']);
            }

            console.log("---API OPTIONS: ", JSON.stringify(options));
            request(options, function(error, response, body) {
                if (error) {
                    console.log("---API ERROR: ", error)
                    reject(error);
                    throw error;
                } else {
                    console.log("---API RESPONSE: ", JSON.stringify(body));
                    if (res) {
                        _setResponseHeaders(res, response);
                    }
                    resolve(body);
                }
            });
        }
    });
};

module.exports.get = function(config, data, req) {
    return new Promise(function(resolve, reject) {

        if (config.mockResponse) {
            let mockRes = require('mocks' + config.mockUri);
            logger.log('info', 'using mock', config.mockUri);
            return new Promise(resolve => resolve(mockRes));

        } else {

            var options = _initOptions('GET', config, req);

            if (data) {
                options.url += data;
            }

            console.log("---API OPTIONS: ", JSON.stringify(options));
            request(options, function(error, response, body) {
                if (error) {
                    console.log("---API ERROR: ", error);
                    reject(error);
                    throw error;
                } else {
                    console.log("---API RESPONSE: ", JSON.stringify(body));
                    resolve(body);
                }
            });

        }
    });
};
