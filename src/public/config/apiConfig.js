"use strict";

const getURL = require('../../services/utilService').getURL;

let config = {
    apiHandlers: {
        socialLoginApi(provider){
            return {
                url: `/apis/users/doSocialLogin/${provider}`
            }
        },
        userDetails(){
            return {
                url: `/apis/users/details`
            }
        },
        userLogout(){
            return {
                url: `/apis/users/logout`
            }
        },
        getTemplateDetails({id}){
            return {
                url: id ? `/apis/template-detail/${id}` : '/apis/template-detail'
            }
        },
        getTemplateListings({mediumId}){
            return {
                url: mediumId ? `/apis/template-listings/${mediumId}` : '/apis/template-listings'
            }
        },
        createTemplate(){
            return {
                url: `/apis/template/create`
            }
        },
        updateTemplate({ id }){
            return {
                url: `/apis/template/update/${id}`
            }
        },
        deleteTemplate({id}){
            return {
                url: `/apis/template/delete/${id}`
            }
        },
        createNotificationType({notificationTypeName}){
            return {
                url: `/apis/notification-types/create/${notificationTypeName}`
            }
        },
        getNotificationListings(){
            return {
                url: '/apis/notification-listings'
            }
        },
        getNotificationDetail({
            id
        }){
            return {
                url: `/apis/notification-detail/${id}`
            }
        },
        scheduleNotification(){
            return {
                url: `/apis/notification-types/schedule`
            }
        },
        getSegementsList(){
            return {
                url: `/apis/audience-manager/segments`
            }
        },
        createCampaign(){
            return {
                url: `/apis/campaign/create`
            }
        },
        updateCampaign({ id }){
            return {
                url: `/apis/campaign/update/${id}`
            }
        },
        deleteCampaign({ id }){
            return {
                url: `/apis/campaign/delete/${id}`
            }
        },
        campaignDetailById({id}){
            return {
                url: `/apis/campaign-detail/${id}`
            }
        },
        getCampaignsList(){
            return {
                url: `/apis/campaign-listings`
            }
        },
        getNotificationMediums(){
            return {
                url:  `/apis/notification-mediums`
            }
        },
        getNotificationTypes(){
            return {
                url:  `/apis/notification-types`
            }
        },
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
