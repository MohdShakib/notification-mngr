"use strict";

var getData = require('velocity').Data

function getTemplateContent(content, id){
    let data= {},
        extractData, extractResult;

    if(content){
        data.template = content.replace(/\n|\t/g, "").replace(/  +/g, ' ');

        try{
            extractData = new getData({
                template: data.template
            });
            extractResult = extractData.extract({})
            data.extractData = extractResult['raw'];
        }catch(e){
            data.extractData = {};
            console.log(e);
        }


        try {
            data.template = JSON.parse(data.template);
            data.type = 'object';

            if (typeof(data.template) != 'object') {
                data.template = JSON.parse(data.template);
                data.type = 'object';

            }

            data.prop1 = (Object.getOwnPropertyNames(data.template)[0])
            data.prop2 = (Object.getOwnPropertyNames(data.template)[1])
        } catch (e) {
            data.type = 'string';
        }
    }
    return data;
}

module.exports = {
    getTemplateContent
}
