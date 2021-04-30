//  定义Schema结构
var mongoose = require('mongoose');
var schema = mongoose.Schema;  // 是跟数据库一一对应的桥梁

var userSchema = new mongoose.Schema({
        user_id: {
            type: String,
            default: null
        },
        Name : {
            type : String,
            default : null
        },
        Nickname : {
            type : String,
            default : null
        },
        Password : {
            type : String,
            default : null
        },
        Avatar: {
            type : String,
            default : "moren.jpg"
        },
        PhoneNumber : {
            type : Number,
            default : null
        },
        Birthday : {
            type : String,
            default : null
        },
        Sex : {
            type : String,
            default : null
        },
        Signature : {
            type : String,
            default : null
        }, 
        Emotionalstate : {
            type : String,
            default : null
        },
        Location : {
            type : String,
            default : null
        },
        QQ : {
            type : String,
            default : null
        },
        Email : {
            type : String,
            default : null
        },
        School : {
            type : String,
            default : null
        },
        Concern : {
            type : Array,
            default : []
        },
        Fans : {
            type : Array,
            default : []
        },
        State : {
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
        }
    })

var User = mongoose.model('users', userSchema);
module.exports = User;