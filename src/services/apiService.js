"use strict";

var request = require('request');
var fs = require('fs');
var path = require('path');
var logger = require('./loggerService');
var _ = require('./utilService')._;

const IS_DUMMY = process.env.DUMMY_API === "true" ? true : false;

let apiService = {};

var apiUrls = [{
    regex: new RegExp(/^\/?pixie/),
    baseUrlKey: 'BASE_URL_PIXIE'
}, {
    regex: new RegExp(/^\/?compass/),
    baseUrlKey: 'BASE_URL_COMPASS'
}, {
    regex: new RegExp(/^\/?madelyne/),
    baseUrlKey: 'BASE_URL_MADELYNE'
}, {
    regex: new RegExp(/^\/?madrox/),
    baseUrlKey: 'BASE_URL_MADROX'
}, {
    regex: new RegExp(/^\/?dawnstar/),
    baseUrlKey: 'BASE_URL_DAWNSTAR'
}, {
    regex: new RegExp(/^\/?columbus/),
    baseUrlKey: 'BASE_URL_COLUMBUS'
}, {
    regex: new RegExp(/^\/?petra/),
    baseUrlKey: 'BASE_URL_PETRA'
}, {
    regex: new RegExp(/^\/?sapphire/),
    baseUrlKey: 'BASE_URL_SAPPHIRE'
}, {
    regex: new RegExp(/^\/?kira/),
    baseUrlKey: 'BASE_URL_KIRA'
}];


var getAPIBaseUrl = function(url, baseUrl) {
    if (baseUrl) {
        return baseUrl;
    } else if (process.env['SKIP_MICRO_SERVICE_URL'] != 'false') {
        return process.env['API_BASE_URL'];
    } else {
        var filteredAPITypes = apiUrls.filter(function(apiType) {
            return url.match(apiType.regex);
        });
        if (filteredAPITypes.length) {
            let baseUrlKey = filteredAPITypes[0].baseUrlKey;
            return process.env[baseUrlKey];
        }
        return process.env['API_BASE_URL'];
    }
};

// organize params for get, patch, post, put, head, del
function _initParams(uri, options) {
    let url = typeof uri === 'string' ? uri : uri.url;
    let baseUrl = getAPIBaseUrl(url);
    let extraConfig = {};

    let params = {
        baseUrl: baseUrl,
        json: true
    };

    if (typeof options === 'object') {
        // handle if options.baseURL is passed instead of options.baseUrl
        if (options.baseURL || uri.baseURL) {
            options.baseUrl = options.baseURL || uri.baseURL;
            delete options.baseURL;
            delete uri.baseURL;
        }
        _.extend(params, options);

        //passing req by reference for storing the api map
        if(params.req){
            delete params.req;
        }
        params.req = options.req;
    }

    if (typeof uri === 'string') {
        _.extend(params, {
            url: uri
        });
    } else {
        _.extend(params, uri);
        extraConfig = uri.extra || {};
        options && _.extend(extraConfig, options.extraHeaders || {});
    }

    if(options && options.overrideHeaders){
        params.headers = options.overrideHeaders;
        delete options.overrideHeaders;
    }else if (params.req) {
        params.headers = _getHeaders(params, params.req, extraConfig);
    }

    if (params.baseUrl === null) {
        throw new Error('No micro service url found for ' + url);
    }



    return params;
}

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

function _getHeaders(params, req, extraConfig={}) {
    let headers = req.headers || {};

    let reqHeaders = {};
    if (headers['cookie']) {
        reqHeaders['Cookie'] = headers['cookie'];
    }
    reqHeaders['User-Agent'] = headers['user-agent'];
    reqHeaders['referer'] = headers['referer'];

    if(!extraConfig.noClientIP){
        reqHeaders['Client-IP'] = _getIP(req);
    }

    if (headers['X-host']) {
       reqHeaders['X-host'] = headers['X-host'];
    }


    if(extraConfig.authorization){
        reqHeaders['Authorization'] = extraConfig['authorization'];
    }

    reqHeaders['Accept-Encoding'] = 0;

    if(extraConfig['content-type']){
        reqHeaders['Content-Type'] = extraConfig['content-type'];
    }else if (headers['content-type']) {
        reqHeaders['Content-Type'] = headers['content-type'];
    }
    return reqHeaders;
}

function _setResponseHeaders(res, apiResponse) {
    if (res && !res.headersSent) { //write cookie and other header values to response
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
}

function _requestAPI(type, params){

    let urlString = path.join(params.baseUrl + (params.url || params.uri)).replace("http:","http:/");

    let promise = new Promise((resolve, reject) => {
        let res = params.res;

        logger.profile('API --- ' + urlString);

        // remove extra parameters which require.js doesn't require
        delete params.req;
        delete params.res;
        delete params.mockUrl;

        params.qsStringifyOptions =  {
            encoding: false
        };

        request[type](params, (error, response, body) => {

            logger.profile('API --- ' + urlString);
            if (error) {
                logger.error('ERROR IN API', error.code, 'for', urlString);
                if (error.code === 'ETIMEDOUT') {
                    error.status = 408;
                } else {
                    error.status = response && response.statusCode;
                }
                return reject(error);
            }

            if (res) {
                _setResponseHeaders(res, response);
            }

            if (response.statusCode !== 200 || (body && typeof body.statusCode !== "undefined" && !(body.statusCode === '2XX' || body.statusCode === 200) )) {
                logger.error('ERROR IN API ---', urlString);
                if (params.body || params.form) {
                    logger.error('API DATA:', JSON.stringify(params.body || params.form));
                }
                let errorMessage = 'ERROR IN API';
                if (body && body.error) {
                    errorMessage = body.error.msg;
                    logger.error(body.error.msg);
                }

                let err = new Error(errorMessage);
                err.status = (response.statusCode === 200 || response.statusCode === 404) ? 500 : response.statusCode;
                err.body = body;
                return reject(err);
            }

            // if (params.isComposite && body.data) {
            //     let CompositeData = {},
            //         newKey;
            //     for (let key in body.data) {
            //         newKey = utilService.removeQueryStringParameter(key, 'sourceDomain');
            //         CompositeData[newKey] = body.data[key];
            //     }
            //     body.data = CompositeData;
            // }
            resolve(body);
        });
    });

    return promise;
}

function _update(type, uri, options) {
    let params = _initParams(uri, options);
    if (IS_DUMMY && params.mockUrl && !params.baseURL) {
        logger.info("Calling mock API: " + params.mockUrl);
        var mockRes = require(params.mockUrl);
        return new Promise(resolve => resolve(mockRes));
    }
    return _requestAPI(type, params);
}

/**
 * Helper for POST request
 * @param  {String|Object} uri can be a url string or object from apiConfig function or request.post option
 * @param  {[type]} options other options
 * Note: if you want to send/set cookies, pass req and res in options
 * @return {Object} Promise for post request
 * e.g. request.post(apiConfig.enquiries(), {req: req, res: res, qs: {a: 'b'}})
 */
apiService.post = function(uri, options) {
    return _update('post', uri, options);
};

apiService.get = function(uri, options) {

    var params = _initParams(uri, options);

    let mockRes;
    let dummy = typeof params.dummy !== 'undefined' ? params.dummy : IS_DUMMY;

    if(dummy && params.mockUrl && !params.ignoreDummmy) {
        logger.info("Calling mock API: " + params.mockUrl);
        mockRes = require(params.mockUrl);
        return new Promise(resolve => resolve(mockRes));
    }

    return _requestAPI('get', params);
};

module.exports = apiService;
