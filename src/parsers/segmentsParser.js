"user strict";


module.exports.parseSegmentsList = function(response){

    response = response || {};

    let data = {};
    data.totalCount = response.total;
    data.pageSize = response.pageSize;
    data.segments = [];

    let segmentsList = response.list || [];
    for(var i=0; i<segmentsList.length; i++){
        let obj = {},
            item = segmentsList[i];

        obj.id = item.sid;
        obj.name = item.name;
        obj.status = item.status;
        obj.description = item.description || '';
        obj.created_at = item.createTime;
        obj.updated_at = item.updateTime;

        data.segments.push(obj);
    }

    return data;
}
