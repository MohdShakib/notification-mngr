"use strict";

const   apiService = require('./apiService'),
        apiConfig = require('../config/apiConfig');

const USER_ROLE = "nm-admin"; // USER ROLE IN ORDER TO TREATER AS VALID LOGGEDID USER WITHA ACCESS ROLE_ID IS 57

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
        if(data &&  data.roles && data.roles.indexOf(USER_ROLE) > -1){ //data.email.indexOf('@proptiger')
            data.isValid = true;
            return data;
        }else {
            throw (new Error('not valid user'));
        }
    }, (err) => {
        throw err;
    });
}
