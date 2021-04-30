//  定义Schema结构
var mongoose = require('mongoose');
var schema = mongoose.Schema;  // 是跟数据库一一对应的桥梁

var circleSchema = new mongoose.Schema({

        User_id : {
            type : String,
            default : null
        },
        Circle_content : {
            type : String,
            default : null
        },
        Circle_state : {
            type : Number,
            default : 1
        },
        Likes_count : {
            type : Number,
            default : 0
        },
        Comments_count : {
            type : Number,
            default : 0
        },
        Relay_count : {
            type : Number,
            default : 0
        },
        Create_At : {
            type : Date,
            default : Date.now()
        },
        Img : {
            type : Array,
            default : null
        }
    })

var Circle = mongoose.model('Circle', circleSchema);
module.exports = Circle;