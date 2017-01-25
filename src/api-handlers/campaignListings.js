"use strict";

const campaignsQuery = require('../services/queries/campaignsQuery');

function parseCampaignsList(response){
    let arrLength = response.length,
        item, template_ids, frequencies, gap_intervals,
        templates = [];

    for(let i=0; i<arrLength; i++){
        item = response[i];
        template_ids = response[i].template_ids.split(',');
        frequencies = response[i].frequencies.split(',');
        gap_intervals = response[i].gap_intervals.split(',');

        templates = [];
        for(let j=0; j<template_ids.length; j++){
            templates.push({
                template_id: template_ids[j],
                frequency: frequencies[j],
                gap_interval: gap_intervals[j]
            });
        }

        response[i].templates = templates;
        delete response[i].template_ids;
        delete response[i].frequencies;
        delete response[i].gap_intervals;
    }
    return response;
}

module.exports = function(req, res, next){
    campaignsQuery.getAllCampaigns().then((response)=>{
        let data = parseCampaignsList(response);
        res.send({
            data
        });
    }, (error)=>{
        next(error);
    });
}
