/**
 *  业务逻辑的操作
 */
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
var gm = require("gm");
var User = require('../models/Schema/user');
var Circle = require('../models/Schema/circles');
var Like = require('../models/Schema/likes');
var Relay = require('../models/Schema/relays');
var Comment = require('../models/Schema/comments');
var Reply = require('../models/Schema/reply');
var Collect = require('../models/Schema/collect');
var md5 = require('../config/md5');
var svgCaptcha = require('svg-captcha');
// var session = require('../config/session');
var uuid = require('uuidv4');
function isPhone(phone) {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(phone)) {
        return false;
    } else {
        return true;
    }
}

// 首页
exports.showIndex = function(req, res, next) { 
    if(req.session.login == 1) {
    var PhoneNumber = req.session.PhoneNumber; 
    var user_id = req.session.user_id;  
    console.log(req.session.user_id)   
        User.find({"user_id" : user_id}, function(err, result3) {
            console.log(result3[0]);
            var all = [];
            var CommentData = [];
            var ReplyData = [];
            Circle.find({"user_id" : user_id}, function(err, result4) {
                Relay.find({"Relays_user_id" : user_id}, function(err, result5) { 
                    Like.find({"Like_user_id" : user_id}, function(err, result8) {
                       Collect.find({"Collect_user_id" : user_id}, function(err, result9) {
                        //    console.log(result8)                                             
                    Circle.find({}, null, {sort : {'Create_At' : -1}}, function(err, result) {
                        var data = result;
                        (function iterator(i) {
                            if(i == data.length) {
                                // console.log(all)
                                // console.log(CommentData)
                                res.render("index",{
                                    // "login" : LoginSession.login,
                                    "userNickname" : result3[0].Nickname,
                                    "blogs_count" : result4.length,
                                    "userAvatar" : result3[0].Avatar,
                                    "ConcernPeople" : result3[0],
                                    "relays" :  result5,
                                    "all" : all,
                                    "likes" : result8,
                                    "collects" : result9
                                })
                                return;
                            }
                            var objc = {
                               User_id : data[i].User_id,
                               Circle_id : data[i]._id, 
                               Circle_content : data[i].Circle_content,
                               Create_At : data[i].Create_At.toLocaleString(),
                               Likes_count : data[i].Likes_count,
                                Comments_count : data[i].Comments_count
                            };
                            User.find({"user_id" : data[i].User_id}, function(err, result1) {
                                Comment.find({"Circle_id" : data[i]._id},null, {sort : {'Create_At' : -1}}, function(err, result6) {   
                                    if(result6.length == 0) {
                                        CommentData = [];
                                    }                              
                                    (function findUser(k) {          //  存储评论人的头像，昵称，评论内容、时间
                                        if(k == result6.length) {
                                            return;
                                        }
                                        User.find({"user_id" : result6[k].Comments_user_id}, function(err, result7) {                                                                                                        
                                            var CommentUser = {
                                                Nickname : result7[0].Nickname,
                                                Avatar : result7[0].Avatar,
                                                Comment_content : result6[k].Comment_content,
                                                Reply : ReplyData,
                                                Comment_id : result6[k]._id,
                                                Create_At : result6[k].Create_At.toLocaleString(),
                                            }                                           
                                            // console.log(CommentUser)
                                            CommentData.push(CommentUser);
                                            findUser(k + 1);
                                        });
                                       
                                       
                                    })(0)
                                    var obju = {
                                        user_id : result1[0].user_id,
                                        Nickname : result1[0].Nickname,
                                        Avatar : result1[0].Avatar
                                    };
                                    var allData = {
                                        obju : obju,
                                        objc : objc,
                                        CommentData : CommentData,
                                        // ReplyData : ReplyData
                                    };
                                    all.push(allData);
                                    iterator(i + 1);
                                });                                    
                            });                                                             
                        })(0);                                                                       
                    });
                });    
            });    
                }); 
            });
        });       
    } else {
        res.render('loginindex', {
            "login" : req.session.login
        });
    }
}

