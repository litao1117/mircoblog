/**
 *  路由表
 */
var express = require('express');
var router = express.Router();    // 引用router方法
var route = require('./routes/index');
var control = require('./dbhelper/db');

// 主页面跳转
router.get('/index', control.showIndex);
//登陆页面跳转
router.get('/', control.showLoginIndex);
// 注册页面跳转
router.get('/regist', control.showRegister);
// 获取验证码
router.get('/getimg', control.showCaptcha);
router.post('/getMsg', control.getMsg);
// 执行登陆
router.post('/doLogin', control.doLogin);
// 执行注册
router.post('/doRegister', control.doRegister);
// 发表微博
router.post('/doPost', control.doPost);
// 关注
router.post('/doConcern', control.doConcern);
// 取消关注
router.post('/doConcernOut', control.doConcernOut);
// 转发
router.post('/doRelay', control.doRelay);
// 点赞
router.post('/doLike', control.doLike);
// 取消点赞
router.post('/doLikeOut', control.doLikeOut);
// 评论
router.post('/doComments', control.doComments);
// 回复
router.post('/doReply', control.doReply);
// 收藏
router.post('/doCollect', control.doCollect);
// 取消收藏
router.post('/doCollectOut', control.doCollectOut);
// 注销
router.get("/doCancle", control.doCancle);
// 我的关注页面
router.get("/MyConcern", control.showMyConcern);
// 我的粉丝页面
router.get("/MyFan", control.showMyFan);
// 资料页面
router.get('/introduce', control.showIntroduce);
// 执行设置
router.post('/doChange', control.doChange);
// 设置个人资料页面
router.get('/edition', control.showSet);
router.get("/setavatar", control.showSetavatar);	//上传头像
router.post("/dosetavatar", control.dosetavatar);	//更改头像
router.get("/cut", control.showCut);			//显示剪裁页面
router.get("/docut", control.docut);			//执行剪裁
// 个人中心页面
router.get('/personal', control.showPersonal);
// 排行榜页面
router.get('/rankinglist', control.showRankinglist);
// 转发榜页面
router.get('/relaylist', control.showrelaylist);
// 我的点赞页面
router.get('/myLike', control.showMyLike);
// 我的评论页面
router.get('/myComments', control.showMyComments);
// 我的评论发出页面
router.get('/myCommentsout', control.showMyCommentsout);
// 我的收藏页面
router.get('/myCollect', control.showMyCollect);
module.exports = router;