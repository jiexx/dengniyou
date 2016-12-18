var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer({ dest: 'uploads/' }); 
//var iconv = require('iconv-lite');
var app = express();
var router = express.Router();
var fs = require("fs");
var request = require('request');
var db = require("./db");
var FdfsClient = require('fdfs');

app.use(bodyParser.json({limit: '50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/lib', express.static(__dirname + '/lib'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/', express.static(__dirname + '/html'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var fdfs = new FdfsClient({
    // tracker servers
    trackers: [
        {
            //host: '10.101.1.165',
			host: '123.59.144.47',
            port: 22122
        }
    ],
    timeout: 10000,
    //defaultExt: 'txt',
    charset: 'utf8'
});

function decodeBase64Image(dataString) {
  //console.log(dataString);
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (!matches || matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

function doSql() {
	
}


app.post('/login', upload.array(), function(req, res) {
	db.login(req.body, function(error, results){
		if(!error) {
			console.log(JSON.stringify(results));
			res.send(JSON.stringify(results));
		}
	});
});
app.post('/plan/detail', upload.array(), function(req, res) {
	db.getPlanDetail(req.body, function(error, results){
		if(!error) {
			//console.log(JSON.stringify(results));
			var info = {PlanName:results[0].PlanName,PlanPriceBase:results[0].PlanPriceBase,};
			
			res.send(JSON.stringify({ IMGHOST:IMG_HOST, 
										info:results}));
		}
	});
});
app.get('/roles', upload.array(), function(req, res) {
	db.getRoles(req.body, function(error, results){
		if(!error) {
			console.log(JSON.stringify(results));
			res.send(JSON.stringify(results));
		}
	});
});

app.post('/home', upload.array(), function(req, res) {
	/*var item = req.body;
	db.getPlansByContinent({continent:3}, function(error, results1){
		if(!error) {
			db.getPlansByContinent({continent:3}, function(error, results2){
				if(!error) {
					db.getPlansByContinent({continent:3}, function(error, results3){
						if(!error) {
							db.getAdvs(item, function(error, results4){
								if(!error) {
									res.send(JSON.stringify(
										{ IMGHOST:IMG_HOST, 
										advs:results4,
										continent1:results1, 
										continent2:results2, 
										continent3:results3}
									));
								}
							});
						}
					});
				}
			});
		}
	});*/
	db.rogerSmartSql('./modal/home.json', function(error, results){
		res.send(results);
	});
});

app.post('/photo/insert', upload.array(), function(req, res) {
	var data = req.body;
	var pic = decodeBase64Image(data.pic);
	//console.log(JSON.stringify(data));
	fdfs.upload(pic.data, {ext: 'jpg'}).then(function(fileId) {
			db.insertPhoto(data.id, fileId, data.introduce, function(error, results){
				if(!error) {
					res.send(JSON.stringify({SpotsID:data.id, SpotsDetialID:results.insertId, PicURL:fileId, Summary:data.introduce, CreateDate:'', UpdateDate:'' }));
				}
			});
		}).catch(function(err) {
			console.log(err);
		});
	
})

app.get('/detail', upload.array(), function(req, res) {
	var id = req.query.id;
	db.getALF(id, function(error, results1){
		if(!error) {
			db.getCity(function(error, results2){
				if(!error) {
					db.getCountry(function(error, results3){
						if(!error) {
							db.getLabel(id, function(error, results4){
								if(!error) {
									res.send(JSON.stringify({ country:results3, city:results2, label:results4, resoult: results1}));
								}
							});
						}
					});
				}
			});
		}
	});
})

var server = app.listen(8088, function() {

	var host = server.address().address;
	var port = server.address().port;

	console.log("RUNNING http://%s:%s", host, port);
});
process.on('uncaughtException', function(err) {
    console.log('----------------------------------------   >>   uncaughtException:'+err);
});
server.on('error', function(err) { 
	console.log('SERVER ERR:  '+err);
});
process.on('SIGINT', function() {
    console.log('Naughty SIGINT-handler');
	process.exit()
});