// 登陆页面
exports.showLoginIndex = function(req, res, next) {
    var all = [];
    Circle.find({}, null, {sort : {'Create_At' : -1}}, function(err, result) {
        var data = result;
        (function iterator(i) {
            if(i == data.length) {
                // console.log(all)
                res.render("loginindex",{
                    "all" : all
                })
                return;
            }
            var objc = {
               User_id : data[i].User_id,
               Circle_id : data[i]._id, 
               Circle_content : data[i].Circle_content,
               Create_At : data[i].Create_At,
               Likes_count : data[i].Likes_count,
               Comments_count : data[i].Comments_count,
                Relay_count : data[i].Relay_count
            };
            User.find({"user_id" : data[i].User_id}, function(err, result1) {       
                console.log(result1)                      
                    var obju = {
                        user_id : result1[0].user_id,
                        Nickname : result1[0].Nickname,
                        Avatar : result1[0].Avatar
                    };
                    var allData = {
                        obju : obju,
                        objc : objc,
                    };
                    all.push(allData);
                    iterator(i + 1);
                });                                    
        })(0);                                                            
    }); 
    
}

// 注册页面
exports.showRegister = function(req, res, next) {
        res.render('regist', {
            "login" : req.session.login,
        });
}
//图形验证码
exports.showCaptcha = function (req, res, next) {
    var captcha = svgCaptcha.create({
        //options 
        size:4,
        ignoreChars:'0o1i2zl',
        noise:3,
        color:true,
        background:'#cc9966'
     });
    // var access_token = uuid();
    // session[access_token] = {
    //      captcha : captcha.text.toLowerCase(),
    //      expire_in: new Date().getTime() + 1000 * 60 * 60
    // }
    req.session.captcha = captcha.text.toLowerCase();
    var codeData = {
        img:captcha.data
    }
	res.type('svg');
	res.status(200).send(captcha.data);
};


// 登陆
exports.doLogin = function(req, res, next) {
    var PhoneNumber = req.body.PhoneNumber;
    var Password = md5(req.body.Password);

    User.find({"PhoneNumber" : PhoneNumber }, function(err, result) {
        if(result.length == 0) {
            res.json({
                "status_code" : 200,
                "code" : 0,
                "descript" : "登陆失败，用户不存在"
            })
        } else {
            if(result[0].State === 1) {
                if(Password === result[0].Password) {
                    // var access_token = uuid();
                    // 将过期时间和 user_id 存入session
                    // session[access_token] = {
                    //     user_id: result[0].user_id,
                    //     expire_in: new Date().getTime() + 1000 * 60 * 60
                    // }
                    req.session.login = 1;
                    req.session.user_id = result[0].user_id;
                    console.log(req.session.user_id)
                    res.json({
                        "status_code" : 200,
                        "code" : 1,
                        "descript" : "登陆成功"
                    });
                } else {
                    res.json({
                        "status_code" : 200,
                        "code" : -1,
                        "descript" : "登陆失败，密码错误"
                    });
                }
            } else {
                res.json({
                    "status_code" : 200,
                    "code" : -2,
                    "descript" : "登陆失败，用户已被拉黑"
                });
            }
        }
    })

}

// 获取验证码
exports.getMsg = function(req, res, next) {
    var PhoneNumber = req.body.PhoneNumber;
      // 六位随机数验证码
    var testNumber = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    User.find({PhoneNumber : PhoneNumber}, function(err, result) {
        if(result.length == 0) {
            // var access_token = uuid();
            // session[access_token] = {
            //     PhoneNumber: PhoneNumber,
            //     testNumber: testNumber.toString(),
            //     expire_in: new Date().getTime() + 1000 * 60 * 60
            // }
            req.session.PhoneNumber = PhoneNumber;
            req.session.testNumber = testNumber;
            // console.log(req.user_info)
            res.json({       
                // access_token,        
                "testNumber" : testNumber,
                "status_code" : 200,
                "code" : 1,
                "descript" : "获取验证码成功"
            });
        } else {
            res.json({
                // access_token,
                "status_code" : 200,
                "code" : -1,
                "descript" : "获取验证码失败，该用户已注册"
            });
        }
    });
}
 
