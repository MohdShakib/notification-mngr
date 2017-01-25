"use strict";

export function getSegmentsMapping(response){
    let segmentsMapping = {},
        tmp;
    for(var i=0; i<response.length; i++){
        tmp = response[i];
        segmentsMapping[tmp.id] = tmp.name;
    }
    return segmentsMapping;
}
