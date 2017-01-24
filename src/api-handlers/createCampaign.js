"use strict";

const campaignQuery = require('../services/queries/campaignsQuery');

module.exports = function(req, res, next){

    let body = req.body || {},
        templates = body.templates || [],
        postData = {},
        campaignTemplates = [];

    postData = {
        name: body.name,
        description: body.description,
        segment_id: body.segmentId,
        start_date: body.startDate,
        schedule_time: body.sendAt,
        status: body.status
    }

    let temp, item;
    for(var i=0; i<templates.length; i++){
        temp = templates[i];
        item = ['campaign_id', temp.id, temp.frequency, temp.interval]
        campaignTemplates.push(item);
    }

    campaignQuery.createCampaign(postData).then((rows)=>{
        let insertId = rows && rows.insertId;
        campaignTemplates = campaignTemplates.map((value) => {
            value[0] = insertId;
            return value;
        });
        return campaignQuery.insertCampaignTemplatesMapping(campaignTemplates);
    }, (error) => {
        next(error);
    }).then((response) => {
        res.send({
            data: null,
            message: 'campaign created successfully.'
        });
    }).catch(function(err){
        next(err);
    });

}
