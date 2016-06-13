/**
 * Created by ligan on 26/05/16.
 */

var mongoose=require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema=mongoose.Schema;

var logSchema=new Schema({
   "id":String,
   "time":{type:Date,default:Date.now},
   "userType":String,
   "username":String,
   "organizationName":String,
   "action":String,
   "_websiteId":Schema.Types.ObjectId,
   "_memberId":Schema.Types.ObjectId,
});
logSchema.plugin(mongoosePaginate);
module.exports=mongoose.model('Log',logSchema);