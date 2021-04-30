
var User = require("../models/Schema/user");

exports.showIndex = function(req, res, next) {
    if(LoginSession.login === 1) {
        var user_id = req.session.user_id;
        User.find({"_id" : user_id}, function(err, result) {
            var Avatar = result[0].Avatar;
            if (result[0].Avatar == null) {
                Avatar = "https://timgsa.baidu.com/timg?image&amp;quality=80&amp;size=b9999_10000&amp;sec=1551940631962&amp;di=bb6f53aa284acaca729ae77916b55ec8&amp;imgtype=0&amp;src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F11385343fbf2b2114a65cd70c48065380cd78e41.jpg";
            } else {
                Avatar = result[0].Avatar;
            }
            res.render("index", {
                "login" : LoginSession.login,
                "Avatar" : Avatar,
                "Nickname" : result[0].Nickname
            })
        })
    } else {
        res.render('index', {
            "login" : LoginSession.login,
        });
    }
}
exports.showLogin = function(req, res, next) {
    if(LoginSession.login === 1) {
        var user_id = req.session.user_id;
        User.find({"_id" : user_id}, function(err, result) {
            var Avatar = result[0].Avatar;
            if (result[0].Avatar == null) {
                Avatar = "https://timgsa.baidu.com/timg?image&amp;quality=80&amp;size=b9999_10000&amp;sec=1551940631962&amp;di=bb6f53aa284acaca729ae77916b55ec8&amp;imgtype=0&amp;src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F11385343fbf2b2114a65cd70c48065380cd78e41.jpg";
            } else {
                Avatar = result[0].Avatar;
            }
            res.render("index", {
                "login" : LoginSession.login,
                "Avatar" : Avatar,
                "Nickname" : result[0].Nickname
            });
        });
    } else {
        res.render('login', {
            "login" : LoginSession.login,
        })
    }
}
exports.showRegister = function(req, res, next) {
    if(LoginSession.login === 1) {
        var user_id = req.session.user_id;
        User.find({"_id" : user_id}, function(err, result) {
            var Nickname = result[0].Nickname;
            var Avatar = result[0].Avatar;
            if (result[0].Avatar == null) {
                Avatar = "https://timgsa.baidu.com/timg?image&amp;quality=80&amp;size=b9999_10000&amp;sec=1551940631962&amp;di=bb6f53aa284acaca729ae77916b55ec8&amp;imgtype=0&amp;src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F11385343fbf2b2114a65cd70c48065380cd78e41.jpg";
            } else {
                Avatar = result[0].Avatar;
            }
            res.json('index', {
                "login" : LoginSession.login,
                "Nickname": Nickname,
                "Avatar": Avatar,
            });          
        });
    } else {
        res.render('register', {
            "login" : LoginSession.login
        });
    }
}