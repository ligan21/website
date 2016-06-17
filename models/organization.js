/**
 * Created by ligan on 26/05/16.
 */

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var organizationSchema = new Schema({
    "id": String,
    "name": String,
    "type": String,
    "time": {
        type: Date,
        default: Date.now
    },
    "leaderName": String,
    "leaderPost": String,
    "leaderPhone": String,
    "leaderTel": String,
    "secureManagerName": String,
    "secureManagerPost": String,
    "secureManagerPhone": String,
    "secureManagerTel": String,
    "secureLiaisonName": String,
    "secureLiaisonPost": String,
    "secureLiaisonPhone": String,
    "secureLiaisonTel": String,
    "count": {
        type: Number,
        default: 0
    }
});
organizationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Organization', organizationSchema);