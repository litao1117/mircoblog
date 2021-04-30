//  定义Schema结构
var mongoose = require('mongoose');
var schema = mongoose.Schema;  // 是跟数据库一一对应的桥梁

var replySchema = new mongoose.Schema({

        Comment_id : {
            type : String,
            default : null
        },
        Reply_user_id : {
            type : String,
            default : null
        },
        Reply_content : {
            type : String,
            default : null
        },
        Reply_state : {
            type : Number,
            default : 1
        },
        Create_At : {
            type : Date,
            default : Date.now()
        },
        Img : {
            type : String,
            default : null
        }
    })

var Reply = mongoose.model('Reply', replySchema);
module.exports = Reply;