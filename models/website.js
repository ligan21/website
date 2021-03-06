/**
 *Created by Sandeep on 01/06/14.
 */

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;


var websiteSchema = new Schema({
    "id": String,
    "organizationName": String,

    "websiteName": String,
    "submitTime": {
        type: Date,
        default: Date.now
    },
    "useState": String,
    "state": String,
    "refuseReason": String,
    "homepage": String,
    "submitter": String,
    "_submitterId": Schema.Types.ObjectId,
    "_ownerId": Schema.Types.ObjectId,
    "domainNameList": String,
    "websiteScale": String,
    "classify": String,
    "userProperty": String,
    "developer": String,
    "backgroundInterconnect": String,
    "securityEvaluationOrganization": String,
    "securityEvaluationResultLink": String,
    "attachmentLink": String,
    "topologyLink": String,
    "keyProductsLink": String,
    "recoveryPlanLink": String,
    "gradeProtectLink": String,
    "securityEvaluationReportLink": String,
    "securityEvaluationReportState": {
        type: String,
        default: "未提交"
    },
    "reformReportLink": String,
    "reformReportState": {
        type: String,
        default: "未提交"
    },
    "updateTime": {
        type: Date,
        default: Date.now
    }

});
websiteSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Website', websiteSchema);