//注册
exports.doRegister = function(req, res, next) {
        
        var PhoneNumber = req.body.PhoneNumber;
        var testNumber = req.body.testNumber;
        var SPassword = req.body.Password;
        var Password = md5(req.body.Password);
        var Password2 = md5(req.body.Password2);
        // var SPhoneNumber = req.user_info.PhoneNumber;
        // var StestNumber = req.user_info.testNumber;
        var SPhoneNumber = req.session.PhoneNumber;
        var StestNumber = req.session.testNumber;
        var captcha = req.body.captcha.toLowerCase();
        var Scaptcha = req.session.captcha;
        var Flag = isPhone(PhoneNumber);
        
        if(PhoneNumber == SPhoneNumber && testNumber == StestNumber && Password == Password2 && SPassword.length >= 6 && captcha == Scaptcha && Flag == true) {
            var user_id = uuid().replace(/-/g, '');
            // console.log(user_id);
            var user = new User({
                user_id,
                PhoneNumber : PhoneNumber,
                Password : Password,
                Nickname : PhoneNumber
            });
            user.save();
            // 将手机号和验证码的session删除
            // req.user_info = {}

            // var access_token = uuid();
            // 将过期时间和 user_id 存入session
            // session[access_token] = {
            //     user_id,
            //     expire_in: new Date().getTime() + 1000 * 60 * 60
            // }
            req.session.user_id = user_id;
            req.session.login = 1;
            res.json({
                // access_token,
                "status_code" : 200,
                "code" : 1,
                "descript" : "注册成功"
            });
            
        } else if(SPassword.length < 6){
            res.json({
                // access_token,
                "status_code" : 200,
                "code" : -1,
                "descript" : "密码小于6位"
            });
        } else if(Password != Password2){
            res.json({
                // access_token,
                "status_code" : 200,
                "code" : -1,
                "descript" : "两次输入密码不匹配"
            });
        } else if(testNumber != StestNumber){
            res.json({
                access_token,
                "status_code" : 200,
                "code" : -1,
                "descript" : "验证码输入错误"
            });
        } else if (Flag === false) {
            res.json({
                // access_token,
                "state_code": 200,
                "code": -1,
                "descript": "请输入有效的手机号"
            })
        } else if(captcha != Scaptcha){
            res.json({
                // access_token,
                "status_code" : 200,
                "code" : -1,
                "descript" : "图片验证码输入错误"
            });
        }
}

// 注销
exports.doCancle = function(req, res, next) {
    // req.user_info.expire_in = 0;
    req.session.login = 0;
    res.json({
        "status_code" : 200,
        "code" : 1,
        "descript" : "注销成功"
    });
}

//  发表微博
exports.doPost = function(req, res, next) {
    var circle_content = req.body.circle_content;
    var user_id = req.session.user_id;
        Circle.create({ User_id: user_id, Circle_content: circle_content}, function (err, result) {
            if (err) {
                return res.json({
                    "state_code ": 200,
                    "code": -1,
                    "descript": "发表失败"
                })
            }
            res.json({
                "Circle": result,
                "state_code": 200,
                "code": 1,
                "descript": "发表成功"
            })
        })
}

// 关注
exports.doConcern = function(req, res, next) {
    var user_id = req.session.user_id;
    var User_id = req.body.id; 
    User.updateOne({"user_id" : user_id}, {$push : {"Concern" : User_id}}, function(err, result1) {
        if(err) {
            throw err;
            return;
        }       
    });  
    User.updateOne({"user_id" : User_id}, {$push : {"Fans" : user_id}}, function(err, result2) {
        if(err) {
            throw err;
            return;
        } else {
            res.json({
                "status_code" : 200,
                "code" : 1,
                "descript" : "关注成功"
            });
        }
    });      
}

// 取消关注
exports.doConcernOut = function(req, res, next) {
    var user_id = req.session.user_id;
    var User_id = req.body.id; 
    User.updateOne({"user_id" : user_id}, {$pull : {"Concern" : User_id}}, function(err, result1) {
        if(err) {
            throw err;
            return;
        }       
    });  
    User.updateOne({"user_id" : User_id}, {$pull : {"Fans" : user_id}}, function(err, result2) {
        if(err) {
            throw err;
            return;
        } else {
            res.json({
                "status_code" : 200,
                "code" : 1,
                "descript" : "取消关注成功"
            });
        }
    });      
}

