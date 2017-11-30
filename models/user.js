var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs'); // 密码进行hash处理

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

// save方法调用之前执行
userSchema.pre('save', function(next) {
    var self = this;
    if (!self.isModified('password')) {
        return next();
    };
    bcrypt.genSalt(5, function(err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(self.password, salt, null, function(err, hash) {
            if (err) {
                return next(err);
            }
            self.password = hash;
            next();
        });
    });

});

// 验证password
userSchema.methods.verifyPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, match) {
        if (err) {
            return callback(err);
        }
        callback(null, match);
    })
}

module.exports = mongoose.model('User', userSchema);