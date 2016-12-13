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


function getPage(page) {
	console.log(page)	
	if(page == 'attractions'){
		return '1';
	}else if(page == 'lodge'){
		return '3';
	}else if(page == 'food'){
		return '2';
	}else if(page == 'other'){
		return '4';
	}
}
app.post('/login', upload.array(), function(req, res) {
	db.login(req.body, function(error, results){
		if(!error) {
			console.log(JSON.stringify(results));
			res.send(JSON.stringify(results));
		}
	});
})

app.get('/roles', upload.array(), function(req, res) {
	db.getRoles(req.body, function(error, results){
		if(!error) {
			console.log(JSON.stringify(results));
			res.send(JSON.stringify(results));
		}
	});
})

app.get('/guide/list', upload.array(), function(req, res) {
	db.getGuides(req.body, function(error, results){
		if(!error) {
			res.send(JSON.stringify(results));
		}
	});
})

app.post('/guide/detail', upload.array(), function(req, res) {
	var item = req.body;
	db.getGuide(item, function(error, results1){
		if(!error) {
			db.getGuideVerifyPhotoes(item, function(error, results2){
				if(!error) {
					db.getGuideAlbum(item, function(error, results3){
						if(!error) {
							res.send(JSON.stringify({ album:results3, vpic:results2, info: results1}));
						}
					});
				}
			});
		}
	});
})
app.post('/guide/update', upload.array(), function(req, res) {
	var item = req.body;
	db.updateGuide(item, function(error, results){
		if(!error) {
			console.log(JSON.stringify(results));
			res.send(""+results.affectedRows);
		}else {
			res.send(JSON.stringify(results));
		}
	});
})

app.get('/guide/enable', upload.array(), function(req, res) {
	var id = req.query.id;
	var enable = req.query.enable;
	db.enableGuide(id, enable, function(error, results){
		if(!error) {
			res.send("ok");
		}
	});
})

app.post('/plans/recommend/get', upload.array(), function(req, res) {
	var item = req.body;
	db.getRecommendPlan(item, function(error, results){
		console.log("test");
		if(!error) {
			res.send(JSON.stringify(results));
		}
	});
})
app.post('/plans/recommend/update', upload.array(), function(req, res) {
	var item = req.body;
	console.log(item);
	db.updateRecommendPlan(item, function(error, results){
		if(!error) {
			res.send(JSON.stringify(results));
		}
	});
})
app.post('/stories/get', upload.array(), function(req, res) {
	var item = req.body;
	db.getStories(item, function(error, results){
		console.log("test");
		if(!error) {
			res.send(JSON.stringify(results));
		}
	});
})
app.post('/stories/delete', upload.array(), function(req, res) {
	var item = req.body;
	console.log(item);
	db.deleteStory(item, function(error, results){
		if(!error) {
			res.send(JSON.stringify(results));
		}
	});
})

app.get('/planservices/list', upload.array(), function(req, res) {
	var type = req.query.type;
	db.getPlanServices(type, function(error, results){
		if(!error) {
			res.send(JSON.stringify(results));
		}
	});
})

app.get('/planservices/enable', upload.array(), function(req, res) {
	var id = req.query.id;
	var enable = req.query.enable;
	var type = req.query.type;
	db.enablePlanService(type, id, enable, function(error, results){
		if(!error) {
			res.send("ok");
		}
	});
})



app.get('/context', upload.array(), function(req, res) {
	var page = req.query.page;
	var no = req.query.no;
	var key = req.query.key;
	var country = req.query.country;
	var city = req.query.city;
	var type = getPage(page);
	db.getALFs(type, no, key, country, city, function(error, results){
		if(!error) {
			res.send(results);
		}
	});
})

app.get('/photo', upload.array(), function(req, res) {
	var id = req.query.id;
	var no = req.query.no;
	db.getPhoto(id, no, function(error, results){
		if(!error) {
			db.getPhotoMaster(id, function(error, results2) {
				if(!error) {
					res.send(JSON.stringify({items:results, enable:(results2[0]?results2[0].PicURL:'')}));
				}
			});
		}
	});
})

app.get('/photo/delete', upload.array(), function(req, res) {
	var id = req.query.id;
	db.removePhoto(id, function(error, results){
		if(!error) {
			res.send("ok");
		}
	});
})

