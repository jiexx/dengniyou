var mysql = require('mysql');
var crypto = require('crypto');

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

function doSql(copy, sql, params, callback) {
	pool.getConnection(function(err, conn) {
		if(err) { 
			console.log(err); 
			callback(copy, true); 
			return;
		}
		console.log("doSql: "+sql+ "   "+ JSON.stringify(params));
		conn.query(sql, params, function(err, results) {
			conn.release(); // always put connection back in pool after last query
			//console.log(JSON.stringify(results));
			if(err) { 
				console.log(err); 
				if(callback) {
					callback(copy, true, results);
				}
				return; 
			}
			if(callback) {
				callback(copy, false, results);
			}
		});
	});
};



var roger = {
	"shallow": function(obj) {
		if("object" == typeof obj) {
			var c = {};
			for(var tag in obj){
				if("object" != typeof obj[tag] && Array != obj[tag].constructor ) {
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
	"finish":function(target) {
		
	},
	"loop":function (superior, out) {
		if("object" == typeof superior) {
			for (var tag in superior) { 
				var child = superior[tag];
				if("object" == typeof child) {
					roger.loop(child, out)
				}
				if(roger.tagHandler[tag]) {
					var val = child[tag];
					roger.tagHandler[tag](superior, name, val, out);
				}
				
			}
		}
	},
	"prepare":function(modal){
		var list = [];
		roger.loop(modal, list);
		return {i:0, semi:list};
	},
	"tagHandler" :{
		"INTENARL_NULL_COPY": function(superior, tag, value, list){
			if( "object" == typeof value ) {
				var copy = {superior:superior};  
				list.push(copy);
			}	
		},
// ---------------before SQL
		"files": function(superior, tag, value, list){
			if( Array == value.constructor ){
				var curr = list[list.length-1];
				for(var i in value) {
					if( "string" == typeof value[i] ) {
						var copy = roger.shallow(curr)
						if(copy){
							list.push(copy);
						}
					}
				}
			}
		}
		"params": function(superior, tag, value, list) {
			var curr = list[list.length-1];
			if( Array != value.constructor ) {
				curr.params = value;
				curr.before.push(function(args){
					var copy = this;
					var inputParams = [];
					for(var i in copy.params){
						var index = copy.params[i];
						inputParams.push(args[index]);
					}
					copy.input = inputParams;
				});
			}
		},
// ---------------do SQL
		"sql": function(superior, tag, value, list) {
			if( "string" == typeof value ) {
				var copy = {active:true,before:[],after:[]};  
				curr.after.push(function(rows){
					var copy = this;
					copy.out = rows;
				});
				copy.tag = tag;
				copy.sql = value;
				copy.superior = superior;
				list.push(copy);
			}	
		},
// ---------------after SQL
		"key": function(superior, tag, value, list) {
			var curr = list[list.length-1];
			if( "string" == typeof value ) {
				curr.key = value;
				curr.after.push(function(rows){
					var copy = this;
					var obj = {};
					for(var i in rows) {
						var row = rows[i];
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

function process(target, params, callback) {
	var copy = target.semi[target.i];
	for(var i in copy.before) {
		copy.before(params);
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
			process(target, params, callback);
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