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
            data.segment_id = item.segment_id;
            data.start_date = item.start_date;
            data.schedule_time = item.schedule_time;
            data.status = item.status;
            data.created_at = item.created_at;

            for(var i=0; i<response.length; i++){
                item = response[i];
                data.templates = data.templates || [];
                data.templates.push({
                    id: item.template_id,
                    typeName: item.typename,
                    mediumName: item.mediumName,
                    frequency: item.frequency,
                    gap_interval: item.gap_interval
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