app.get('/photo/enable', upload.array(), function(req, res) {
	var id = req.query.id;
	var url = req.query.u;
	db.enablePhoto(id, url, function(error, results){
		if(!error) {
			res.send("ok");
		}
	});
})

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

app.post('/photo/update', upload.array(), function(req, res) {
	var data = req.body;
	var pic = decodeBase64Image(data.pic);
	//console.log(JSON.stringify(data));
	fdfs.upload(pic.data, {ext: 'jpg'}).then(function(fileId) {
			db.updatePhoto(data.id, fileId, function(error, results){
				if(!error) {
					res.send(fileId);
				}
			});
		}).catch(function(err) {
			console.log(err);
		});
	
})

app.post('/photo/title/update', upload.array(), function(req, res) {
	var data = req.body;
	db.updatePhotoTitle(data.id, data.introduce, function(error, results){
		if(!error) {
			res.send(data.introduce);
		}
	});
})


app.get('/enable', upload.array(), function(req, res) {
	var page = req.query.page;
	var id = req.query.id;
	var status = req.query.status;
	var type = getPage(page);
	db.enableALF(status, type, id, function(error, results){
		if(!error) {
			res.send("ok");
		}
	});
})

app.get('/remove', upload.array(), function(req, res) {
	var page = req.query.page;
	var id = req.query.id;
	var type = getPage(page);
	db.removeALF(type, id, function(error, results){
		if(!error) {
			//console.log(JSON.stringify(results));
			res.send("ok");
		}
	});
})

app.post('/insert', upload.array(), function(req, res) {
	var item = req.body;
	db.insertALF(item, function(error, results){
		if(!error) {
			//console.log(JSON.stringify(results));
			//res.send(""+results.insertId);
			res.send("1");
		}else {
			res.send("-1");
		}
	});
})

app.get('/locationcfg', upload.array(), function(req, res) {
	db.getCity(function(error, results2){
		if(!error) {
			db.getCountry(function(error, results3){
				if(!error) {
					db.getLabel(-1, function(error, results4){
						if(!error) {
							res.send(JSON.stringify({ country:results3, city:results2, label:results4}));
						}
					});
				}
			});
		}
	});
})

app.post('/geographic', upload.array(), function(req, res) {
	var item = req.body;
	db.editGeographic(item, function(error, results){
		if(!error) {
			console.log(JSON.stringify(results));
			res.send(""+results.affectedRows);
		}else {
			res.send("-1");
		}
	});
})

app.post('/privilege', upload.array(), function(req, res) {
	var item = req.body;
	db.privileges(item, function(error, results){
		console.log(" '"+JSON.stringify(results)+"' "+error+ " " + JSON.stringify(results));
		if(!error) {
			res.send(JSON.stringify(results));
		}else {
			res.send("-1");
		}
	});
});

app.post('/uprivilege', upload.array(), function(req, res) {
	var item = req.body;
	db.uprivileges(item, function(error, results){
		if(!error) {
			console.log("------"+JSON.stringify(results));
			res.send(""+results.affectedRows);
		}else {
			res.send("-1");
		}
	});
});

app.post('/edit', upload.array(), function(req, res) {
	var item = req.body;
	db.editALF(item, function(error, results){
		if(!error) {
			console.log(JSON.stringify(results));
			res.send(""+results.affectedRows);
		}else {
			res.send("-1");
		}
	});
})

app.get('/city', upload.array(), function(req, res) {
	var id = parseInt(req.query.id);
	db.getCityByCountry(id, function(error, results){
		if(!error) {
			res.send(JSON.stringify({city:results}));
		}
	});
})

app.get('/delcity', upload.array(), function(req, res) {
	var id = parseInt(req.query.id);
	db.delCity(id, function(error, results){
		if(!error) {
			res.send(""+results.affectedRows);
		}
	});
})

app.post('/updatecity', upload.array(), function(req, res) {
	var item = req.body;
	db.updateCity(item, function(error, results){
		if(!error) {
			res.send(""+results.affectedRows);
		}
	});
})

app.post('/addcity', upload.array(), function(req, res) {
	var item = req.body;
	db.addCity(item, function(error, results){
		if(!error) {
			res.send(""+results.affectedRows);
		}
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
