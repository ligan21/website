/**
 * Created by ligan on 30/05/16.
 */

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var countSchema=new Schema({
   "time":{type:Date,default:Date.now},
   "websiteCount":Number,
   "paddingCheckCount":Number,
   "memberCount":Number
});

module.exports=mongoose.model('Count',countSchema);