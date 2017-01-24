"use strict";
var mysqlService = require('./mysqlService');

var tables = {
    CAMPAIGNS: 'notification.campaigns',
    CAMPAIGN_TEMPLATES_MAPPING: 'notification.campaign_templates_mapping'
}


function createCampaign({ name, description, segment_id, start_date, schedule_time, status }){

    var query = `INSERT INTO ${tables.CAMPAIGNS}
    (name, description, segment_id, start_date, schedule_time, status, created_at)
    VALUES (?,?,?,?,?,?,?)`;

    var obj = [name, description, segment_id, start_date, schedule_time, status, "NOW()"];
    return mysqlService.execQueryParams(query,obj).then(function(rows) {
        return rows;
    });
}

function insertCampaignTemplatesMapping(data){

    var query = `INSERT INTO ${tables.CAMPAIGN_TEMPLATES_MAPPING}
    (campaign_id, template_id, frequency, gap_interval) VALUES ?`;

    var obj = [data]
    return mysqlService.execQueryParams(query, obj).then(function(rows) {
        return rows;
    });
}

module.exports = {
    createCampaign,
    insertCampaignTemplatesMapping
}
