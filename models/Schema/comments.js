//  定义Schema结构
var mongoose = require('mongoose');
var schema = mongoose.Schema;  // 是跟数据库一一对应的桥梁

var commentsSchema = new mongoose.Schema({

        Circle_id : {
            type : String,
            default : null
        },
        Comments_user_id : {
            type : String,
            default : null
        },
        Comment_content : {
            type : String,
            default : null
        },
        Comment_state : {
            type : Number,
            default : 1
        },
        Likes_count : {
            type : Number,
            default : 0
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

var Comments = mongoose.model('Comments', commentsSchema);
module.exports = Comments;