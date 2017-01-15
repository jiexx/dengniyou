var db = require("./db");
var request = require('request');
var _users = [];
var _filter = {
    errNameEmpty: function (name, pwd, captcha, callback) {
        if (!name) {
            callback(true, '用户名不能为空');
        }else {
            callback(false);
        }
    },
    errPwdEmpty: function (name, pwd, captcha, callback) {
        if (!pwd) {
            callback(true, '密码不能为空');
        }else {
            callback(false);
        }
    },
    errCacheUsrNotMatchPwd: function (name, pwd, captcha, callback) {
        if (_users[name] && _users[name].pwd != pwd) {
            callback(true, '用户名密码错误');
        }else {
            callback(false);
        }
    },
    errCacheUsrNotMatchCaptcha: function (name, pwd, captcha, callback) {
        if (_users[name] && _users[name].captcha == captcha) {
            callback(true, '用户名验证码错误');
            return;
        }else {
            callback(false);
        }
    },
    errDBUsrNotExist: function (name, pwd, captcha, callback) {
        db.getUser({loginName: name}, function (error, results) {
            if (!error) {
                if (results && results.length > 0) {
                    callback(true, '用户存在请登录');
                } else {
                    callback(true, '用户不存在,请先注册');
                }
            } else {
                callback(true, 'DB错误');
            }
        });
    },
    errDBUsrNotMatchPwd: function (name, pwd, captcha, callback) {
        db.login({loginName: name, loginPass: pwd}, function (error, results) {
            if (!error) {
                if (results && results.length > 0) {
                    _users[name] = {time: 0, pwd: pwd, captcha: null};
                    callback(false, JSON.stringify(results[0]));
                } else {
                    callback(true, '用户名密码错误');
                }
            } else {
                callback(true, 'DB错误');
            }
        });
    },
    errCaptchaEmpty: function (name, pwd, captcha, callback) {
        if (!captcha) {
            callback(true, '验证码不能为空');
        }else {
            callback(false);
        }
    },
    errCaptchaNotMatch: function (name, pwd, captcha, callback) {
        if (_users[name] && _users[name].captcha == captcha) {
            callback(true, '验证码错误');
        }else {
            callback(false);
        }
    },
    errCaptchaTimeout: function (name, pwd, captcha, callback) {
        var now = new Date().getTime();
        if(!_users[name]) {
            _users[name] = {time: now, pwd: null, captcha: null};
            callback(false);
        }
        var milisec_diff = _users[name].time < now ? now - _users[name].time : _users[name].time - now;
        if (milisec_diff > 600000) {
            callback(true, '验证码超时,请重新获取验证码');
        }else {
            callback(false);
        }
    },
    errCaptchaTooMany: function (name, pwd, captcha, callback) {
        var now = new Date().getTime();
        if(!_users[name]) {
            _users[name] = {time: now, pwd: null, captcha: null};
            callback(false);
        }
        var milisec_diff = _users[name].time < now ? now - _users[name].time : _users[name].time - now;
        if (milisec_diff < 60000) {
            callback(true, '验证码获取太频繁，请等'+(6000-milisec_diff)/1000+'秒');
            //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        }else {
            callback(false);
        }
    },
    errSendCaptcha: function (name, pwd, captcha, callback) {
        var key = '9cb31422e774d4fef8a8b767a7862646';
        captcha = Math.floor(Math.random()*10000);
        var text = '【等你游】您的验证码是'+captcha;
            request.post(
            {
                url: 'https://sms.yunpian.com/v2/sms/single_send.json',
                method: "POST",
                body: 'apikey='+key +'&mobile='+name+'&text='+text,
            },
            function (error, response, body) {
                var data = JSON.parse(body);
                console.log(body);
                if(!data.code) {
                    _users[name] = {time: new Date().getTime(), pwd: pwd, captcha: captcha};
                    callback(true,'请输入手机验证码');
                }
                callback(true,JSON.stringify({message:body}));
            }
        );
    },
    errRegiste: function (name, pwd, captcha, callback) {
        db.registe({loginName: name, loginPass: pwd}, function (error, results) {
            if (!error) {
                if (results && results.insertId > 0) {
                    _users[name] = {time: 0, pwd: pwd, captcha: null};
                    callback(false, JSON.stringify(results));
                } else {
                    callback(true, '内部错误');
                }
            } else {
                callback(true, 'DB错误');
            }
        });
    },
};
var _loginProcess = [_filter.errNameEmpty, _filter.errPwdEmpty,_filter.errCacheUsrNotMatchPwd,_filter.errDBUsrNotMatchPwd];
var _regProcess = [_filter.errNameEmpty, _filter.errPwdEmpty,_filter.errCaptchaEmpty,_filter.errCaptchaTimeout,_filter.errDBUsrNotExist,_filter.errRegiste,_filter.errDBUsrNotMatchPwd];
var _captchaloginProcess = [_filter.errNameEmpty,_filter.errDBUsrNotExist,_filter.errCaptchaEmpty,_filter.errCaptchaTimeout,_filter.errCacheUsrNotMatchCaptcha];
var _captchaGetProcess = [_filter.errNameEmpty,_filter.errCaptchaTooMany,_filter.errSendCaptcha];

var looper = function (count, processor, name, pwd, captcha, onFinish) {
    if(processor.length > count.i) {
        processor[count.i](name, pwd, captcha, function (err, msg) {
            if(!err) {
                count.i++;
                if(processor.length == count.i) {
                    onFinish(err, msg);
                }else {
                    looper(count, processor, name, pwd, captcha, onFinish);
                }
            }else {
                onFinish(err, msg);
            }
        });
    }
}

exports.login = function (name, pwd, onFinish) {
    var counter = {i:0};
    var captcha = '';
    looper(counter, _loginProcess, name, pwd, captcha, onFinish );
};

exports.captchaLogin = function (name, captcha, onFinish) {
    var counter = {i:0};
    var pwd = '';
    looper(counter, _captchaloginProcess, name, pwd, captcha, onFinish );
};

exports.registe = function (name, pwd, captcha, onFinish) {
    var counter = {i:0};
    looper(counter, _regProcess, name, pwd, captcha, onFinish );
};

exports.getCaptcha = function (name, onFinish) {
    var counter = {i:0};
    var captcha = '', pwd = '';
    looper(counter, _captchaGetProcess, name, pwd, captcha, onFinish );
};