// 转发    
exports.doRelay = function (req, res, next) {
    var circle_id = req.body.id;
    var Relay_content = req.body.Relay_content;
    var relays_user_id = req.session.user_id;
    Relay.create({ Relays_user_id : relays_user_id, Circle_id: circle_id, Relay_content : Relay_content}, function (err, result) {
        Circle.find({_id : circle_id}, function(err, result1) {
            var Relay_count = result1[0].Relay_count;
            Circle.update({_id : circle_id}, {$set : {"Relay_count" : Relay_count+1}}, function(err, result2) {
                if (err) {
                    return res.json({
                        "state_code ": 200,
                        "code": -1,
                        "descript": "转发失败"
                    });
                }
                res.json({
                    "Circle": result,
                    "state_code": 200,
                    "code": 1,
                    "descript": "转发成功"
                });
            })
        });       
    });
}
//转发微博
// exports.doTranspond = function (req, res, next) {
//     //必须保证登陆
// //     if (LoginSession.login != "1") {
// //     	res.end("非法闯入，这个页面要求登陆！");
// //     	return;
// //     } 
// console.log("5");
// //console.log(req);

//          var id = "5c88e65f930dabe449a53e58";//req.params["id"];
//         var user_id = "13546551021";//LoginSession.user_id;

//         console.log(req.body);

//         var wenzishuzu=[];
//         var newcontent = req.body.newcontent;
//         if(newcontent != undefined)
//         wenzishuzu.push(newcontent);
//         console.log(wenzishuzu);

//         var circle_state=req.body.circle_state;
//         console.log(circle_state);


//         //默认转发内容
//         if( wenzishuzu.length == 0 ){
//             wenzishuzu=["转发微博"];
//         }
//         console.log(wenzishuzu);

//         Circle.find({"_id":id},function(err,result){
//             var oldweibo = result[0];
//             console.log(oldweibo);
//             var oldweibo_transpond=oldweibo.transpond+1;
//             console.log(oldweibo_transpond);
//             //转发数加1
//             Circle.update({"_id":id}, {
//                 $set: {"transpond":oldweibo_transpond }
//             }, function (err, results) {
//                 if(err)
//                     console.log("转发数加1失败");
//             });
            
//             console.log("11");
//             function one(){

//                //如果转发的微博本身不是被转发的微博
//                if(!oldweibo.oldcontent){
      
//                    var oldcontent = oldweibo.circle_content;
      
//                    var oldimg = oldweibo.Img;
      
//                    var fristweiboID = oldweibo._id;
      
//                }
//                //转发的微博是被转发的微博
//                else{
//                   var oldimg = oldweibo.Img;
      
//                    var fristweiboID = oldweibo.fristweiboID;
                   
//                    //给原始微博转发数加1
//                    Circle.find({"_id":fristweiboID},function(err,result){
//                        var fristweibo = result[0];
//                        var fristweibo_transpond=fristweibo.transpond+1;
//                        Circle.updateMany({"wid":fristweiboID}, {
//                            $set: {"transpond": fristweibo_transpond}
//                        }, function (err, results) {
//                            if(err)
//                                console.log("转发数加1失败");
//                        });})
      
      
//                    var oldcontent = oldweibo.oldcontent;
//                    // var oldweibo.newcontent_="@"+oldweibo.PhoneNumber+":"+oldweibo.newcontent;
//                    wenzishuzu.push(oldweibo.newcontent);
      
//                    //将  转发时添加的新内容--文字数组  转换成  字符串，并且新内容之间用 // 隔开
//                    var newcontent = wenzishuzu;
//                    var newcontent = newcontent.join("//");
      
//                }

//               console.log(newcontent);

//                //找到了原内容，转发可以没有新内容
//                if(oldcontent){
//                //现在可以证明，用户名没有被占用

//                console.log("10");

//                Relay.create({
//                    "user_id":user_id,
//                    "circle_state":circle_state,
//                    "newcontent": newcontent,
//                    "oldcontent":oldcontent,
//                    "oldimg":oldimg,
//                   "fristweiboID":fristweiboID,
//                    "transpond":0
//                }, function (err, result) {
//                    if (err) {
//                        res.json({
//                            "state_code":200,
//                            "code":-3,
//                            "descript":"服务器错误"
//                        })                       
//                        return;
//                    }
//                    res.json({
//                       "state_code":200,
//                       "code":1,
//                       "descript":"转发成功"
//                   })
//                }
//                )  
//            }
//        }
//        })
//     //})

// };

