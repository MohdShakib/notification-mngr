"use strict";

const campaignsQuery = require('../services/queries/campaignsQuery');

function getCampaignDetailsById(req, res, next){
    let campaignId = req.params.id;
    campaignsQuery.getCampaignDetailById(campaignId).then((response)=>{

        let data;
        if(response && response.length){
            let item = response[0];
            data = {};

            data.name = item.name;
            data.description = item.description;
            data.segmentId = item.segment_id;
            data.startDate = item.start_date;
            data.scheduleTime = item.schedule_time;
            data.status = item.status;
            data.createdAt = item.created_at;

            for(var i=0; i<response.length; i++){
                item = response[i];
                data.templates = data.templates || [];
                data.templates.push({
                    id: item.template_id,
                    frequency: item.frequency,
                    gapInterval: item.gap_interval,
                    notificationName: item.typename,
                    mediumName: item.mediumname,
                    notificationTypeId: item.notification_type_id,
                    mediumId: item.notification_medium_id
                });
            }
        }

        return res.send({
            data
        });
    }, (error) => {
        next(error);
    });
}

module.exports = {
    getCampaignDetailsById
}
