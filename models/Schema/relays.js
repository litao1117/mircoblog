//  定义Schema结构
var mongoose = require('mongoose');
var schema = mongoose.Schema;  // 是跟数据库一一对应的桥梁

var relaysSchema = new mongoose.Schema({

        Circle_id : {
            type : String,
            default : null
        },
        Relays_user_id : {
            type : String,
            default : null
        },
        Relay_content : {
            type : String,
            default : null
        },
        Relay_state : {
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

var Relay = mongoose.model('Relay', relaysSchema);
module.exports = Relay;