// 微博点赞
exports.doLike = function (req, res, next) {
    var circle_id = req.body.id;
    var like_user_id = req.session.user_id;
    Like.create({ Like_user_id: like_user_id, Circle_id: circle_id}, function (err, result) {
        Circle.find({_id : circle_id}, function(err, result2) {
            var Likes_count = result2[0].Likes_count;
            Circle.update({_id : circle_id}, {$set : {Likes_count : Likes_count+1}},function(err, result1) {
                if (err) {
                    res.json({
                        "state_code ": 200,
                        "code": -1,
                        "descript": "点赞失败"
                    });
                    return ;
                }
                res.json({
                    "Circle": result,
                    "state_code": 200,
                    "code": 1,
                    "descript": "点赞成功"
                });
            });
        });
        
    });        
}

// 微博取消点赞
exports.doLikeOut = function (req, res, next) {
    var circle_id = req.body.id;
    var like_user_id = req.session.user_id;
    Like.deleteOne({Like_user_id: like_user_id, Circle_id: circle_id}, function (err, result) {
        Circle.find({_id : circle_id}, function(err, result2) {
            var Likes_count = result2[0].Likes_count;
            Circle.update({_id : circle_id}, {$set : {Likes_count : Likes_count-1}},function(err, result1) {
                if (err) {
                    res.json({
                        "state_code ": 200,
                        "code": -1,
                        "descript": "取消点赞失败"
                    });
                    return ;
                }
                res.json({
                    "Circle": result,
                    "state_code": 200,
                    "code": 1,
                    "descript": "取消点赞成功"
                });
            });
        });
    });        
}

// 评论点赞
exports.doLikeComment = function (req, res, next) {
    var comment_id = req.body.id;
    var like_user_id = req.session.user_id;
    Like.create({ Like_user_id: like_user_id, Comment_id: comment_id}, function (err, result) {
        Comment.find({_id : comment_id}, function(err, result2) {
            var Likes_count = result2[0].Likes_count;
            Comment.update({_id : comment_id}, {$set : {Likes_count : Likes_count+1}},function(err, result1) {
                if (err) {
                    res.json({
                        "state_code ": 200,
                        "code": -1,
                        "descript": "点赞失败"
                    });
                    return ;
                }
                res.json({
                    "Circle": result,
                    "state_code": 200,
                    "code": 1,
                    "descript": "点赞成功"
                });
            });
        });
        
    });        
}

// 评论取消点赞
exports.doLikeCommentOut = function (req, res, next) {
    var comment_id = req.body.id;
    var like_user_id = req.session.user_id;
    Like.deleteOne({ Like_user_id: like_user_id, Comment_id: comment_id}, function (err, result) {
        Comment.find({_id : comment_id}, function(err, result2) {
            var Likes_count = result2[0].Likes_count;
            Comment.update({_id : comment_id}, {$set : {Likes_count : Likes_count-1}},function(err, result1) {
                if (err) {
                    res.json({
                        "state_code ": 200,
                        "code": -1,
                        "descript": "取消点赞失败"
                    });
                    return ;
                }
                res.json({
                    "Circle": result,
                    "state_code": 200,
                    "code": 1,
                    "descript": "取消点赞成功"
                });
            });
        });
        
    });        
}

//评论
exports.doComments = function (req, res, next) {
    var Comment_content = req.body.Comment_content;
    var Circle_id = req.body.id;
    var Comments_user_id = req.session.user_id;
    Comment.create({ Circle_id: Circle_id, Comment_content: Comment_content, Comments_user_id: Comments_user_id }, function (err, result) {
        Circle.find({_id : Circle_id}, function(err, result2) {
            var Comments_count = result2[0].Comments_count;
            Circle.update({_id : Circle_id}, {$set : {Comments_count : Comments_count+1}},function(err, result1) {
                if (err) {
                    res.json({
                        "state_code ": 200,
                        "code": -1,
                        "descript": "评论失败"
                    });
                    return ;
                }
                res.json({
                    "Circle": result,
                    "state_code": 200,
                    "code": 1,
                    "descript": "评论成功"
                });
            });
        });
    });
}

//回复
exports.doReply = function (req, res, next) {
    var Reply_content = req.body.Reply_content;
    var Comment_id = req.body.id;
    var Reply_user_id = req.session.user_id;
    Reply.create({  Comment_id:  Comment_id, Reply_content: Reply_content, Reply_user_id: Reply_user_id }, function (err, result) {
    if (err) {
        return res.json({
            "code": 0,
            "descript": "服务器故障"
        })
    }
    res.json({
        "state_code": 200,
        "code": 1,
        "descript": "回复成功"
    })
    });
}

