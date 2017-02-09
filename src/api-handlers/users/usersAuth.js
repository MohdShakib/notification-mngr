"use strict";

const   apiConfig   = require('../../config/apiConfig'),
        apiService  = require('../../services/apiService');

module.exports.doSocialLogin = function(req, res, next){

    let access_token = (req.body || {}).access_token;

    apiService.post(apiConfig.socialLogin(req.params.provider), {
        req,
        res,
        form: {
            access_token
        }
    }).then((response)=>{
        res.send({
            data: response.data
        });
    }, (err)=>{
        next(err);
    });
}

module.exports.userDetails = function(req, res, next){
    apiService.get(apiConfig.userDetails(), {
        req
    }).then((response)=>{
        res.send({
            data: response.data
        });
    }, (err) => {
        next(err);
    });
}

module.exports.logout = function(req, res, next){
    apiService.post(apiConfig.logout(), {
        req,
        res
    }).then((response) => {
        res.send({
            data: null
        });
    }, (err)=>{
        next(err);
    });
}
