"use strict";

const   apiService = require('./apiService'),
        apiConfig = require('../config/apiConfig');


module.exports.isUserLoggedIn = function(req){
    return apiService.get(apiConfig.userDetails(), {
        req
    }).then((response)=>{
        return response;
    }, (err) => {
        throw err;
    });
}

//1214942
module.exports.isValidUserLoggedIn = function(req){
    return apiService.get(apiConfig.userDetails(), {
        req
    }).then((response)=>{
        let data = response && response.data;
        console.log('_________________________________',data.email);
        if(data && data.email.indexOf('@proptiger')){
            data.isValid = true;
            return data;
        }else {
            throw (new Error('not valid user'));
        }
    }, (err) => {
        console.log('______________',err);
        throw err;
    });
}