//  我的关注页面
exports.showMyConcern = function(req, res, next) {
    var all = [];
    var user_id = req.session.user_id;
    User.find({"user_id" : user_id}, function(err, result) {
        (function iterator(i) {
            if(i == result[0].Concern.length) {
                res.render("Concern",{
                    "concern" : all,
                    "user" : result[0]
                })
                return;
            }
            User.find({"user_id" : result[0].Concern[i]}, function(err, result1) {
                var obju = {
                    Nickname : result1[0].Nickname,
                    Avatar : result1[0].Avatar,
                    user_id : result1[0].user_id,
                    Signature : result1[0].Signature
                };
                all.push(obju);
                // console.log(all)
                iterator(i + 1);
            });            
        })(0);   
    })
}

//  我的粉丝页面
exports.showMyFan = function(req, res, next) {
    var all = [];
    var user_id = req.session.user_id;
    User.find({"user_id" : user_id}, function(err, result) {
        (function iterator(i) {
            if(i == result[0].Fans.length) {
                res.render("Fans",{
                    "fan" : all,
                    "user" : result[0]
                })
                return;
            }
            User.find({"user_id" : result[0].Fans[i]}, function(err, result1) {
                var obju = {
                    Nickname : result1[0].Nickname,
                    Avatar : result1[0].Avatar,
                    user_id : result1[0].user_id
                };
                all.push(obju);
                // console.log(all)
                iterator(i + 1);
            });            
        })(0);   
    })
}

// 收藏
exports.doCollect = function(req, res, next) {
    var circle_id = req.body.id;
    var collect_user_id = req.session.user_id;
    Collect.create({ Collect_user_id: collect_user_id, Circle_id: circle_id}, function(err, result) {
        if (err) {
            res.json({
                "state_code ": 200,
                "code": -1,
                "descript": "收藏失败"
            });
            return ;
        }
        res.json({
            "Circle": result,
            "state_code": 200,
            "code": 1,
            "descript": "收藏成功"
        });
    });
}

// 取消收藏
exports.doCollectOut = function(req, res, next) {
    var circle_id = req.body.id;
    var collect_user_id = req.session.user_id;
    Collect.deleteOne({ Collect_user_id: collect_user_id, Circle_id: circle_id}, function(err, result) {
        if (err) {
            res.json({
                "state_code ": 200,
                "code": -1,
                "descript": "取消收藏失败"
            });
            return ;
        }
        res.json({
            "Circle": result,
            "state_code": 200,
            "code": 1,
            "descript": "取消收藏成功"
        });
    });
}

// 显示资料页面 
exports.showIntroduce = function(req, res, next) {
    var user_id = req.session.user_id;
    var all = [];
    User.find({user_id : user_id}, function(err, result) {
        Circle.find({User_id : user_id}, function(err, result1) {

            var obj = {
                result : result,
                blogs_count : result1.length
            }
            all.push(obj);
            console.log(all)
            // result[0].push(result1.length);
            res.render("introduce",{
                "result" : all
            });
        });
    });
}

// 设置资料页面
exports.showSet = function(req, res, next) {
    var user_id = req.session.user_id;
    User.find({user_id : user_id}, function(err, result) {
        Circle.find({User_id : user_id}, function(err, result1) {
            // console.log(result)
            res.render('set',{
                "information" : result[0],
                "blogs_count" : result1.length
            });
        });
    });
}

//设置头像界面，必须保证此时是登陆状态
exports.showSetavatar = function(req, res, next) {
	if(req.session.login != "1") {
		res.end("非法闯入，这个页面要求登陆！");
		return;
	}
	res.render("setAvatar", {

		
	});
}

//设置头像
exports.dosetavatar = function(req, res, next) {
	if(req.session.login != "1") {
		res.end("非法闯入，这个页面要求登陆！");
		return;
	}
	var form = new formidable.IncomingForm();
	form.uploadDir = path.normalize(__dirname + "/../public/img");
	form.parse(req, function(err, fields, files) {
        console.log(files)
		var oldpath = files.touxiang.path;
		var newpath = path.normalize(__dirname + "/../public/img") + "/" + req.session.user_id + ".jpg";
		fs.rename(oldpath, newpath, function(err) {
			if(err) {
				res.send("上传失败");
				return;
			}
			req.session.avatar = req.session.user_id + ".jpg";
			//跳转到剪切的业务
			res.redirect("/cut");
		});
	});
};

