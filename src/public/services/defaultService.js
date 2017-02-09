"use strict";

import apiConfig from '../config/apiConfig'
import apiService from './apiService'

let SINGLETON_PROMISE = {
    NOTIFICATION_TYPES: null,
    NOTIIFICATION_MEDIUMS: null,
    NOTIFICATION_STATUS: null,
    SEGMENTS_LIST: null
}

export function getNotificationTypes(){

    if(SINGLETON_PROMISE.NOTIFICATION_TYPES){
        return SINGLETON_PROMISE.NOTIFICATION_TYPES;
    }

    SINGLETON_PROMISE.NOTIFICATION_TYPES = apiService.get(apiConfig.apiHandlers.getNotificationTypes().url).then((notificationTypes) => {
        return notificationTypes;
    }, () => {
        SINGLETON_PROMISE.NOTIFICATION_TYPES = null;
    });
    return SINGLETON_PROMISE.NOTIFICATION_TYPES;
}

export function getNotificationMediums(){

    if(SINGLETON_PROMISE.NOTIIFICATION_MEDIUMS){
        return SINGLETON_PROMISE.NOTIIFICATION_MEDIUMS;
    }

    SINGLETON_PROMISE.NOTIIFICATION_MEDIUMS = apiService.get(apiConfig.apiHandlers.getNotificationMediums().url).then((notificationMediums) => {
        return notificationMediums;
    }, () => {
        SINGLETON_PROMISE.NOTIIFICATION_MEDIUMS = null;
    });
    return SINGLETON_PROMISE.NOTIIFICATION_MEDIUMS;
}

export function getNotificationsStatus() {

    if(SINGLETON_PROMISE.NOTIFICATION_STATUS){
        return SINGLETON_PROMISE.NOTIFICATION_STATUS;
    }

    var statusArray = ['Generated', 'Scheduled', 'Sent', 'InterKeyMerged', 'InterNonKeyMerged', 'InterKeySuppressed', 'InterNonKeySuppressed', 'IntraKeyMerged', 'IntraNonKeyMerged', 'IntraKeySuppressed', 'IntraNonKeySuppressed', 'SchedulerSuppressed', 'Failed', 'LookUpFailed'];
        statusArray = statusArray.map(function(name){
            return {
                key: name.toLowerCase(),
                name: name
            }
        });

    SINGLETON_PROMISE.NOTIFICATION_STATUS = new Promise((resolve, reject) => {
        return resolve({
            data:statusArray
        });
    });
    return SINGLETON_PROMISE.NOTIFICATION_STATUS;
}


export function getSegementsList(){

    if(SINGLETON_PROMISE.SEGMENTS_LIST){
        return SINGLETON_PROMISE.SEGMENTS_LIST;
    }


    let url = apiConfig.apiHandlers.getSegementsList().url;
    SINGLETON_PROMISE.SEGMENTS_LIST = apiService.get(url).then((response) => {
        let segments = response && response.data && response.data.segments;
        return segments;
    }, (err) => {
        SINGLETON_PROMISE.SEGMENTS_LIST = null;
    });
    return SINGLETON_PROMISE.SEGMENTS_LIST;
}
