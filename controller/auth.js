var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

passport.use(new BasicStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                return done(err)
            }
            // 用户不存在
            if (!user) {
                return done(null, false)
            }
            // 检查用户密码
            user.verifyPassword(password, function(err, match) {
                // 密码不匹配
                if (!match) {
                    return done(null, false)
                }
                // 成功
                return done(null, user)
            })

        })
    }
));

// passport使用BasicStrategy认证用户，session为false,passport不存储用户的session,每次请求都需要用户名密码
module.exports.isAuthenticated = passport.authenticate('basic', { session: false });