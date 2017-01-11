var https = require('https');
var crypto = require('crypto');
var querystring = require('querystring');
//https://doc.open.alipay.com/doc2/detail?treeId=62&articleId=103740&docType=1
var _basicConfig = {
    alipay_gateway: 'https://mapi.alipay.com/gateway.do?',
    _input_charset: 'utf-8',
    sign_type: 'MD5'
};

function _assignMe(me, json) {
    for (var key in json) {
        if (json.hasOwnProperty(key)) {
            me[key] = json[key];
        }
    }
}



function _buildSign(json) {
    var keys = Object.keys(json);
    keys = keys.sort();
    var map = {};
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key !== 'sign' && key !== 'sign_type' && json[key]) {
            map[key] = json[key];
        }
    }
    var str = querystring.unescape(querystring.stringify(map)) + _basicConfig.key;
    return crypto.createHash(_basicConfig.sign_type).update(str, _basicConfig._input_charset).digest('hex');
}

exports.config = function (params) {
    _assignMe(_basicConfig, params);
};
exports.setConfig = function (key, val) {
    return _basicConfig[key] = val;
};

exports.buildDirectPayURL = function (orderParams) {
    var json = {
        service: 'alipay.wap.create.direct.pay.by.user',//'create_direct_pay_by_user',
        payment_type: '1',
        _input_charset: _basicConfig._input_charset,
        notify_url: _basicConfig.notify_url,
        partner: _basicConfig.partner,
        return_url: _basicConfig.return_url,
        //seller_email: _basicConfig.seller_email
        seller_id:_basicConfig.seller_id,
    };
    _assignMe(json, orderParams);
    json.sign = _buildSign(json);
    json.sign_type = _basicConfig.sign_type;
    return _basicConfig.alipay_gateway + querystring.stringify(json);//querystring.unescape(querystring.stringify(json));
};

exports.verify = function (params, callback) {
    var paramsSign = params.sign;
    var buildSign = _buildSign(params);
    if (paramsSign === buildSign) {
        var urlParams = {
            service: 'notify_verify',
            partner: _basicConfig.partner,
            notify_id: params['notify_id']
        };
        var url = _basicConfig.alipay_gateway + querystring.stringify(urlParams);
        var req = https.get(url, function (res) {
            res.on('data', function (data) {
                callback(null, data);
            });
        });
        req.on('error', function (err) {
            callback(err);
        });
        req.end();
    } else {
        callback('error:local sign is not same to remote alipay sign ');
    }
};