//显示剪裁图像页面
exports.showCut = function(req, res, next) {
	if(req.session.login != "1") {
		res.end("非法闯入，这个页面要求登陆！");
		return;
	}
	res.render("cut", {
		"avatar" : req.session.user_id + ".jpg"
	});
}

//执行切图 
exports.docut = function(req, res, next) {
	if(req.session.login != "1") {
		res.end("非法闯入，这个页面要求登陆！");
		return;
	}
	//这个页面接收几个get请求参数
	//w、h、x、y、
	var filename = req.session.avatar;
	var w = req.query.w;
	var h = req.query.h;
	var x = req.query.x;
	var y = req.query.y;

	gm("./public/img/" + filename)
		.crop(w, h, x, y)
		.resize(100, 100, "!")
		.write("./public/img/" + filename, function(err) {
			if(err) {
				res.send("剪裁失败");
				return;
			}
			//更改数据库当前用户的avatar值
			User.update({"user_id" : req.session.user_id},{
				$set : {"Avatar" : req.session.avatar} }, function(err, result) {
					res.send("剪裁成功");
			});
			
		});
}

// 修改资料
exports.doChange = function(req, res, next) {
    var user_id = req.session.user_id;
    User.updateOne({user_id: user_id}, {$set : {
        "Name"        :req.body.Name,
        "Sex"        :req.body.Sex,
        "Nickname"    :req.body.Nickname,
        "Location"    :req.body.Location,
        "Birthday"    :req.body.Birthday,
        "Signature"        :req.body.Signature,
        "Emotionalstate" :req.body.Emotionalstate,
        "Update_At"   :Date.now(),
        "Email"       :req.body.Email,
        "QQ"          :req.body.QQ,  
        "School"      :req.body.School,         
    }}, function(err, result) {
        if(err) {
            res.json(err);
            return;
        }
        res.json({
            "state_code": 200,
            "code": 1,
            "descript": "修改成功"
        })
    });
}

// 个人中心页面
exports.showPersonal = function(req, res, next) {
    var user_id = req.session.user_id;
    var all = [];
    User.find({user_id : user_id}, function(err, result) {
        Circle.find({User_id : user_id}, function(err, result1) {
            var data = result1;
            (function iterator(i) {
                if(i == data.length) {
                    res.render("personal",{
                        // "login" : LoginSession.login,
                        "Nickname" : result[0].Nickname,
                        "Avatar" : result[0].Avatar,
                        "all" : all,
                        "information" : result[0],
                        "blogs_count" : data.length
                    })
                    return;
                }
                    var objc = {
                        Comments_count : data[i].Comments_count,
                        Likes_count : data[i].Likes_count,
                        Circle_content : data[i].Circle_content,
                        Create_At : data[i].Create_At
                    };
                    all.push(objc);
                    iterator(i + 1);                                  
            })(0);    
        })
       
    })
}

// 排行榜页面
exports.showRankinglist = function(req, res, next) {
    var all = [];
    Circle.find({},null, {sort : {"Likes_count" : -1}} ,function(err, result) {
        var data = result;
        res.render('likelist',{
            "like" : data
        });
    })
    
    
    
}

// 转发榜页面
exports.showrelaylist = function(req, res, next) {
    var all = [];
    Circle.find({},null, {sort : {"Relay_count" : -1}} ,function(err, result) {
        var data = result;
        res.render('relaylist',{
            "like" : data
        });
    })
    
}

// 我的点赞页面
exports.showMyLike = function(req, res, next) {
    var all = [];
    User.find({user_id : req.session.user_id}, function(err, result3) {
        Circle.find({User_id : req.session.user_id}, function(err, result4) {
            Relay.find({"Relays_user_id" : req.session.user_id}, function(err, result5) {         
                Like.find({Like_user_id : req.session.user_id}, function(err, result) {
                    // console.log(result)
                    (function iterator(i) {
                        if(i == result.length) {
                            res.render('myLike', {
                                "circle" : all,
                                "myLikeCount" : result.length,
                                "user" : result3[0],
                                "blogs_count" : result4.length,
                                "relays" : result5
                            })
                            return;
                        }
                        Circle.find({_id : result[i].Circle_id}, function(err, result1) {
                            User.find({user_id : result1[0].User_id}, function(err, result2) {
                                var objc = {
                                    Circle_content : result1[0].Circle_content,
                                    Create_At : result1[0].Create_At,
                                    Likes_count : result1[0].Likes_count,
                                    Comments_count : result1[0].Comments_count
                                }
                                var obju = {
                                    Nickname : result2[0].Nickname,
                                    Avatar : result2[0].Avatar
                                }
                                var allData = {
                                    objc : objc,
                                    obju : obju
                                }
                                all.push(allData);
                                iterator(i + 1);
                            });
                        });
                    })(0);
                });
            });
        });
    });
}

