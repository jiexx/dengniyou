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
	connectionLimit: 500
//	acquireTimeout: 30000
});
var IMG_HOST = "http://123.59.144.47/";

function doSql(funcArgu, onFinish) {
	pool.getConnection(function(err, conn) {
		if(err) { 
			////console.log(err);
			onFinish(true);
			return;
		}
		//console.log("doSql: "+funcArgu.sql+ "   "+ JSON.stringify(funcArgu.params));
		conn.query(funcArgu.sql, funcArgu.params, function(err, results) {
			conn.release(); // always put connection back in pool after last query
			//////console.log(JSON.stringify(results));
			if(err) {
				////console.log(err);
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
  //////console.log(dataString);
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
		////console.log(err);
	});
};

var CallbackLooper = {
	loop: function() {
		var _this = this;
		////console.log(_this.func.toString() + ' 	'+_this.i+'  '+_this.count);
		if(_this.i == _this.count) {
			if(_this.onFinish) {
				_this.onFinish();
			}
		}
		if(_this.i < _this.count) {
			if(_this.funDoings && _this.funDoings[_this.i]) {
				_this.funDoings(_this.funcArgus[_this.i]);
			}
			_this.func(_this.funcArgus[_this.i], function(){  //<--- eg. == before after callback
				if(_this.onOneFinish) {
					var args = new Array(arguments.length+1);
					args[0] = _this.funcArgus[_this.i];
					for(var i = 0; i < arguments.length; ++i) {
						args[i+1] = (arguments[i]);
					}
					_this.onOneFinish.apply(this, args);
				}

				_this.i ++;
				//console.log(' 	sql'+_this.i+'  '+_this.count);
				_this.loop();
			});
		}
	},
    expand: function(funcArgus) { // must be called in onOneFinish
        this.count += funcArgus.length;
        this.funcArgus = this.funcArgus.concat(funcArgus);
    },
	create: function(count, func, funDoings, funcArgus, onFinish, onOneFinish) {
		var obj = {
			func:func,
			count:count,
			i:0,
			onFinish:onFinish,
			onOneFinish:onOneFinish,
            funDoings: funDoings,
			loop:CallbackLooper.loop,
            expand:CallbackLooper.expand,
			funcArgus:funcArgus
		};
		return obj;
	}
};
var CallbacksLooper = {
	loop: function() {
		var _this = this;
		if(_this.i == _this.count) {
			if(_this.onFinish) {
				_this.onFinish();
			}
		}
		if(_this.i < _this.count) {
			_this.func[_this.i](_this.funcArgus[_this.i], function(){
				if(_this.onOneFinish) {
					var args = new Array(arguments.length+1);
					args[0] = _this.funcArgus[_this.i];
					for(var i = 1; i < arguments.length; ++i) {
						args[i+1] = (arguments[i]);
					}
					_this.onOneFinish.apply(this, args);
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
			loop:CallbacksLooper.loop,
			funcArgus:funcArgus
		};
		return obj;
	}
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
		//////console.log(json);
		return JSON.stringify(json).replace(/\"\[|\]\"|\"{|}\"|\\\"|\\t/g, function(matched){
			return mapObj[matched];
		});
	},
	"replaceParam":function (params, replacement, matched) {  //input : have been replaced data by before handler.  Params === []
        var inputparams = [];
        for(var i in params){
            var param = params[i];
            if(param == matched) {
                inputparams.push(replacement);
            }else {
                inputparams.push(param);
            }
        }
        return inputparams;
    },
    "replaceParams":function (params, replacement, matched) {  //input : have been replaced data by before handler.  Params === [][]
        var inputparams = [];
        for(var i in params){
        	var row = new Array(params[i].length);
            for(var j in params) {
                param = params[i][j]
                if (param == matched) {
                    row.push(replacement);
                } else {
                    row.push(param);
                }
            }
            inputparams.push(row);
        }
        return inputparams;
    },
	"after":function(list, data, onFinish) {
		//console.log('after in:');
		var funcArgus = [];
		var funcs = [];
		for(var i in list) {
			var copy = list[i];
			for(var b in copy.after) {
				if(copy.after) {
					funcArgus.push({output:copy.output, copy:copy});
					funcs.push(copy.after[i]);
				}
			}
		}
		var csl = CallbacksLooper.create(funcs.length, funcs, funcArgus, onFinish, null);
		csl.loop();
	},
	// superior:  current parent of Copy in out vector.
	// tag: current parent's tag of Copy in out vector.
	"prepare":function (superior, tag, modal, out) {
		if("object" == typeof modal) {
			var copy = {tag:tag, valid:false, superior: superior, vector:out};
			out.push(copy);
			for (var key in modal) {
				var child = modal[key];
				if("object" == typeof child && Array != child.constructor) {
					roger.prepare(copy, key, child, out);
				}else {
					if(roger.tagHandler[key]) {
						//var val = child[key];
						roger.tagHandler[key](modal, copy, child);
					}
				}
			}
		}
	},
	"complete":function(list) {
		var out = {};
		var tag = '';
		for(var i in list) {
            //console.log(list[i].tag);
            tag = list[i].tag;
            if ('root' != tag) {
                out[tag] = list[i].output;
            }
        }
		return roger.format(out);
	},
	//all.data <-  receive req json data
	//eg.{UserID:1234,Pics:["",""]}
	//all.list
	"before":function(list, data, onFinish){
		var funcArgus = [];
		var funcs = [];
		for(var i in list) {
			var copy = list[i];
			for(var b in copy.before) {
				if(copy.before[b]) {
					funcArgus.push({data:data, copy:copy});
					funcs.push(copy.before[b]);
				}
			}
		}
		var csl = CallbacksLooper.create(funcs.length, funcs, funcArgus, onFinish, null);
		csl.loop();
	},
	//data <-  receive req json data
	//eg.{UserID:1234,Pics:["",""]}
	//copy <-  semi list
	//eg."Picture": {"sql": "UPDATE SET ?, ?;",	"params":["Pics", "UserID"], "files":"Pics"}
	"uploadImages":function(copy, data, onFinish){
		var datafiles = data[copy.files];
		var funcArgus = [{base64:datafiles[i], copy:copy}];
		for(var i = 0 ; i < datafiles.length - 1 ; i ++) {
			var shallow = roger.shallow(copy);
			copy.vector.push(shallow);
			funcArgus.push({base64:datafiles[i], copy:shallow});
		}
		var cl = CallbackLooper.create(funcArgus.length, uploadImage, funcArgus,
			onFinish,
			function(funcArgu, fileid){
				var inputparams = [];
				for(var i in funcArgu.copy.params){
					var param = funcArgu.copy.params[i];
					if(param == funcArgu.copy.files) {
						inputparams.push(fileid);
					}else {
						inputparams.push(funcArgu.data[param]);
					}
				}
				//expand...
				//var shallow = roger.shallow(funcArgu.copy);
                //shallow.input = inputparams;
                //funcArgu.copy.list.push(shallow);
				if(!funcArgu.copy.input) {
                    funcArgu.copy.input = [];
				}
                funcArgu.copy.input.push(inputparams);
			});
		cl.loop();
	},
	//eg.{UserID:1234,Pics:["",""]}
	//all.list <-  semi list, extract from modal tree.
	"process": function (list, onFinish) {
		var funcArgus = [];
		var funDoings = [];
		for(var i in list) {
			if(list[i].valid) {
				funcArgus.push({sql:list[i].sql, params:list[i].input, copy:list[i]});
                funDoings.push(list[i].doing);
			}
		}
		var cl = CallbackLooper.create(funcArgus.length, doSql, funcArgus,
            funDoings,
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
				copy.before.push(function(funcArgu, onFinish){ //funcArgus.push({data:data, copy:copy});
					roger.uploadImages(funcArgu.copy, funcArgu.data, onFinish);
				});
			}
		},
		"params": function(modal, copy, value) {
			if( Array == value.constructor ) {
				copy.params = value;
				if(!copy.before) {
					copy.before = [];
				}
				copy.before.push(function(funcArgu, onFinish){ //funcArgus.push({data:data, copy:copy}); //funcArgu -- rows  onFinish == self func finish
					var inputParams = [];
					for(var i in funcArgu.copy.params){
						var index = funcArgu.copy.params[i];
						inputParams.push(funcArgu.data[index]);
					}
					funcArgu.copy.input = inputParams;
					onFinish();
				});
			}
		},
// ---------------do SQL
		"sql": function(modal, copy, value) {
			if( "string" == typeof value ) {
				copy.valid = true;
				copy.sql = value;
				copy.input = null;
				copy.output = null;
			}
		},
        "findkey": function(modal, copy, value) {
            if( "string" == typeof value ) {
                copy.findkey = value;
                copy.doing = function(funcArgu){ //funcArgus.push({data:data, copy:copy}); //funcArgu -- rows  onFinish == self func finish
                    var superior = funcArgu.copy.superior;
                    var copy = funcArgu.copy;
                    var key;
                    if('object' == typeof superior.output) {
                        key = superior.output[copy.findkey]
                        copy.outkey = key;
                        if(Array ==  copy.input[0].constructor) {
                        	var inputParams = copy.input;
                        	for(var i in inputParams) {
                                copy.input = roger.replaceParams(inputParams[i], key, copy.findkey);
                                var s = roger.shallow(funcArgu);
                                s.copy = copy;
                                shallows.push(s);
                                this.expand(shallows);
                            }
						}else {
                            copy.input = roger.replaceParam(copy.input, key, copy.findkey);
						}
					}else if(Array == superior.output.constructor && Array == copy.input.constructor && copy.input[0] && Array != copy.input[0].constructor){
                    	var inputParams = [];
                        var shallows = [];
                    	for(var i in superior.output) {
                            key = superior.output[i][copy.findkey]
							copy.outkey = key;
                            copy.input = roger.replaceParam(copy.input, key, copy.findkey);
						}
					}
                };
            }
        },
// ---------------after SQL ||| multi before need implement callback1,callback2,callback3..., last one callback trigger finish callback
		"key": function(modal, copy, value) {
			if( "string" == typeof value ) {
				copy.key = value;
				copy.after.push(function(funcArgu, onFinish){ //funcArgu -- rows
					var copy = funcArgu.copy;
					var obj = {};
					for(var i in funcArgu.output) {
						var row = funcArgu.output[i];
						if(row[copy.key] && "object" != typeof row[copy.key] && Array != row[copy.key].constructor){
							obj[copy.key] = {__index:0,__values:[]};
							obj[copy.key].__index ++;
							obj[copy.key].__values.push(row);
						}
					}
					funcArgu.copy.output = obj;
					onFinish();
				});
			}
		}
	}

}


exports.rogerSmartSql = function(modal, data, callback) {
	var out = [];
	roger.prepare(null, 'root', modal, out);
	roger.before(out, data, function(){
		//console.log('BEFORE:');
		roger.process(out, function(){
			//console.log('PROCESS:');
			roger.after(out, data, function(){
				//console.log('AFTER:');
				var results = roger.complete(out);
				callback(results);
			});
		});
	});
}