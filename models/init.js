/**执行连接数据库操作**/

var mongoose = require('mongoose');
var db = require('../config/settings');

exports.connect = function() {
    
    mongoose.connect(db, { useNewUrlParser: true });
   
    // 设置最大重连次数
    var maxConnectTimes = 0;
    //增加监听事件
    mongoose.connection.on('disconnect', function() {
        console.log("数据库连接已断开");
        if(maxConnectTimes <= 3) {
            mongoose.connect(db);
            maxConnectTimes++;
        } else {
            console.log("数据库问题，请手动处理....");
        }
    });
    mongoose.connection.on('error', function() {
        console.log("数据库连接已断开");
        if(maxConnectTimes <= 3) {
            mongoose.connect(db);
            maxConnectTimes++;
        } else {
            console.log("数据库出错，请手动处理....");
        }
    });
    mongoose.connection.on('open', function() {
        console.log("数据库连接成功");
    });
}
