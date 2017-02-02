"use strict";

const campaignQuery = require('../../services/queries/campaignsQuery');

function prepareBodyData(req){

    let campaignId = req.params.id || 'campaign_id',
        body = req.body || {},
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
        item = [campaignId, temp.id, temp.frequency, temp.gapInterval]
        campaignTemplates.push(item);
    }

    return {
        postData,
        campaignTemplates
    }
}

module.exports.upsertCampaign = function(req, res, next){

    let campaignId = req.params.id,
        parsedData = prepareBodyData(req);

    let postData = parsedData.postData,
        campaignTemplates = parsedData.campaignTemplates;

    if(!campaignId){ // create campaign case
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
    }else { // update campaign case
        campaignQuery.updateCampaign(campaignId, postData).then((rows)=>{
            return campaignQuery.deleteCampaignTemplatesMapping(campaignId);
        }, (error) => {
            next(error);
        }).then((response)=>{
            return campaignQuery.insertCampaignTemplatesMapping(campaignTemplates);
        }).then((response)=>{
            res.send({
                data: null,
                message: 'campaign updated successfully.'
            });
        }).catch(function(err){
            next(err);
        });
    }

}

module.exports.deleteCampaign = function(req, res, next){
    let campaignId = req.params.id;

    campaignQuery.deleteCampaign(campaignId).then((rows) => {
        return res.send({
            data: null,
            message: 'campaign deleted successfully.'
        });
    }, (err) => {
        next(err);
    });
}
