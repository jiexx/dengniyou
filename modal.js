var mysql = require('mysql');
var crypto = require('crypto');
var FdfsClient = require('fdfs');

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

var pool  = mysql.createPool({
	//host : '10.101.1.163',
	host : '123.59.144.47',
	user : 'root',
	//password : '123456',
	password: 'zl_2wsx!QAZ',
	connectionLimit: 500,
//	acquireTimeout: 30000
});
var IMG_HOST = "http://123.59.144.47/";

function doSql(funcArgu, onFinish) {
	pool.getConnection(function(err, conn) {
		if(err) { 
			console.log(err); 
			onFinish(true); 
			return;
		}
		console.log("doSql: "+funcArgu.sql+ "   "+ JSON.stringify(funcArgu.params));
		conn.query(funcArgu.sql, funcArgu.params, function(err, results) {
			conn.release(); // always put connection back in pool after last query
			//console.log(JSON.stringify(results));
			if(err) { 
				console.log(err); 
				if(onFinish) {
					onFinish(true, results);
				}
				return; 
			}
			if(onFinish) {
				onFinish(false, results);
			}
		});
	});
};
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
};
var uploadImage = function uploadImage(funcArgu, onFinish){
	var pic = decodeBase64Image(funcArgu.base64);
	fdfs.upload(pic.data, {ext: 'jpg'}).then(function(fileId) {
		if(onFinish) {
			onFinish(fileId);
		}
	}).catch(function(err) {
		console.log(err);
	});
};

var CallbackLooper = {
	loop: function() {
		var _this = this;
		if(_this.i == _this.count - 1) {
			if(_this.onFinish) {
				_this.onFinish();
			}
		}
		if(_this.i < _this.count) {
			_this.func(_this.funcArgus[_this.i], function(){
				if(_this.onOneFinish) {
					var one = [_this.funcArgus[_this.i]];
					one.concat(arguments);
					_this.onOneFinish.apply(this, one);
				}
				
				_this.i ++;
				_this.loop();
			});
		}
	},
	create: function(count, func, funcArgus, onFinish, onOneFinish) {
		var obj = {
			func:func, 
			count:count, 
			i:0, 
			onFinish:onFinish, 
			onOneFinish:onOneFinish, 
			loop:CallbackLooper.loop,
			funcArgus:funcArgus,
		};
		return obj;
	}
};
var CallbacksLooper = {
	loop: function() {
		var _this = this;
		if(_this.i == _this.count - 1) {
			if(_this.onFinish) {
				_this.onFinish();
			}
		}
		if(_this.i < _this.count) {
			_this.func[_this.i](_this.funcArgus[_this.i], function(){
				if(_this.onOneFinish) {
					var one = [_this.funcArgus[_this.i]];
					one.concat(arguments);
					_this.onOneFinish.apply(this, one);
				}
				_this.i ++;
				_this.loop();
			});
		}
	},
	create: function(count, func, funcArgus, onFinish, onOneFinish) {
		var obj = {
			func:func, 
			count:count, 
			i:0, 
			onFinish:onFinish, 
			onOneFinish:onOneFinish, 
			loop:CallbackLooper.loop,
			funcArgus:funcArgus,
		};
		return obj;
	},
};

