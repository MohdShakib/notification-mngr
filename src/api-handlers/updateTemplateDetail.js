"use strict";


const notificationTemplateQuery = require('../services/queries/notificationTemplateQuery'),
    templateParser = require('../parsers/templateParser'),
    templateColumn = "send_template";

var getData = require('velocity').Data,
    Engine = require('velocity').Engine,
    engine, renderEngine,
    result, renderResult;

var additionalVariables = ['unSubscribedLink'];

module.exports = function(req, res, next){

    let data = req.body || {},
        prevData = data.prevData || {},
        isTypeObject = data.type == 'object' ? true : false,
        currentTemplate = data.template,
        validate = true;

    if(isTypeObject){
        currentTemplate = JSON.stringify(currentTemplate);
    }

    if(!isTypeObject && data.template == prevData.template){
        console.log('awesome everything is perfect');
    }else if(isTypeObject && currentTemplate == JSON.stringify(prevData.template)) {
        console.log('awesome perfectOOO FOR Objects');
    }else{

        try {

            let oldVars, newVars, oldProps, newProps,
                extractData, extractResult;

            extractData = new getData({
                template: currentTemplate
            });
            extractResult = extractData.extract({});

            oldVars = prevData.extractData;
            newVars = extractResult['raw'];
            oldProps = Object.getOwnPropertyNames(oldVars);
            newProps = Object.getOwnPropertyNames(newVars);

            for (var i = 0; i < additionalVariables.length; i++) {
                while(oldProps.indexOf(additionalVariables[i]) != -1){
                    oldProps.splice(oldProps.indexOf(additionalVariables[i]),1);
                }
                while(newProps.indexOf(additionalVariables[i]) != -1){
                    newProps.splice(newProps.indexOf(additionalVariables[i]),1);
                }
            }

            if (oldProps.length == newProps.length){
                for (var i = 0; i < newProps.length; i++) {
                    if (oldProps.indexOf(newProps[i]) == -1){
                        console.log('......',oldProps.indexOf(newProps[i]), newProps[i]);
                        validate = false;
                    }
                }
            }else {
                console.log('______');
                validate = false;
            }

            console.log('diff in length:  ',oldProps, newProps);

            if(!validate){
                res.status(404).send({

                });
                return;
            }

            res.send({

            });



        } catch (err) {
            console.log('errrrrrrrrrrrr',err);
            res.send({
                err
            });
        }


    }
}
