var express = require('express');
var compression= require('compression');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer({ dest: 'uploads/' }); 
//var iconv = require('iconv-lite');
var app = express();
var router = express.Router();
var fs = require("fs");
var request = require('request');
var user = require("./user");
var db = require("./db");
var modal = require("./modal2");
var pay = require('./pay');
var http= require("http");
var fdfsconfig = require('./fdfsconfig');
var config = require('./config');

app.use(compression());
app.use(bodyParser.json({limit: '50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/lib', express.static(__dirname + '/lib'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/fragment', express.static(__dirname + '/fragment'));
app.use('/', express.static(__dirname + '/html'));
app.use('/talk', express.static(__dirname + '/talk', {setHeaders:function (res, path, stat) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var fdfs = fdfsconfig.fdfs;

function decodeBase64Image(dataString) {
  //////console.log(dataString);
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (!matches || matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}
pay.config({
    //seller_email: 'pr@qinmaohao.com',
    seller_id:'2088612188470577',
    partner: '2088612188470577',
    key: 'w8dmwl2awivsqjv7f3m1chynw49ya8yv',
    notify_url: config.JAVA_SERVER+'/notify',//'http://123.59.144.169:8080/notify',//'http://www.dengniyou.com/notify',
    return_url: 'http://101.37.21.172:80'
});

app.post('/pay', upload.array(), function(req, res) {
    //var js = fs.readFileSync('./fakeorder', 'utf8');
    //var fake = JSON.parse(js);
    //WRITE ORDER INFO.123.59.144.44
    /*request.get('http://10.101.1.36:80/travel/order/addOrder',function (error, response, body) {
        console.log();
    });*/
	request.post(
        {
            url: config.LOCAL_HOST+'/travel/order/addOrder',
            method: "POST",
            json: req.body
        },
		function (error, response, body) {
			if (!error && response.statusCode == 200 && body.datas) {
			    var url = config.LOCAL_HOST+'/#/orderdetail?UserType=1&OrderID='+body.datas.orderid;
			    pay.setConfig('return_url', url);
                var usr_redirect_url = pay.buildDirectPayURL({
                    out_trade_no: ''+body.datas.orderNo,
                    subject: 'dengniyou-order',// 'order-312412',//body.datas.orderId,
                    body:  'dengniyou-order',//body.datas.orderId,
                    total_fee:  body.datas.costMoney
                });
                res.send(JSON.stringify({url:usr_redirect_url}));
			}else {
                res.send(JSON.stringify({ERR:+body.errcode}));
			}
		}
	);
});

//立即支付的时候
app.post("/pay2",function (req, res) {
    var params = req.body;
    var url = config.LOCAL_HOST+'/#/orderdetail?UserType=1&OrderID='+params.orderid;
    pay.setConfig('return_url', url);
    var usr_redirect_url = pay.buildDirectPayURL({
        out_trade_no: ''+ params.orderNo,
        subject: 'dengniyou-order',// 'order-312412',//body.datas.orderId,
        body:  'dengniyou-order',//body.datas.orderId,
        total_fee:  params.realCostMoney,//body.datas.costMoney
    });
    res.send(JSON.stringify({url:usr_redirect_url}));

});

app.post('/notify', function (req, res) {
    var params = req.body;
    console.log("params type:" + typeof params);
    console.log("params:" + JSON.stringify(params));
    pay.verify(params, function (err, result) {
        console.log("err:" + err);
        console.log("result:" + result);
        console.log("result type:" + typeof result);
        if (result == "true") {
            console.log("success start:"+config.JAVA_SERVER+"/apply/pay/updateOrderAfterPaid?out_trade_no=" + params.out_trade_no +
                "&total_fee=" + params.total_fee +
                "&trade_no=" + params.trade_no +
                "&buyer_email=" + params.buyer_email);
            request.get(config.JAVA_SERVER+"/apply/pay/updateOrderAfterPaid?out_trade_no=" + params.out_trade_no +
                "&total_fee=" + params.total_fee +
                "&trade_no=" + params.trade_no +
                "&buyer_email=" + params.buyer_email,
                function (error, response, body) {
                    console.log("error:" + error);
                });
            console.log("success end");
            console.log("success:" + 'success');
            res.send('success');//pay success. this is return alipay instead of user. HERE can change order state.
        } else {
            res.send('fail')
            console.error(err);
        }
    });
});

app.post('/new/service/car', upload.array(), function(req, res) {
    //var js = fs.readFileSync('./fakeorder', 'utf8');
    //var fake = JSON.parse(js);
    //WRITE ORDER INFO.123.59.144.44
    /*request.get('http://10.101.1.36:80/travel/order/addOrder',function (error, response, body) {
     console.log();
     });*/

    request.post(
        {
            url: config.JAVA_SERVER+'/travel/service/uploadServiceWeb',
            // url: 'http://10.101.1.36:80/travel/service/uploadServiceWeb',
            method: "POST",
            json: req.body.reqUploadService
        }
        ,
        function (error, response, body) {
            if (!error && response.statusCode == 200 && body.datas) {

                res.send(JSON.stringify({url:+false,"ServiceID":body.datas.serviceId}));
            }else {
                res.send(JSON.stringify({ERR:+body.errcode}));
            }
        }
    );

    // var opt = {
    //     host:'10.101.1.36',
    //     port:'80',
    //     path:"/travel/service/uploadService",
    //     method: "POST",
    //     headers: {
    //         "Content-Type": 'multipart/form-data'
    //     }
    // };
    //
    // data = req.body
    // var req = http.request(opt, function (serverFeedback) {
    //     if (serverFeedback.statusCode == 200) {
    //         var body = "";
    //         serverFeedback.on('data', function (data) {
    //             body += data;
    //         })
    //             .on('end', function () {
    //                 res.send(body);
    //             });
    //     }
    //     else {
    //         res.send("error");
    //     }
    // });

    // request(
    //     {
    //         method: "POST",
    //         headers: {
    //             "content-type": "multipart/form-data","boundary":'----#$%^&*------'
    //         },
    //         url: 'http://10.101.1.36:80/travel/service/uploadService',
    //         buff: req.body
    //     },
    //     function (error, response, body) {
    //         if (!error && response.statusCode == 200 && body.datas) {
    //             res.send(JSON.stringify({ERR:false}));
    //         } else{
    //             res.send(JSON.stringify({ERR:body.errcode}));
    //         }
    //
    //     }
    // );
});

app.get('/order/update', upload.array(), function (req, res) {

    parameters = req.body;
    request(config.JAVA_SERVER+'/travel/order/updateOrder?orderid=' + parameters.orderid
        + '&status=' + parameters.status, function (error, response, body) {
        if (!error && response.statusCode == 200 && body.datas) {
            console.log(body) // Show the HTML for the baidu homepage.
            res.send(JSON.stringify({url: +false, "message": "操作成功","status":0}));
        } else {
            res.send(JSON.stringify({url: +false, "message": "操作失败","status":1}));
        }
    })

});

app.post('/login', upload.array(), function(req, res) {
    if( req.body.loginName[0] && req.body.loginName[0].length > 0) {
        user.login({name:req.body.loginName[0], pwd:req.body.loginPass[0]}, function (err, msg) {
            res.send(JSON.stringify({error:err,message:msg}));
        })
    }
    else if(req.body.loginName[1] && req.body.loginName[1].length > 0){
        user.registe({name:req.body.loginName[1], pwd:req.body.loginPass[1], captcha:req.body.captcha[0], area:req.body.loginArea[1]}, function (err, msg) {
            res.send(JSON.stringify({error:err,message:msg}));
        })
    }
    else if(req.body.loginName[2] && req.body.loginName[2].length > 0){
        user.captchaLogin({name:req.body.loginName[2], captcha:req.body.captcha[1]}, function (err, msg) {
            res.send(JSON.stringify({error:err,message:msg}));
        })
    }
    else{
        res.send(JSON.stringify({error:true,message:'用户名不能为空'}));
    }
});
app.get('/roles', upload.array(), function(req, res) {
	db.getRoles(req.body, function(error, results){
		if(!error) {
			////console.log(JSON.stringify(results));
			res.send(JSON.stringify(results));
		}
	});
});
app.get('/talk', function (req, res) {
    var key = '25wehl3u255yw';
    request.post(
        {
            url: 'http://api.cn.ronghub.com/user/getToken.json',
            method: "POST",
            body: 'userId='+req.query.uid +'&name='+req.query.uname+'&portraitUri='+req.query.picurl,
            headers: {'Content-Type': 'application/x-www-form-urlencoded',
                'App-Key':key,
                'Nonce': '265675769',
                'Timestamp':'1484030896',
                'Signature': '1e43156d36f53efa16c607e1b58f5be77ba6b158'
            },
        },
        function (error, response, body) {
            var data = JSON.parse(body);
            if (!error && response.statusCode == 200 && data.code == 200) {
                console.log(data.token);
                var token = new Buffer(data.token).toString('base64');
                var url = encodeURIComponent('uid='+req.query.uid+'&uname='+req.query.uname+'&picurl='+req.query.picurl+'&tid='+req.query.tid+'&no='+key+'&token='+token+'&msg='+req.query.msg);
                res.redirect('/talk/talk.html?'+encodeURIComponent(url));
            }
        }
    );
});

app.post('/sms/get', function (req, res) {
    user.getCaptcha({name:req.body.mobile}, function (err, msg) {
        res.send(JSON.stringify({error:err, message:msg}));
    });
});

app.post('/photo/insert', upload.array(), function(req, res) {
	var data = req.body;
	var pic = decodeBase64Image(data.pic);
	//////console.log(JSON.stringify(data));
	fdfs.upload(pic.data, {ext: 'jpg'}).then(function(fileId) {
			db.insertPhoto(data.id, fileId, data.introduce, function(error, results){
				if(!error) {
					res.send(JSON.stringify({SpotsID:data.id, SpotsDetialID:results.insertId, PicURL:fileId, Summary:data.introduce, CreateDate:'', UpdateDate:'' }));
				}
			});
		}).catch(function(err) {
			////console.log(err);
		});
	
})

//usertype:1,游客，2导游,userID
app.post('/order/list', upload.array(), function(req, res) {
    db.getOrderList(req.body, function(error, results){
        if(!error) {
            ////console.log(JSON.stringify(results));
            res.send(results);
        }
    });
});

//usertype:1,游客，2导游,userID
app.get('/order/getAddorderDetail', upload.array(), function(req, res) {
    db.getAddorderDetail(req.query, function(error, results){
        if(!error) {
            ////console.log(JSON.stringify(results));
            res.send(results);
        }
    });
});


app.post('/service/list', upload.array(), function (req, res) {
    parameters = req.body;
    //Integer type, Integer page, String condition, Long userID, int regionType,Integer regionID
    // var urlarray = [];
    // urlarray.push('http://123.59.144.44/travel/service/getCustomServiceByConditionForWeb?');

    request(config.JAVA_SERVER+'/travel/service/getCustomServiceByConditionForWeb?' +
        'type=' + parameters.type
        + '&page=' + parameters.page
        + '&condition=' + (parameters.condition?  encodeURI(parameters.condition):'')
        + '&userID=' + (parameters.userID?  parameters.userID:'')
        + '&regionType=' + parameters.regionType
        + '&regionID=' + (parameters.regionID?  parameters.regionID:'')
        , function (error, response, body) {
            if (!error && response.statusCode == 200 && JSON.parse(body).datas) {
                jsonret= JSON.parse(body).datas;
                jsonret["IMGHOST"] = db.getimg_host();
                //console.log(body); //

                res.send(JSON.stringify(jsonret));
            } else {
                res.send(JSON.stringify({url: +false, "message": "失败", "status": 1}));
            }
        });
});

//导游个人详情
app.post('/guideDetail', upload.array(), function (req, res) {
    request.get(config.JAVA_SERVER+'/travel/user/getGuiderDetail?userID='+ req.body.UserID +'&guiderID=' + req.body.UserID,function (error, response, body) {
            var data = JSON.parse(body);
            if (!error && response.statusCode == 200 && data.datas) {
                res.send(body);
            } else {
                res.send(JSON.stringify({url: +false, "message": "失败", "status": 1}));
            }
        }
    );
});

app.post('/guideDetail/update', upload.array(), function (req, res) {
    request.post(
        {
            url: config.JAVA_SERVER+'/travel/userweb/updateGuiderInfoWeb',
            method: "POST",
            json: req.body
        },
        function (error, response, body) {
            //var data = JSON.parse(body);
            if (!error && response.statusCode == 200) {
                res.send(body);
            }else{
                res.send(JSON.stringify({url: +false, "message": body.message, "status": 1}));
            }
        })
});
//个人信息认证
app.post('/getVerifyImf', upload.array(), function (req, res) {
    request.get(config.JAVA_SERVER+'/travel/user/getVerifyImf?userID='+ req.body.UserID, function (error, response, body) {
            var data = JSON.parse(body);
            if (!error && response.statusCode == 200 && data.datas) {
                res.send(body);
            } else {
                res.send(JSON.stringify({url: +false, "message": "失败", "status": 1}));
            }
        }
    );
});
app.post('/userVerify/save', upload.array(), function (req, res) {
    request.post(
        {
            url: config.JAVA_SERVER+'/travel/userweb/setVerifyImfWeb',
            method: "POST",
            json: req.body
        },
        function (error, response, body) {
            //var data = JSON.parse(body);
            if (!error && response.statusCode == 200) {
                res.send(body);
            }else{
                res.send(JSON.stringify({url: +false, "message": body.message, "status": 1}));
            }
        })
});
//获取合作协议
app.post('/getContract', upload.array(), function (req, res) {
    request.get(config.JAVA_SERVER+'/travel/user/getContract', function (error, response, body) {
            var data = JSON.parse(body);
            if (!error && response.statusCode == 200 && data.datas) {
                res.send(body);
            } else {
                res.send(JSON.stringify({url: +false, "message": "失败", "status": 1}));
            }
        }
    );
});

//方案发布隐藏切换
app.post('/travel/guideplan/editPlanStatus', upload.array(), function(req,res){
    request.get(config.JAVA_SERVER +'/travel/guideplan/editPlanStatus?planStatus='+ req.body.planStatus +'&planID=' + req.body.planID + '&userID=' + req.body.userID,function (error, response, body) {
            var data = JSON.parse(body);
            if (!error && response.statusCode == 200 && data.errcode == 0) {
                res.send(body);
            } else {
                res.send(JSON.stringify({url: +false, "message": "失败", "status": 1}));
            }
        }
    );
});

//get国家区号
app.post('/getAreaCodeInfo', upload.array(), function(req,res){
    request.get(config.JAVA_SERVER +'/travel/auth/getAreaCodeInfo',function (error, response, body) {
            var data = JSON.parse(body);
            if (!error && response.statusCode == 200 && data.errcode == 0) {
                res.send(body);
            } else {
                res.send(JSON.stringify({url: +false, "message": "失败", "status": 1}));
            }
        }
    );
});

var MODAL = {};
var server = app.listen(8089, function() {
	
	var host = server.address().address;
	var port = server.address().port;
	
	
	readFiles('./modal/', function(filename, content) {
		
		var point = '/'+filename.substring(0,filename.indexOf('.')).replace(/-/g,'/');
		MODAL[point] = JSON.parse(content);
		console.log(point);
		app.post(point, upload.array(), function(req, res) {
			//console.log('------------');
			console.log('POINT:'+point+ '  '+JSON.stringify(req.body));
			modal.rogerSmartSql(MODAL[point], req.body, function(error, results){
				//console.log('end.');
				res.send(results);
			});
		});
		if(true) {
			app.get(point, upload.array(), function(req, res) {
				//console.log('------------');
				console.log('POINT:'+point+ '  '+JSON.stringify(req.query));
                modal.rogerSmartSql(MODAL[point], req.query, function(error, results){
					res.send(results);
				});
			});
		}
	}, function(err) {
		//console.log("modal ERROR!");
	});

	//console.log("RUNNING http://%s:%s", host, port);
});
process.on('uncaughtException', function(err) {
    //////console.log('----------------------------------------   >>   uncaughtException:'+err);
});
server.on('error', function(err) { 
	//console.log('SERVER ERR:  '+err);
});
process.on('SIGINT', function() {
    //console.log('Naughty SIGINT-handler');
	process.exit()
});
