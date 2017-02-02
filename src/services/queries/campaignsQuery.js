"use strict";
var mysqlService = require('./mysqlService');

var tables = {
    CAMPAIGNS: 'notification.campaigns',
    NOTIFICATION_TYPE: 'notification_type',
    NOTIFICATION_MEDIUM: 'notification_medium',
    CAMPAIGN_TEMPLATES_MAPPING: 'notification.campaign_templates_mapping',
    NOTIFICATION_TYPE_NOTIFICATION_MEDIUM_MAPPING: 'notification_type_notification_medium_mapping'
}


function getAllCampaigns(){

    var query = `SELECT CAMP.id as id, CAMP.name as name, CAMP.description as description, CAMP.segment_id as segment_id, DATE_FORMAT(CAMP.start_date, '%Y-%m-%d') as start_date,
    TIME_FORMAT(CAMP.schedule_time, '%H:%i') as schedule_time, CAMP.status as status, CAMP.created_at as created_at,
    GROUP_CONCAT(CMP_T_MAP.template_id) as template_ids, GROUP_CONCAT(CMP_T_MAP.frequency) as frequencies,
    GROUP_CONCAT(CMP_T_MAP.gap_interval) as gap_intervals
    FROM ${tables.CAMPAIGNS} as CAMP
    LEFT JOIN ${tables.CAMPAIGN_TEMPLATES_MAPPING} CMP_T_MAP ON CMP_T_MAP.campaign_id = CAMP.id
    WHERE CAMP.deleted != 1
    GROUP BY CAMP.id
    ORDER BY CAMP.id desc`;

    return mysqlService.execQuery(query).then(function(rows) {
        return rows;
    });
}

function createCampaign({ name, description, segment_id, start_date, schedule_time, status }){

    var query = `INSERT INTO ${tables.CAMPAIGNS}
    (name, description, segment_id, start_date, schedule_time, status, created_at)
    VALUES (?,?,?,?,?,?,?)`;

    var obj = [name, description, segment_id, start_date, schedule_time, status, new Date()];
    return mysqlService.execQueryParams(query,obj).then(function(rows) {
        return rows;
    });
}

function updateCampaign(id, { name, description, segment_id, start_date, schedule_time, status }){

    var query = `UPDATE ${tables.CAMPAIGNS} SET name=?, description=?, segment_id=?, start_date=?, schedule_time=?, status=?
    WHERE id=?`;

    var obj = [name, description, segment_id, start_date, schedule_time, status, id];
    return mysqlService.execQueryParams(query,obj).then(function(rows) {
        return rows;
    });
}

function deleteCampaign(campaignId){

    var query = `UPDATE ${tables.CAMPAIGNS} SET deleted=1
    WHERE id=?`;

    var obj = [campaignId];
    return mysqlService.execQueryParams(query,obj).then(function(rows) {
        return rows;
    });
}


function getCampaignDetailById(id){

    var query = `SELECT CAMP.id as id, CAMP.name as name, CAMP.description as description, CAMP.segment_id as segment_id, DATE_FORMAT(CAMP.start_date, '%Y-%m-%d') as start_date,
    TIME_FORMAT(CAMP.schedule_time, '%H:%i') as schedule_time, CAMP.created_at as created_at, CAMP.status as status,
    CMP_T_MAP.template_id as template_id, CMP_T_MAP.frequency as frequency, CMP_T_MAP.gap_interval as gap_interval,
    t2.name as typename, t2.id as notification_type_id, t3.name as mediumname, t3.id as notification_medium_id
    FROM ${tables.CAMPAIGNS} as CAMP
    INNER JOIN campaign_templates_mapping AS CMP_T_MAP ON CAMP.id = CMP_T_MAP.campaign_id
    INNER JOIN ${tables.NOTIFICATION_TYPE_NOTIFICATION_MEDIUM_MAPPING} AS t1 ON t1.id = CMP_T_MAP.template_id
    INNER JOIN ${tables.NOTIFICATION_TYPE} as t2 ON t2.id = t1.notification_type_id
    INNER JOIN ${tables.NOTIFICATION_MEDIUM} as t3 ON t3.id = t1.notification_medium_id
    WHERE CAMP.id = ?`;

    var obj = [id]
    return mysqlService.execQueryParams(query, obj).then(function(rows) {
        return rows;
    });
}

function deleteCampaignTemplatesMapping(campaign_id){

    var query = `DELETE FROM ${tables.CAMPAIGN_TEMPLATES_MAPPING}
    WHERE campaign_id = ?`;

    var obj = [campaign_id]
    return mysqlService.execQueryParams(query, obj).then(function(rows) {
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

function getCampaignsByTemplateId(templateId){

    var query = `SELECT count(*) as count from  ${tables.CAMPAIGN_TEMPLATES_MAPPING}
    WHERE template_id = ?`;
    var obj = [templateId]
    return mysqlService.execQueryParams(query, obj).then(function(rows) {
        return rows;
    });
}

module.exports = {
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getAllCampaigns,
    getCampaignDetailById,
    getCampaignsByTemplateId,
    insertCampaignTemplatesMapping,
    deleteCampaignTemplatesMapping
}
