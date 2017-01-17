var db = require("./db");
var request = require('request');
var _users = [];
var _filter = {
    errNameEmpty: function (item, callback) {
        if (!item.name) {
            callback(true, '用户名不能为空');
        }else {
            callback(false);
        }
    },
    errPwdEmpty: function (item, callback) {
        if (!item.pwd) {
            callback(true, '密码不能为空');
        }else {
            callback(false);
        }
    },
    errCacheUsrNotMatchPwd: function (item, callback) {
        if (_users[item.name] && _users[item.name].pwd != item.pwd) {
            callback(true, '用户名密码错误');
        }else {
            callback(false);
        }
    },
    errDBUsrExist: function (item, callback) {
        db.getUser({loginName: item.name}, function (error, results) {
            if (!error) {
                if (results && results.length > 0) {
                    callback(true, '用户已存在请登录');
                } else {
                    callback(false);
                }
            } else {
                callback(true, 'DB错误');
            }
        });
    },
    errDBUsrForCaptcha: function (item, callback) {
        db.getUser({loginName: item.name}, function (error, results) {
            if (!error) {
                if (results && results.length > 0) {
                    callback(false, JSON.stringify(results[0]));
                } else {
                    callback(true, '用户不存在,请先注册');
                }
            } else {
                callback(true, 'DB错误');
            }
        });
    },
    errDBUsrNotMatchPwd: function (item, callback) {
        db.login({loginName: item.name, loginPass: item.pwd}, function (error, results) {
            if (!error) {
                if (results && results.length > 0) {
                    _users[item.name] = {time: 0, pwd: item.pwd, captcha: null};
                    callback(false, JSON.stringify(results[0]));
                } else {
                    callback(true, '用户名密码错误');
                }
            } else {
                callback(true, 'DB错误');
            }
        });
    },
    errCaptchaEmpty: function (item, callback) {
        if (!captcha) {
            callback(true, '验证码不能为空');
        }else {
            callback(false);
        }
    },
    errCaptchaNotMatch: function (item, callback) {
        if (_users[item.name] && _users[item.name].captcha != item.captcha) {
            callback(true, '验证码错误');
        }else {
            callback(false);
        }
    },
    errCaptchaTimeout: function (item, callback) {
        var now = new Date().getTime();
        if(!_users[item.name]) {
            _users[item.name] = {time: now, pwd: null, captcha: null};
            callback(false);
        }
        var milisec_diff = _users[item.name].time < now ? now - _users[item.name].time : _users[item.name].time - now;
        if (milisec_diff > 600000) {
            callback(true, '验证码超时,请重新获取验证码');
        }else {
            callback(false);
        }
    },
    errCaptchaTooMany: function (item, callback) {
        var now = new Date().getTime();
        if(!_users[item.name]) {
            _users[item.name] = {time: now, pwd: null, captcha: null};
            callback(false);
        }
        var milisec_diff = _users[item.name].time < now ? now - _users[item.name].time : _users[item.name].time - now;
        if (milisec_diff < 60000) {
            callback(true, '验证码获取太频繁，请等'+(6000-milisec_diff)/1000+'秒');
            //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        }else {
            callback(false);
        }
    },
    errSendCaptcha: function (item, callback) {
        var key = '9cb31422e774d4fef8a8b767a7862646';
        var captcha = Math.floor(Math.random()*10000);
        var text = '【等你游】您的验证码是'+captcha;
            request.post(
            {
                url: 'https://sms.yunpian.com/v2/sms/single_send.json',
                method: "POST",
                body: 'apikey='+key +'&mobile='+item.name+'&text='+text,
            },
            function (error, response, body) {
                var data = JSON.parse(body);
                console.log(body);
                if(!data.code) {
                    _users[item.name] = {time: new Date().getTime(), pwd: item.pwd, captcha: captcha};
                    callback(true,'请输入手机验证码');
                }
                callback(true,JSON.stringify({message:body}));
            }
        );
    },
    errRegiste: function (item, callback) {
        db.registe({loginName: item.name, loginPass: item.pwd, loginArea: item.area}, function (error, results) {
            if (!error) {
                if (results && results.insertId > 0) {
                    _users[item.name] = {time: 0, pwd: item.pwd, captcha: null};
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
var _regProcess = [_filter.errNameEmpty, _filter.errPwdEmpty,_filter.errCaptchaEmpty,_filter.errCaptchaTimeout,_filter.errCaptchaNotMatch,_filter.errDBUsrExist,_filter.errRegiste,_filter.errDBUsrNotMatchPwd];
var _captchaloginProcess = [_filter.errNameEmpty,_filter.errCaptchaEmpty,_filter.errCaptchaTimeout,_filter.errCaptchaNotMatch,_filter.errDBUsrForCaptcha];
var _captchaGetProcess = [_filter.errNameEmpty,_filter.errCaptchaTooMany,_filter.errSendCaptcha];

var looper = function (count, processor, item, onFinish) {
    if(processor.length > count.i) {
        processor[count.i](item, function (err, msg) {
            if(!err) {
                count.i++;
                if(processor.length == count.i) {
                    onFinish(err, msg);
                }else {
                    looper(count, processor, item, onFinish);
                }
            }else {
                onFinish(err, msg);
            }
        });
    }
}

exports.login = function (item, onFinish) {
    var counter = {i:0};
    var captcha = '';
    looper(counter, _loginProcess, item, onFinish );
};

exports.captchaLogin = function (item, onFinish) {
    var counter = {i:0};
    var pwd = '';
    looper(counter, _captchaloginProcess, item, onFinish );
};

exports.registe = function (item, onFinish) {
    var counter = {i:0};
    looper(counter, _regProcess, item, onFinish );
};

exports.getCaptcha = function (item, onFinish) {
    var counter = {i:0};
    looper(counter, _captchaGetProcess, item, onFinish );
};