// 我的评论页面
exports.showMyComments = function(req, res, next) {
    var all = [];
    User.find({user_id : req.session.user_id}, function(err, result3) {
        Circle.find({User_id : req.session.user_id}, function(err, result4) {
            (function iterator(i) {
                if(i == result4.length) {
                    res.render('myComments', {
                        "circle" : all,
                        "user" : result3[0],
                        "blogs_count" : result4.length
                    })
                    return;
                }
                Comment.find({Circle_id : result4[i]._id}, function(err, result) {
                    if(result.length != 0) {
                    // Circle.find({_id : result[i].Circle_id}, function(err, result1) {
                        User.find({user_id : result[0].Comments_user_id}, function(err, result2) {
                            var objc = {
                                Circle_content : result4[i].Circle_content,
                                Comment_content : result[0].Comment_content,
                                Create_At : result[0].Create_At,
                                Likes_count : result[0].Likes_count,
                            }
                            var obju = {
                                Nickname : result2[0].Nickname,
                                Avatar : result2[0].Avatar
                            }
                            var allData = {
                                objc : objc,
                                obju : obju
                            }
                            all.push(allData);
                            iterator(i + 1);
                        });
                    } else {
                        iterator(i + 1);
                    }
                });
            })(0);
        });
    });
}

// 我的收藏页面
exports.showMyCollect = function(req, res, next) {
    var all = [];
    User.find({user_id : req.session.user_id}, function(err, result3) {
        Circle.find({User_id : req.session.user_id}, function(err, result4) {
            Collect.find({Collect_user_id : req.session.user_id}, function(err, result) {
                (function iterator(i) {
                    if(i == result.length) {
                        res.render('myCollect', {
                            "circle" : all,
                            "myCollectCount" : result.length,
                            "user" : result3[0],
                            "blogs_count" : result4.length
                        })
                        return;
                    }
                    Circle.find({_id : result[i].Circle_id}, function(err, result1) {
                        User.find({user_id : result1[0].User_id}, function(err, result2) {
                            var objc = {
                                Circle_content : result1[0].Circle_content,
                                Create_At : result1[0].Create_At,
                                Likes_count : result1[0].Likes_count,
                                Comments_count : result1[0].Comments_count
                            }
                            var obju = {
                                Nickname : result2[0].Nickname,
                                Avatar : result2[0].Avatar
                            }
                            var allData = {
                                objc : objc,
                                obju : obju
                            }
                            all.push(allData);
                            iterator(i + 1);
                        });
                    });
                })(0);
            });
        });
    });
}

// 我的评论发出页面
exports.showMyCommentsout = function(req, res, next) {
    var all = [];
    User.find({user_id : req.session.user_id}, function(err, result3) {
        Circle.find({User_id : req.session.user_id}, function(err, result4) {
            Comment.find({Comments_user_id : req.session.user_id}, function(err, result) {
                (function iterator(i) {
                    if(i == result.length) {
                        res.render('myCommentsout', {
                            "circle" : all,
                            "user" : result3[0],
                            "blogs_count" : result4.length
                        })
                        return;
                    }
                    Circle.find({_id : result[i].Circle_id}, function(err, result1) {
                        User.find({user_id : result1[0].User_id}, function(err, result2) {
                            var objc = {
                                Comment_content : result[i].Comment_content,
                                Circle_content : result1[0].Circle_content,
                                Create_At : result1[0].Create_At,
                                Likes_count : result1[0].Likes_count,
                                Comments_count : result1[0].Comments_count
                            }
                            var obju = {
                                Nickname : result2[0].Nickname,
                                Avatar : result2[0].Avatar
                            }
                            var allData = {
                                objc : objc,
                                obju : obju
                            }
                            all.push(allData);
                            iterator(i + 1);
                        });
                    });
                })(0);
            });
        });
    });
}