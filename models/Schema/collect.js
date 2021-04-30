
//收藏表

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//定义点赞数据字段
var collectSchema = Schema({
    //收藏者id
    Collect_user_id:{
        type:String,
        default:null
    },
    //收藏文章id
    Circle_id:{
        type:String,
        default:null
    },
    //收藏文章状态
    Collect_State:{
        type:Number,
        default:1
    },
    //收藏时间
    Create_At:{
        type:Date,
        default:Date.now()
    },
    //更新时间
    Update_At:{
        type:Date,
        default:Date.now()
    }
})
var collect = mongoose.model('collect',collectSchema)
module.exports = collect;