/**
 * Created by ligan on 26/05/16.
 */

var mongoose=require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema=mongoose.Schema;

var messageSchema=new Schema({
    "id":String,
    "title":String,
    "type":String,
    "time":{type:Date,default:Date.now},
    "timeout":String,
    "content":String,
    "attachment":String
});
messageSchema.plugin(mongoosePaginate);
module.exports=mongoose.model('Message',messageSchema);