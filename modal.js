var mysql = require('mysql');
var crypto = require('crypto');
var fdfsconfig = require('./fdfsconfig');
var config = require('./config');
var fdfs = fdfsconfig.fdfs;

var pool  = mysql.createPool({
	host : config.DATA_HOST,
	// host : '114.55.139.196',
	user : 'traveldb',
	//password : '123456',
	password: 'traveldb',
	connectionLimit: 500
//	acquireTimeout: 30000
});
var IMG_HOST = "http://pic.dengnilvyou.com.cn/";

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
	if(!funcArgu.base64) {
        onFinish('');
        return;
	}
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
				_this.funDoings[_this.i](_this.funcArgus[_this.i]);
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
		if(funcArgus && funcArgus.length > 0) {
            this.count += funcArgus.length;
            this.funcArgus = this.funcArgus.concat(funcArgus);
        }
    },
	getArgus: function () {
		return this.funcArgus;
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
var mapObj = {"\\t":"","\"[":"[", "]\"":"]", "\"{":"{", "}\"":"}", "\\\"":"\""};
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
    "findParamsPos":function (findkey, params) {
        var pos = 0;
        for(pos in params) {
            if(params[pos] == findkey){
                break;
            }
        }
        return pos;
	},
	// input === 1d array
	"replace1DInputParams":function (input, replacement, pos) {  //input : have been replaced data by before handler.  Params === []
		var inputparams = [];
        for(var i in input){
            inputparams[i] = input[i];
        }
        inputparams[pos] = replacement;
        return inputparams;
    },
    //  input === 2d array
    "replace2DInputParams":function (input, replacement, pos) {  //input : have been replaced data by before handler.  Params === [][]
        var inputparams = [];
        for(var i in input){
            inputparams[i] = [];
        	for(var j in input[i]){
                inputparams[i][j] = input[i][j];
			}
			if(pos < inputparams[i].length){
                inputparams[i][pos] = replacement;
			}
        }
        return inputparams;
    },
	"after":function(list, data, onFinish) {
		//console.log('after in:');
		var funcArgus = [];
		var funcs = [];
		for(var i in list) {
			var copy = list[i];
			for(var i in copy.after) {
				if(copy.after[i]) {
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
        list = null;
		var r =  roger.format(out);
		out = null;
		return r;
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
		var funcArgus = [];
		if(!datafiles) {
			copy.valid = false;
            onFinish();
			return;
		}
		for(var i = 0 ; i < datafiles.length; i ++) {
/*			var shallow = roger.shallow(copy);
			copy.vector.push(shallow);*/
			funcArgus.push({base64:datafiles[i], copy:copy, data:data});
		}
		var cl = CallbackLooper.create(funcArgus.length, uploadImage, null, funcArgus,
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
				if(!funcArgu.copy.updImg) {
                    funcArgu.copy.updImg = true;
                    funcArgu.copy.input = [];
				}
                funcArgu.copy.input.push(inputparams);
			});
		cl.loop();
	},
    "uploadImage":function(copy, data, onFinish){

        var datafiles = [];
        for(var i in copy.file) {
        	datafiles.push(data[copy.file[i]]);
		}
        var funcArgus = [];
        if(!datafiles) {
            copy.valid = false;
            onFinish();
            return;
        }
        for(var i = 0 ; i < datafiles.length; i ++) {
			/*			var shallow = roger.shallow(copy);
			 copy.vector.push(shallow);*/
            funcArgus.push({base64:datafiles[i], copy:copy, data:data, name:copy.file[i]});
        }
        var cl = CallbackLooper.create(funcArgus.length, uploadImage, null, funcArgus,
            function () {
                var argus = cl.getArgus();
                var inputparams = funcArgu[0].copy.params;
                for(var i in argus){
                	var index = inputparams.indexOf(argus[i].name);
                	if(index > -1) {
                        inputparams[index] =  argus[i].fileid;
					}
                }
                funcArgu[0].copy.params = inputparams;
        		if(onFinish) {
                    onFinish();
				}
            },
            function(funcArgu, fileid){
        		funcArgu.fileid = fileid;
            });
        cl.loop();
    },
	//eg.{UserID:1234,Pics:["",""]}
	//all.list <-  semi list, extract from modal tree.
	"process": function (list, onFinish) {
		var funcArgus = [];
		var funDoings = [];
        var cl = CallbackLooper.create(funcArgus.length, doSql,
            funDoings ,
            funcArgus,
            onFinish,
            function(funcArgu, err, results){
                if(!err) {
                    funcArgu.copy.output = results;
                }
            });
		for(var i in list) {
			if(list[i].valid) {
				funcArgus.push({sql:list[i].sql, params:list[i].input, copy:list[i], looper:cl});
                funDoings.push(list[i].doing);
			}
		}
		cl.count = funcArgus.length;
		cl.loop();
	},
	"tagHandler" :{
// ---------------before SQL ||| multi before need implement callback1,callback2,callback3..., last one callback trigger finish callback
		"files": function(modal, copy, value){
			if( "string" == typeof value ){
				copy.files = value;
				//copy.valid = false;
				if(!copy.before) {
					copy.before = [];
				}
				copy.before.push(function(funcArgu, onFinish){ //funcArgus.push({data:data, copy:copy});
					roger.uploadImages(funcArgu.copy, funcArgu.data, onFinish);
				});
			}
		},
		"file": function(modal, copy, value){
            if( Array == value.constructor ){
                copy.file = value;
                //copy.valid = false;
                if(!copy.before) {
                    copy.before = [];
                }
                copy.before.push(function(funcArgu, onFinish){ //funcArgus.push({data:data, copy:copy});
                    roger.uploadImage(funcArgu.copy, funcArgu.data, onFinish);
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
                    if('object' == typeof superior.output && Array != superior.output.constructor && copy.input) {  //superior output is object
                        var replacement = superior.output[copy.findkey];
                        var pos = copy.params.indexOf(copy.findkey);//roger.findParamsPos(copy.findkey, copy.params);
                        if(Array ==  copy.input[0].constructor) {  //current input is 2d array
                        	var inputParams = roger.replace2DInputParams(copy.input, replacement, pos);
                            funcArgu.params = inputParams[0];
							var shallows = [];
							for(var i = 1; i < inputParams.length; i ++) {
								var fa = roger.shallow(funcArgu);
								fa.params = inputParams[i];
								fa.copy = copy;
								shallows.push(fa);
							}
                            funcArgu.looper.expand(shallows);
						}else { //current input is 1d array
                            funcArgu.params = roger.replace1DInputParams(copy.input, replacement, pos);
						}
					}// superior output is 2d array. current input is 1d array
					else if(Array == superior.output.constructor && Array == copy.input.constructor && copy.input[0] && Array != copy.input[0].constructor){
                        var replacement;
                        var pos;
                        var shallows = [];
						for (var i = 0; i < superior.output.length; i++) {
                            replacement = superior.output[i][copy.findkey];
							pos = copy.params.indexOf(copy.findkey);//roger.findParamsPos(copy.findkey, copy.params);
							funcArgu.params = roger.replace1DInputParams(copy.input, replacement, pos);
                            var fa = roger.shallow(funcArgu);
                            fa.params = roger.replace1DInputParams(copy.input, replacement, pos);
                            fa.copy = copy;
                            shallows.push(fa);
						}
                        funcArgu.looper.expand(shallows);
					}
                };
            }
        },
// ---------------after SQL ||| multi before need implement callback1,callback2,callback3..., last one callback trigger finish callback
		"orderby": function(modal, copy, value) {
			if( "string" == typeof value ) {
				copy.key = value;
                if(!copy.after) {
                    copy.after = [];
                }
				copy.after.push(function(funcArgu, onFinish){ //funcArgu -- rows
					var copy = funcArgu.copy;
					var obj = {};
                    var count = 0;
					for(var i in funcArgu.output) {
						var row = funcArgu.output[i];
						var r = row[copy.key];
						if(r && "object" != typeof r && Array != r.constructor) {
                            var o = obj[r];
							if(!o) {
                                obj[r] = {__index: 0, __values: []};
                                o = obj[r];
                                count++;
                                o.__index = count;
							}
                            o.__values.push(row);
                        }
					}
                    obj['__count'+copy.key] = count;
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
				callback(true, results);
			});
		});
	});
}