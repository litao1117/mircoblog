//  定义Schema结构
var mongoose = require('mongoose');
var schema = mongoose.Schema;  // 是跟数据库一一对应的桥梁

var likeSchema = new mongoose.Schema({

        Circle_id : {
            type : String,
            default : null
        },
        Comment_id : {
            type : String,
            default : null
        },
        Like_user_id : {
            type : String,
            default : null
        },
        LikeState : {
            type : Number,
            default : 1
        },
        Create_At : {
            type : Date,
            default : Date.now()
        },
        Update_At : {
            type : Date,
            default : Date.now()
        },

    })

var Like = mongoose.model('Like', likeSchema);
module.exports = Like;