/**
 * Created by ligan on 26/05/16.
 */

var mongoose=require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema=mongoose.Schema;

var memberSchema=new Schema({
    "id":String,
    "organizationName" :String,
    "username":String,
    "password":String,
    "name":String,
    "userType":String,
    "time":{type:Date,default:Date.now},
    "tel":String,
    "email":String,
    "IDCard":String,
    "managerNum":Number,
    "_createrId":Schema.Types.ObjectId,
    "_organizationId":Schema.Types.ObjectId
});
memberSchema.plugin(mongoosePaginate);
module.exports=mongoose.model('Member',memberSchema);