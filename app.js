var express = require('express');
var app = express();
var path = require('path');
var db = require('./models/init');
// var session = require('./config/session');
var session = require('express-session');
// 引入connect-mongo用于express连接数据库存储session
var mongoStore = require('connect-mongo')(session);
  // 解决跨域问题
  app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*') // 第二个参数表示允许跨域的域名，* 代表所有域名
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS') // 允许的 http 请求的方法
	// 允许前台获得的除 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma 这几张基本响应头之外的响应头
	res.header('Access-Control-Allow-Headers', 'Content-Type, userization, Content-Length, X-Requested-With')
	if (req.method == 'OPTIONS') {
		res.sendStatus(200)
	} else {
		next()
	}
  });

  app.use('/static',express.static("public"));

  app.use(session({
    //参数配置
    secret: 'luckystar',//加密字符串 
    name: 'userid',//返回客户端key的名称，默认为connect_sid 
    resave: false,//强制保存session，即使它没有变化 
    saveUninitialized: true,//强制将未初始化的session存储。当新建一个session且未设定属性或值时，它就处于未初始化状态。在设定cookie前，这对于登录验证，减轻服务器存储压力，权限控制是有帮助的，默认为true 
    cookie: { maxAge: 99999999999999999999999999999999 },
    rolling: true, //在每次请求时进行设置cookie，将重置cookie过期时间 
    store: new mongoStore({  //将session数据存储到mongo数据库中 
  
      url: 'mongodb://127.0.0.1/session', //数据库地址 
      touchAfter: 24 * 36000000, //多长时间往数据库中更新存储一次，除了在会话数据上更改了某些数据除外
    })
  }));

//前段页面渲染
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);   //把html文件显示出来
app.set('view engine', 'html');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/avatar",express.static("./avatar"));
//定义跳过token检测的请求接口
// var excludeUris =[
//   '/',
//   '/doLogin',
//   '/getMsg',
//   '/getimg',
//   '/regist'
// ]

// // 检验请求路径接口是否在excludeUris这个数组中的方法
// function inArray(stringToSearch, arrayToSearch) {
//   for (s = 0; s < arrayToSearch.length; s++) {
//     thisEntry = arrayToSearch[s].toString();
//     if (thisEntry == stringToSearch) {
//       return true;
//     }
//   }
//   return false;
// }

// //判断前端接口是否携带token
// app.use(function(req,res,next){

//   var uri =req.path;

//   if(inArray(uri,excludeUris)){
//     next();
//     return;
//   }

// var access_token

// if(req.method == "POST"){
//   access_token =req.body.access_token ;
// }
// if(req.method == "GET"){
//   access_token =req.query.access_token ;
// }

// if(!access_token){
//   res.json({
//     code :0,
//     message : '未认证'
//   })
//   return;
// }

// var user_info =session[access_token] ;
// console.log(user_info)

// if(!user_info || user_info.expire_in - new Date().getTime() <0){
//   res.json({
//     code : -1,
//     message :'非法token'
//   })
//   return ;
// }

// session[access_token].expire_in =new Date().getTime() +1000 *60*60;

// req.user_info = user_info ;

// next();

// })
// 路由
var router = require('./router');
app.use(router);

//连接服务器
app.listen(4000, function() {
	console.log("服务器连接成功");
});

//连接数据库
db.connect();