var roger = {
	"shallow": function(obj) {
		if("object" == typeof obj) {
			var c = {};
			for(var tag in obj){
				if("object" != typeof obj[tag] ) {
					c[tag] = obj[tag];
				}
			}
			return c;
		}
		return null;
	},
	"format":function(json) {
		json["IMGHOST"] = IMG_HOST;
		//console.log(json);
		return JSON.stringify(json).replace(/\"\[|\]\"|\"{|}\"|\\\"|\\t/g, function(matched){  //
			return mapObj[matched];
		});
	},
	"finish":function(all) {
		var funcArgus = [];
		var funcs = [];
		for(var i in all.list) {
			var copy = all.list[i];
			for(var b in copy.after) {
				funcArgus.push({data:all.data, copy:all.copy});
				funcs.push(copy.before[i]);
			}
		}
	},
	// superior:  current parent of Copy in out vector.
	// tag: current parent's tag of Copy in out vector.
	"loop":function (copy, tag, modal, out) {  
		if("object" == typeof modal) {
			var copy = {tag:tag, valid:false, superior: copy, vector:out}; 
			for (var key in modal) { 
				out.push(copy);
				var child = modal[key];
				if("object" == typeof child) {
					roger.loop(copy, key, child, out);
				}
				if(roger.tagHandler[key]) {
					var val = child[key];
					roger.tagHandler[key](modal, copy, key, val);
				}
			}
		}
	},
	//all.data <-  receive req json data
	//eg.{UserID:1234,Pics:["",""]}
	//all.list 
	"prepare":function(all, onFinish){
		var funcArgus = [];
		var funcs = [];
		for(var i in all.list) {
			var copy = all.list[i];
			for(var b in copy.before) {
				funcArgus.push({data:all.data, copy:all.copy});
				funcs.push(copy.before[i]);
			}
		}
		var csl = CallbacksLooper.create(funcs.length, funcs, funcArgus, onFinish, null);
		csl.loop();
	},
	//all.data <-  receive req json data
	//eg.{UserID:1234,Pics:["",""]}
	//all.copy <-  semi list
	//eg."Picture": {"sql": "UPDATE SET ?, ?;",	"params":["Pics", "UserID"], "files":"Pics"}
	"uploadImages":function(all, onFinish){
		var datafiles = all.data[all.copy.files];
		var funcArgus = [];
		for(var i in datafiles) {
			funcArgus.push({base64:datafiles[i], copy:all.copy});
		}
		var cl = CallbackLooper.create(datafiles.length, uploadImage, funcArgus, 
			onFinish,
			function(funcArgu, fileid){
				var inputparams = [];
				for(var i in funcArgu.copy.params){
					var tag = funcArgu.copy.params[i];
					if(tag == funcArgu.copy.files) {
						inputparams.push(fileid);
					}else {
						inputparams.push(that.data[tag]);
					}
				}
				funcArgu.copy.input = inputparams;
			});
		cl.loop();
	},
	//all.data <-  receive req json data
	//eg.{UserID:1234,Pics:["",""]}
	//all.list <-  semi list, extract from modal tree.
	"process": function (all, onFinish) {
		var funcArgus = [];
		for(var i in all.list) {
			funcArgus.push({sql:all.list[i].sql, params:all.list[i].input, copy:list[i]});
		}
		var cl = CallbackLooper.create(funcArgus.length, doSql, funcArgus, 
			onFinish,
			function(funcArgu, err, results){
				if(!err) {
					funcArgu.copy.output = results;
				}
			});
		cl.loop();
	},
	"tagHandler" :{
// ---------------before SQL ||| multi before need implement callback1,callback2,callback3..., last one callback trigger finish callback
		"files": function(modal, copy, value){
			if( "string" == typeof value ){
				copy.files = value;
				copy.valid = false;
				if(!copy.before) {
					copy.before = [];
				}
				copy.before.push(function(data, callback){
					var all = {data: data, copy: this};
					roger.uploadImages(all, callback);
				});
			}
		},
		"params": function(modal, copy, value) {
			if( Array != value.constructor ) {
				copy.params = value;
				if(!copy.before) {
					copy.before = [];
				}
				copy.before.push(function(funcArgu, callback){
					var copy = this;
					var inputParams = [];
					for(var i in copy.params){
						var index = copy.params[i];
						inputParams.push(data[index]);
					}
					copy.input = inputParams;
					callback();
				});
			}
		},
// ---------------do SQL
		"sql": function(modal, copy, value) {
			if( "string" == typeof value ) { 
				copy.valid = true;
				copy.after = function(funcArgu, callback){  //funcArgu -- rows
					var copy = this;
					copy.out = funcArgu;
				};
				copy.sql = value;
			}	
		},
// ---------------after SQL ||| multi before need implement callback1,callback2,callback3..., last one callback trigger finish callback
		"key": function(modal, copy, value) {
			if( "string" == typeof value ) {
				copy.key = value;
				copy.after = function(funcArgu, callback){ //funcArgu -- rows
					var copy = this;
					var obj = {};
					for(var i in funcArgu) {
						var row = funcArgu[i];
						if(row[copy.key] && "object" != typeof row[copy.key] && Array != row[copy.key].constructor){
							obj[copy.key] = {__index:0,__values:[]};
							obj[copy.key].__index ++;
							obj[copy.key].__values.push(row);
						}
					}
					copy.out = obj;
				});
			}
		}
	}

}

function process(target, data, callback) {
	var copy = target.semi[target.i];
	for(var i in copy.before) {
		copy.before(data);
	}
	doSql(target, copy, copy.sql, copy.input, function(target, item, error, results){
		if(error) {
			callback(error, roger.finish(target));
		}
		var copy = item;
		for(var i in copy.after) {
			copy.after(results);
		}
		if(target.i < target.semi.length - 1) {
			process(target, data, callback);
		}
		if(target.i == target.semi.length - 1) {
			callback(error, roger.finish(target));
		}
	});
};

exports.rogerSmartSql = function(modal, data, callback) {
	var target = roger.prepare(modal);
	process(target, data, callback);
}