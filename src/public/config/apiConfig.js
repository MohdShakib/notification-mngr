"use strict";

const getURL = require('../../services/utilService').getURL;

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
        updateTemplate({ id }){
            return {
                url: `/template/update/${id}`
            }
        },
        deleteTemplate({id}){
            return {
                url: `/template/delete/${id}`
            }
        },
        createNotificationType({notificationTypeName}){
            return {
                url: `/notification-types/create/${notificationTypeName}`
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
        },
        scheduleNotification(){
            return {
                url: `/notification-types/schedule`
            }
        },
        getSegementsList(){
            return {
                url: `/audience-manager/segments`
            }
        },
        createCampaign(){
            return {
                url: `/campaign/create`
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
