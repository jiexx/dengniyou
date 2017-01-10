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

function execfinal(conn, sql, params, callback, close) {
	conn.query(sql, params, function(err, results) {
		if(close) {
			conn.release(); // always put connection back in pool after last query
		}
		if(err) { 
			console.log(err); 
			if(callback) {
				callback(true, results);
			}
			return; 
		}
		if(callback) {
			callback(false, results);
		}
	});
}
function exec(conn, sql, params, callback) {
	conn.query(sql, params, function(err, results) {
		conn.release(); // always put connection back in pool after last query
		//console.log(results);
		if(err) { 
			console.log(err); 
			if(callback) {
				callback(true, results);
			}
			return; 
		}
		if(callback) {
			callback(false, results);
		}
	});
}

function doSql(name, sql, params, callback) {
	pool.getConnection(function(err, conn) {
		if(err) { 
			console.log(err); 
			callback(name, true); 
			return;
		}
		console.log("doSql: "+sql+ "   "+ JSON.stringify(params));
		conn.query(sql, params, function(err, results) {
			conn.release(); // always put connection back in pool after last query
			//console.log(JSON.stringify(results));
			if(err) { 
				console.log(err); 
				if(callback) {
					callback(name, true, results);
				}
				return; 
			}
			if(callback) {
				callback(name, false, results);
			}
		});
		//console.log(sql);
	});
};
function shallow(name, obj) {
    var copy = {};
    if (obj instanceof Object && obj.sql && typeof obj.sql =="string" && obj.params && obj.params instanceof Array) {
		copy.params = [];
		for (var i = 0, len = obj.params.length; i < len; i++) {
			if (null == obj.params[i] || "object" != typeof obj.params[i]) {
				copy.params[i] = obj.params[i];
			}
		}
		copy.name = name;
        copy.sql = obj.sql; 
		copy.key = obj.orderby;
		copy.visited = false;
    }
	return copy;
}

function prepareLoop(name, modal, list) {
	for (var i in modal) {
		if(modal[i] && modal[i] instanceof Object && typeof modal[i] !="string"&& !(modal[i].constructor == Array)) {
			var one = shallow(i, modal[i]);
			one.parent = shallow(name, modal);
			
			list.push(one);
			prepareLoop(i, modal[i], list);
		}
	}
};
var mapObj = {"\\t":"","\"[":"[", "]\"":"]", "\"{":"{", "}\"":"}", "\\\"":"\""};
function remJson(json) {
	json["IMGHOST"] = IMG_HOST;
	//console.log(json);
	return JSON.stringify(json).replace(/\"\[|\]\"|\"{|}\"|\\\"|\\t/g, function(matched){  //
		return mapObj[matched];
	});
}
function doLoop(list, data, obj, i, callback) {
	if(i.value < list.length && list[i.value] && !list[i.value].visited && list[i.value].sql) {
		var params = [];
		for(var a in list[i.value].params){
			params.push(data[list[i.value].params[a]]);
		}
		doSql(i, list[i.value].sql, params, function(index, error, results){			
			var name = list[index.value].name;
			if(index.value + 1 == list.length) {
				var key = list[index.value].key;
				if(key && typeof key =="string") {
					
					obj[name] = new Object();
					var count = 0;
					for(var j in results) {
						var value = results[j][key];
						if(value) {
							if(!obj[name][value]) {
								obj[name][value] = {__index:0,__values:[]};
								count ++;
							}
							obj[name][value].__values.push(results[j]);
							obj[name][value].__index ++;
							
						}
					}
					obj['__count'+name] = count;
				}else {
					obj[name] = results;
				}
				callback(error, remJson(obj));
			}else if(error) {
				list[index.value].visited = true;
				index.value ++;
				callback(error, (obj));
			}else {
				var key = list[index.value].key;
				if(key && typeof key =="string") {
					obj[name] = new Object();
					var count = 0;
					for(var j in results) {
						var value = results[j][key];
						if(value) {
							if(!obj[name][value]) {
								obj[name][value] = {__index:0,__values:[]};
								count ++;
							}
							obj[name][value].__values.push(results[j]);
							obj[name][value].__index ++;
						}
					}
					obj['__count'+name] = count;
				}else {
					obj[name] = results;
				}
				list[index.value].visited = true;
				index.value ++;
				doLoop(list, data, obj, i, callback);
			}
		});  
	}
};

exports.rogerSmartSql = function(modal, data, callback) {
	var result =  new Object();
	var list = [];
	var count = new Object();
	//var modal = require(file);
	count.value = 0;
	prepareLoop('', modal, list);
	//console.log(JSON.stringify(modal)+'    '+count.value);
	doLoop(list, data, result, count, callback);
}

exports.login = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var pwd = crypto.createHash('md5').update(item.loginPass).digest('hex').toUpperCase();
		var sql = "SELECT * FROM traveldb.tab_userinfo WHERE UserMobile = ?  AND Password = ?; ";
		exec(connection, sql, [item.loginName, pwd], callback);
		console.log(sql);
	});
};
exports.getUser = function(item, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log(err);
            callback(true);
            return;
        }
        var sql = "SELECT * FROM traveldb.tab_userinfo WHERE UserMobile = ?; ";
        exec(connection, sql, [item.loginName], callback);
    });
};
exports.registe = function(item, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log(err);
            callback(true);
            return;
        }
        var pwd = crypto.createHash('md5').update(item.loginPass).digest('hex').toUpperCase();
        var sql = "INSERT INTO traveldb.tab_userinfo (UserMobile, Password)VALUES(?,?); ";
        exec(connection, sql, [item.loginName, pwd], callback);
        console.log(sql);
    });
};
exports.getGuides = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "SELECT TO_DAYS(NOW()) - TO_DAYS(b.createTime) as daydiff, a.*, b.* FROM traveldb.tab_verifydentity as a right join traveldb.tab_userinfo  as b  on  a.userid = b.userid AND b.usertype=? order by b.createTime DESC; ";
		//var sql = "SELECT * FROM traveldb.tab_userinfo; ";
		exec(connection, sql, [item.type], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.getGuide = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "SELECT a.*, b.*,c.RegionCnName as countrycn,c.RegionEnName as countryen,d.RegionCnName as citycn,d.RegionEnName as cityen FROM traveldb.tab_verifydentity as a right join traveldb.tab_userinfo  as b  on  a.userid = b.userid left join traveldb.tab_travelregion as c on b.countryid=c.regionid left join traveldb.tab_travelregion as d on b.cityid=d.regionid  WHERE b.userid=?; ";
		//var sql = "SELECT * FROM traveldb.tab_userinfo; ";
		exec(connection, sql, [item.id], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.updateGuide = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		if(item.vpic.length > 0) {
			var sql = "UPDATE traveldb.tab_verifydentity SET IDNo=?,IssueTime=?,Comment=?,IDType=?,ValidTime=?,UpdateTime=NOW() WHERE verifyid= ?; ";
			execfinal(connection, sql, [item.vpic[0].IDNo,item.vpic[0].IssueTime,item.vpic[0].Comment,item.vpic[0].IDType,item.vpic[0].ValidTime,item.vpic[0].VerifyID]);
			console.log("UPDATE traveldb.tab_verifydentity SET IDNo=?,IssueTime=?,Comment=?,IDType=?,ValidTime=?,UpdateTime=NOW() WHERE verifyid= ?; "+[item.vpic[0].IDNo,item.vpic[0].IssueTime,item.vpic[0].Comment,item.vpic[0].IDType,item.vpic[0].ValidTime,item.vpic[0].VerifyID]);
		}
		var sql = "UPDATE traveldb.tab_userinfo SET UserMobile=?,UserType=?,AreaCode=?,Password=?,UserName=?,AppType=?,Sex=?,BirthDay=?,ResidenceTime=?,Title=?,PersonIntroduct=?,CityIntroduct=?,"+
					"Degree=?,Job=?,Major=?,Eduaction=?,Email=?,QQ=?,WeChat=?,Car=?,HasLanguage=?,LastLoginTime=?,TrueName=?,DrivingLicenses=?,Interest=?,Identified=?,"+
					"Labels=?,HomeCityID=?,Nationality=?,Company=?,Occupation=?,Tels=?,Skills=?,MasterPlace=?,FomiliarPlace=?,KnowPlace=?,HasLanguage=?,LastLoginTime=?,TrueName=? WHERE userid=?"
		var pwd = crypto.createHash('md5').update(item.info[0].Password).digest('hex');
		exec(connection, sql, [item.info[0].UserMobile,item.info[0].UserType,item.info[0].AreaCode,pwd,item.info[0].UserName,item.info[0].AppType,item.info[0].Sex,item.info[0].BirthDay,item.info[0].ResidenceTime,item.info[0].Title,item.info[0].PersonIntroduct,item.info[0].CityIntroduct,
								item.info[0].Degree,item.info[0].Job,item.info[0].Major,item.info[0].Eduaction,item.info[0].Email,item.info[0].QQ,item.info[0].WeChat,item.info[0].Car,item.info[0].HasLanguage,item.info[0].LastLoginTime,item.info[0].TrueName,item.info[0].DrivingLicenses,item.info[0].Interest,item.info[0].Identified,
								item.info[0].Labels,item.info[0].HomeCityID,item.info[0].Nationality,item.info[0].Company,item.info[0].Occupation,item.info[0].Tels,item.info[0].Skills,item.info[0].MasterPlace,item.info[0].FomiliarPlace,item.info[0].KnowPlace,item.info[0].HasLanguage,item.info[0].LastLoginTime,item.info[0].TrueName,item.info[0].UserID], callback);
		console.log(''+item.info[0].UserID+[item.info[0].UserMobile,item.info[0].UserType,item.info[0].AreaCode,item.info[0].Password,item.info[0].UserName,item.info[0].AppType,item.info[0].Sex,item.info[0].BirthDay,item.info[0].ResidenceTime,item.info[0].Title,item.info[0].PersonIntroduct,item.info[0].CityIntroduct,
								item.info[0].Degree,item.info[0].Job,item.info[0].Major,item.info[0].Eduaction,item.info[0].Email,item.info[0].QQ,item.info[0].WeChat,item.info[0].Car,item.info[0].HasLanguage,item.info[0].LastLoginTime,item.info[0].TrueName,item.info[0].DrivingLicenses,item.info[0].Interest,item.info[0].Identified,
								item.info[0].Labels,item.info[0].HomeCityID,item.info[0].Nationality,item.info[0].Company,item.info[0].Occupation,item.info[0].Tels,item.info[0].Skills,item.info[0].MasterPlace,item.info[0].FomiliarPlace,item.info[0].KnowPlace,item.info[0].HasLanguage,item.info[0].LastLoginTime,item.info[0].TrueName,item.info[0].UserID]);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};

exports.getGuideVerifyPhotoes = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "SELECT c.*, a.* FROM traveldb.tab_verifydentity as a right join traveldb.tab_userinfo  as b  on  a.userid = b.userid RIGHT JOIN traveldb.tab_verifyphoto as c ON a.verifyid = c.verifyid WHERE b.userid = ?;  ";
		//var sql = "SELECT * FROM traveldb.tab_userinfo; ";
		exec(connection, sql, [item.id], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.getGuideAlbum = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "SELECT * FROM traveldb.tab_userpicture WHERE userid = ?; ";
		//var sql = "SELECT * FROM traveldb.tab_userinfo; ";
		exec(connection, sql, [item.id], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.enableGuide = function(id, enable, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "UPDATE traveldb.tab_verifydentity SET VerifyResult = ? WHERE userid = ?; ";
		execfinal(connection, sql, [enable, id]);
		var sql = "UPDATE traveldb.tab_userinfo SET Identified = ? WHERE userid = ?; ";
		exec(connection, sql, [enable, id], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};

////usertype:1,游客，2导游,userID,status,page
exports.getOrderList = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}

        var sql =[];
		var countSql = [];
        if(item.usertype == 1){
            countSql.push("SELECT cast(count(*)/8 as decimal(10,0)) as Count  from travelorderdb.tab_travelorder travelorder where travelorder.UserID = "+item.userID);
            sql.push( "select 1 as usertype,travelorder.orderNo,travelorder.OrderID as orderid,travelorder.ServiceTripID,travelorder.CloseReason,travelorder.ServiceTripName,travelorder.GuideID as userid,userinfo.UserName as username,travelorder.Status as status, " +
                "                           userservice.ServiceName as servicename,userservice.PrimaryPrice as money,ServiceTripTypeID, ServiceTripTypeName,IF(travelorder.OrderType=1,pict.PicURL,plan.picurl) as picurl, " +
                "                           userservice.Unit as unit,DATE_FORMAT(travelorder.StartTime, '%Y/%m/%d') AS starttime,DATE_FORMAT(travelorder.EndTime, '%Y/%m/%d') AS endtime,travelorder.CostMoney as costmoney,travelorder.realCostMoney,travelorder.TravelDays as traveldays, " +
                "                           travelorder.IfEvaluate as ifevaluate,travelorder.IfReply as ifreply,userinfo.AvatarPicURL " +
                "                           from travelorderdb.tab_travelorder travelorder left join traveldb.tab_userinfo userinfo on travelorder.GuideID = userinfo.UserID " +
                "                                                            left join traveluserdb.tab_services userservice on travelorder.ServiceTripID=IF(travelorder.OrderType=1,userservice.ServiceID,-1) " +
                "                                                            left join traveluserdb.tab_facilitypictures pict on (IF(travelorder.OrderType=1,userservice.ServiceID,-1)=pict.PictureID AND pict.PicType=1 AND pict.IsCover=1) " +
                "                                                            left join traveluserdb.tab_planinfo plan on(travelorder.ServiceTripID=IF(travelorder.OrderType=2,plan.PlanID,-1)) " +
                "							where travelorder.UserID = "+item.userID);
		} else if(item.usertype == 2){
            countSql.push("SELECT cast(count(*)/8 as decimal(10,0)) as Count from travelorderdb.tab_travelorder travelorder where travelorder.GuideID = "+item.userID);
            sql.push("select 1 as usertype,travelorder.orderNo,travelorder.OrderID as orderid,travelorder.ServiceTripID,travelorder.CloseReason,travelorder.ServiceTripName,travelorder.UserID as userid,userinfo.UserName as username,travelorder.Status as status,\n" +
            "                           userservice.ServiceName as servicename,userservice.PrimaryPrice as money,ServiceTripTypeID, ServiceTripTypeName,IF(travelorder.OrderType=1,pict.PicURL,plan.picurl) as picurl,\n" +
            "                           userservice.Unit as unit,DATE_FORMAT(travelorder.StartTime, '%Y/%m/%d') AS starttime,DATE_FORMAT(travelorder.EndTime, '%Y/%m/%d') AS endtime,travelorder.CostMoney as costmoney,travelorder.realCostMoney,travelorder.TravelDays as traveldays,\n" +
            "                           travelorder.IfEvaluate as ifevaluate,travelorder.IfReply as ifreply,userinfo.AvatarPicURL\n" +
            "                           from travelorderdb.tab_travelorder travelorder left join traveldb.tab_userinfo userinfo on travelorder.UserID = userinfo.UserID\n" +
            "                                                            left join traveluserdb.tab_services userservice on travelorder.ServiceTripID=IF(travelorder.OrderType=1,userservice.ServiceID,-1)\n" +
            "                                                            left join traveluserdb.tab_facilitypictures pict " +
            "                                                                 on (IF(travelorder.OrderType=1,userservice.ServiceID,-1)=pict.PictureID AND pict.PicType=1 AND pict.IsCover=1)\n" +
            "                                                            left join traveluserdb.tab_planinfo plan on(travelorder.ServiceTripID=IF(travelorder.OrderType=2,plan.PlanID,-1)) " +
            "                            where travelorder.GuideID = "+item.userID);
		}

        if (0 != item.status) {

            //前端接口的4:已完成，已关闭
            if (3 == item.status) {
                sql.push(" and travelorder.status in (4,3)");
            } else {
                sql.push(" and travelorder.status = " + item.status);
            }
        }
        sql.push(" order by travelorder.UpdateTime desc");

        if(0!=item.page) {

        	var start = (item.page-1)*20;

            sql.push(" limit "+start+",  20 ");
        }

        datas = {};
        exec(connection, sql.join(""), [,], function(err, results){

			if (err){
                callback(err,results);
			}
            datas["datas"]=results;
            callback(err,remJson(datas));

        });

        // exec(connection, countSql.join(""), [,], function(err2, results2){
        //     if (err2){
        //         callback(err2,results2);
        //     }
        //     datas.set("Counts",results2)
        //     callback(err2,remJson(datas));
        //
        // });

		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};

exports.getAddorderDetail = function (item, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }

        //ordertype = 2
        if (item.ordertype == 2) {
            sql = "SELECT plan.PlanID AS ServiceTripID, plan.PlanName AS ServiceTripName, plan.PlanType AS ServiceTripTypeID, " +
                "IF ( plan.PlanType = 1, '经典', IF ( plan.PlanType = 2, '特色', '私人' ) ) AS ServiceTripTypeName, " +
                "place.ParentID AS CountryID, plan.StartCityID AS cityID, plan.StartCity AS CityNameCn, 2 AS OrderType " +
                "FROM traveluserdb.tab_planinfo plan LEFT JOIN traveluserdb.tab_planschedule plansch " +
                "ON ( plansch.PlanID = plan.PlanID AND plansch.DayName = 'D1' ) " +
                "LEFT JOIN traveldb.tab_travelregion place ON ( place.RegionID = plan.StartCityID ) " +
                "WHERE plan.PlanID = " + item.planID;
            useersql = "SELECT DISTINCT pl.UserID, useri.AvatarPicURL, useri.`Identified`, useri.Labels, pl.PlanID " +
                "FROM traveluserdb.tab_userplan pl LEFT JOIN traveldb.tab_userinfo useri ON " +
                "( useri.UserID = pl.UserID AND useri.`Identified` = 1 ) WHERE PlanID =" + item.planID;

            schedulerssql = "select DATE_FORMAT(ScheduleDate,'%Y-%m-%d')  from tab_travelorderschedule " +
                "where GuideID=? and ScheduleDate>=NOW() and Status in('0','2')";
        }

        var userList;
        var addDetail;
        exec(connection, sql.join(""), [,], function (err, results) {

            if (err) {
                callback(err, results);
            }

            addDetail = {"addDetail": results};

            if (null != useersql && typeof(useersql) != "undefined") {
                exec(connection, useersql.join(""), [,], function (err, usrlist) {
                    if (err) {
                        callback(false, remJson(addDetail));
                    }

                    if (null != schedulerssql && typeof(schedulerssql) != "undefined") {
                        for (i=0;i<usrlist.length;i++) {

                            exec(connection, schedulerssql.join(""), [usrlist[i]["UserID"]], function (err, schedulars) {
                                if (err) {
                                    addDetail["userList"] = usrlist;
                                    callback(false, remJson(addDetail));
                                }
                                usrlist[i]["userSchedules"] = schedulars;

                                if(i == usrlist.length-1){
                                    addDetail["userList"] = usrlist;
                                    callback(false, remJson(addDetail));
								}

                            });
                        }
                    }


                });
            }


        });


        //console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
    });
};

exports.getVW_PlansByContinent = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "SELECT * FROM traveluserdb.`vw_/home_plansbycontinent` WHERE Continent is not null and trim(Continent) <> ' ';";
		exec(connection, sql, [item.continent], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.getVW_PlansByCountry = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "SELECT * FROM traveluserdb.`vw_/home_plansbycountry` WHERE Country is not null and trim(Country) <> ' ';";
		exec(connection, sql, [item.continent], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.getVW_PlansByLabel = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "SELECT * FROM traveluserdb.`vw_/home_plansbylabel` WHERE Label is not null and trim(Label) <> ' ';";
		exec(connection, sql, [item.continent], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.getVW_CountryByContinent = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "SELECT * FROM traveluserdb.`vw_/home_countrybycontinent` WHERE Country is not null and trim(Country) <> ' ';";
		exec(connection, sql, [item.continent], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.getPlansByContinent = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "SELECT a.*, b.ParentID, c.Continent, c.RegionCnName, c.RegionEnName, c.ShortCnName FROM traveluserdb.tab_planinfo a left join traveldb.tab_travelregion b on  a.StartCityID = b.RegionID and b.IfLeaf = 1 left join traveldb.tab_travelregion c on b.ParentID = c.RegionID where  c.Continent = ? limit 0, 10;";
		exec(connection, sql, [item.continent], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.getPlanDetail = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "select PlanID,PlanName,PlanPriceBase,PicURL,ScheduleID,ScheduleType,AirportNameCN,AirportCode,SpotName,SpotPicUrl,PicURL, SequenceID,PlanNumber,Policy,CostInclude,CostExclude,VisaNotice,Notice,CreateUserID  from traveluserdb.vw_plandetail where PlanID = ?;";
		exec(connection, sql, [item.PlanID], callback);
		console.log(sql + ' ' + item);
	});
};
exports.getAdvs = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "SELECT * FROM traveldb.tab_advertise;";
		exec(connection, sql, [], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.getRecommendPlan = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "";
		if(item.PlanName && item.PlanName.length > 0){
			sql = "SELECT * FROM traveluserdb.tab_planinfo WHERE PlanName like '%"+item.PlanName+"%';";
		}else {
			sql = "SELECT * FROM traveluserdb.tab_planinfo ORDER BY Weight DESC LIMIT 0, 5;";
		}
		exec(connection, sql, [], callback);
		console.log(sql );
	});
};
exports.updateRecommendPlan = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "UPDATE traveluserdb.tab_planinfo SET Weight = ? WHERE PlanID = ?; ";
		exec(connection, sql, [item.Weight, item.PlanID], callback);
		console.log(sql + ' ' + [item.Weight, item.PlanID]);
	});
};
exports.getStories = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "";
		if(item.Title && item.Title.length > 0){
			sql = "SELECT * FROM traveluserdb.tab_travelarticle WHERE Title like '%"+item.Title+"%';";
		}else if(item.Description && item.Description.length > 0){
			sql = "SELECT * FROM traveluserdb.tab_travelarticle WHERE Description like '%"+item.Description+"%';";
		}else {
			sql = "SELECT * FROM traveluserdb.tab_travelarticle;";
		}
		exec(connection, sql, [], callback);
		console.log(sql );
	});
};
exports.deleteStory = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql1 = "DELETE FROM traveluserdb.tab_travelarticle WHERE ArticleID = ?; ";
		execfinal(connection, sql1, [item.ArticleID], callback);
		var sql2 = "DELETE FROM traveluserdb.tab_travelarticledetail WHERE ArticleID = ?; ";
		exec(connection, sql2, [item.ArticleID], callback);
		console.log(sql1 + ' ' + [item.ArticleID]);
	});
};
exports.getPlanServices = function(type, callback) {
	var opt = {
		classic:{sql:"SELECT TO_DAYS(NOW()) - TO_DAYS(CreateDate) as daydiff, d.userid, d.username, d.areacode, d.usermobile, a.PlanID as ID,a.PlanStatus as Status, a.* FROM traveluserdb.tab_planinfo a LEFT JOIN traveldb.tab_userinfo d ON a.createuserid = d.userid WHERE PlanType = 1 order by createdate desc"}, 
		special:{sql:"SELECT TO_DAYS(NOW()) - TO_DAYS(CreateDate) as daydiff, d.userid, d.username, d.areacode, d.usermobile, a.PlanID as ID,a.PlanStatus as Status, a.* FROM traveluserdb.tab_planinfo a LEFT JOIN traveldb.tab_userinfo d ON a.createuserid = d.userid WHERE PlanType = 2 order by createdate desc"}, 
		withcar:{sql:"SELECT TO_DAYS(NOW()) - TO_DAYS(CreateDate) as daydiff, d.userid, d.username, d.areacode, d.usermobile,  c.* FROM (SELECT a.ServiceID as ID,a.ServiceStatus as Status, a.*, b.TypeName FROM traveluserdb.tab_services a LEFT JOIN traveluserdb.tab_servicetype b  ON a.ServiceTypeID = b.ServiceTypeID WHERE b.ServiceTypeID = 1) c LEFT JOIN traveldb.tab_userinfo d ON c.UserID = d.UserID order by createdate desc"}, 
		withoutcar:{sql:"SELECT TO_DAYS(NOW()) - TO_DAYS(CreateDate) as daydiff, d.userid, d.username, d.areacode, d.usermobile,  c.* FROM (SELECT a.ServiceID as ID,a.ServiceStatus as Status, a.*, b.TypeName FROM traveluserdb.tab_services a LEFT JOIN traveluserdb.tab_servicetype b  ON a.ServiceTypeID = b.ServiceTypeID WHERE b.ServiceTypeID = 2) c LEFT JOIN traveldb.tab_userinfo d ON c.UserID = d.UserID order by createdate desc"}, 
		pickwithcar:{sql:"SELECT TO_DAYS(NOW()) - TO_DAYS(CreateDate) as daydiff, d.userid, d.username, d.areacode, d.usermobile, c.* FROM (SELECT a.ServiceID as ID,a.ServiceStatus as Status, a.*, b.TypeName FROM traveluserdb.tab_services a LEFT JOIN traveluserdb.tab_servicetype b  ON a.ServiceTypeID = b.ServiceTypeID WHERE b.ServiceTypeID = 3) c LEFT JOIN traveldb.tab_userinfo d ON c.UserID = d.UserID order by createdate desc"}, 
		dropwithcar:{sql:"SELECT TO_DAYS(NOW()) - TO_DAYS(CreateDate) as daydiff, c.*, d.userid, d.username, d.areacode, d.usermobile  FROM (SELECT a.ServiceID as ID,a.ServiceStatus as Status, a.*, b.TypeName FROM traveluserdb.tab_services a LEFT JOIN traveluserdb.tab_servicetype b  ON a.ServiceTypeID = b.ServiceTypeID WHERE b.ServiceTypeID = 4) c LEFT JOIN traveldb.tab_userinfo d ON c.UserID = d.UserID order by createdate desc"}, 
		other:{sql:"SELECT TO_DAYS(NOW()) - TO_DAYS(CreateDate) as daydiff, c.*, d.userid, d.username, d.areacode, d.usermobile FROM (SELECT a.ServiceID as ID,a.ServiceStatus as Status, a.*, b.TypeName FROM traveluserdb.tab_services a LEFT JOIN traveluserdb.tab_servicetype b  ON a.ServiceTypeID = b.ServiceTypeID WHERE b.ServiceTypeID not in(1,2,3,4)) c LEFT JOIN traveldb.tab_userinfo d ON c.UserID = d.UserID order by createdate desc"}};
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		console.log("-----------  "+type);
		console.log(opt[type].sql);
		exec(connection, opt[type].sql, [], callback);
	});
};
exports.enablePlanService = function(type, id, enable, callback) {
	var s1 = "UPDATE traveluserdb.tab_planinfo SET PlanStatus = ? WHERE PlanID=?";
	var s2 = "UPDATE traveluserdb.tab_services SET ServiceStatus = ? WHERE ServiceID=?";
	var opt = {
		classic:{sql:s1, ex:true}, 
		special:{sql:s1, ex:true}, 
		withcar:{sql:s2}, 
		withoutcar:{sql:s2}, 
		pickwithcar:{sql:s2}, 
		dropwithcar:{sql:s2}, 
		other:{sql:s2}};
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		/*if(type=='classic'&&enable==4) {
			//var s3 = "INSERT INTO traveluserdb.tab_userplan(UserID, PlanID)VALUES(?, ?)";
			var s4 = "UPDATE traveluserdb.tab_planinfo SET PlanStaus = 3 WHERE PlanID=?";
			console.log(s3 + ' '+type+ ' '+id +' '+enable);
			//execfinal(connection, s3, [10067, id]);
			execfinal(connection, s4, []);
		}else if(type=='special'&&enable==3) {
			//var s3 = "DELETE FROM traveluserdb.tab_userplan WHERE UserID=10067 AND PlanID = ?";
			var s4 = "UPDATE traveluserdb.tab_planinfo SET PlanStaus = 4 WHERE PlanID=?";
			console.log(s3 + ' '+type+ ' '+id +' '+enable);
			//execfinal(connection, s3, [id]);
			execfinal(connection, s4, []);
		}*/
		exec(connection, opt[type].sql, [enable, id], callback);
		console.log(opt[type].sql + ' '+type+ ' '+id +' '+enable);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};

exports.getALFs = function(type, no, key, country, city, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var offset = 25;
		var start = no*offset;
		var sql = "SELECT a.SpotsID as id, b.RegionCnName as Country, c.RegionCnName as City, a.* FROM traveldb.tab_travelspots as a LEFT JOIN traveldb.tab_travelregion as b ON a.CountryID=b.RegionID LEFT JOIN traveldb.tab_travelregion as c ON a.CityID=c.RegionID WHERE a.SpotsTypeID = ? order by a.SpotsID desc LIMIT ?, ? ; ";
		if (key) {
			sql = "SELECT a.SpotsID as id, b.RegionCnName as Country, c.RegionCnName as City, a.* FROM traveldb.tab_travelspots as a LEFT JOIN traveldb.tab_travelregion as b ON a.CountryID=b.RegionID LEFT JOIN traveldb.tab_travelregion as c ON a.CityID=c.RegionID WHERE a.SpotsTypeID = ? AND a.NameCh LIKE '%"+key+"%'  order by a.SpotsID ; ";
			exec(connection, sql, [type, key], callback);
			console.log(sql);
			console.log(""+[type, key])
		}
		else if (country) {
			sql = "SELECT  a.SpotsID as id, b.RegionCnName as Country, c.RegionCnName as City, a.* FROM traveldb.tab_travelspots as a LEFT JOIN traveldb.tab_travelregion as b ON a.CountryID=b.RegionID LEFT JOIN traveldb.tab_travelregion as c ON a.CityID=c.RegionID WHERE a.SpotsTypeID = ? AND b.RegionCnName LIKE '%"+country+"%'  order by a.SpotsID ; ";
			exec(connection, sql, [type, country], callback);
			console.log(sql);
			console.log(""+[type, country])
		}
		else if (city) {
			sql = "SELECT a.SpotsID as id, b.RegionCnName as Country, c.RegionCnName as City, a.* FROM traveldb.tab_travelspots as a LEFT JOIN traveldb.tab_travelregion as b ON a.CountryID=b.RegionID LEFT JOIN traveldb.tab_travelregion as c ON a.CityID=c.RegionID WHERE a.SpotsTypeID = ? AND c.RegionCnName LIKE '%"+city+"%'  order by a.SpotsID ; ";
			exec(connection, sql, [type, city], callback);
			console.log(sql);
			console.log(""+[type, city])
		}
		else {
			exec(connection, sql, [type, start, offset], callback);
			console.log(sql);
			console.log(""+[type, start, offset])
		}
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.getPhoto = function(id, no, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var offset = 25;
		var start = no*offset;
		var sql = "SELECT * FROM traveldb.tab_travelspotsdetail WHERE SpotsID = ? LIMIT ?, ? ; ";
		exec(connection, sql, [id, start, offset], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.getPhotoMaster = function(id, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "SELECT * FROM traveldb.tab_travelspots WHERE SpotsID = ?; ";
		exec(connection, sql, [id], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.insertPhoto = function(id, url, sum, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "INSERT INTO traveldb.tab_travelspotsdetail(SpotsID, PicURL, Summary, CreateDate, UpdateDate) VALUES(?,?,?,NOW(),NOW()); ";
		exec(connection, sql, [id, url, sum], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.updatePhoto = function(id, url, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "UPDATE traveldb.tab_travelspotsdetail SET PicURL = ?, UpdateDate = NOW() WHERE SpotsDetailID = ?; ";
		exec(connection, sql, [url,id], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.updatePhotoTitle = function(id, intro, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "UPDATE traveldb.tab_travelspotsdetail SET Summary = ?, UpdateDate = NOW() WHERE SpotsDetailID = ?; ";
		exec(connection, sql, [intro,id], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.removePhoto = function(id, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "DELETE FROM traveldb.tab_travelspotsdetail WHERE  SpotsDetailID = ?; ";
		exec(connection, sql, [id], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.enablePhoto = function(id, url, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "UPDATE traveldb.tab_travelspots SET PicURL = ? WHERE SpotsID = ?; ";
		exec(connection, sql, [url, id], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.getALF = function(id, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "SELECT a.*, b.RegionCnName as country, c.RegionCnName as city FROM traveldb.tab_travelspots as a LEFT JOIN  traveldb.tab_travelregion as b ON a.CountryID=b.RegionID LEFT JOIN traveldb.tab_travelregion as c ON a.CityID=c.RegionID  WHERE SpotsID = ?; ";
		exec(connection, sql, [id], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.getCountry = function(callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "SELECT * FROM traveldb.tab_travelregion WHERE IfLeaf = 0 ORDER BY Sequence DESC, CONVERT(RegionCnName USING gbk) ASC; ";
		exec(connection, sql, [], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.getLabel = function(id, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		//var sql = "SELECT a.*,  FROM traveldb.tab_classifylabel a LEFT JOIN  traveldb.tab_travelspotslabel b ON a.SpotsLabelID=b.SpotsLabelID ; ";
		var sql = "SELECT *,   exists(select 1 from traveldb.tab_travelspotslabel a where a.SpotsID=? and a.ClassifyLabelID=b.ClassifyLabelID ) Selected   FROM traveldb.tab_classifylabel b ORDER BY TypeId;";
		exec(connection, sql, [id], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};

exports.getCityByCountry = function(id, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "SELECT * FROM traveldb.tab_travelregion WHERE IfLeaf = 1 and ParentID=? ORDER BY Sequence DESC, CONVERT(RegionCnName USING gbk) ASC; ";
		exec(connection, sql, [id], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
exports.getCity = function(callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "SELECT * FROM traveldb.tab_travelregion WHERE IfLeaf = 1 ORDER BY Sequence DESC, CONVERT(RegionCnName USING gbk) ASC; ";
		exec(connection, sql, [], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};

exports.enableALF = function(status, type, id, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "UPDATE traveldb.tab_travelspots SET Status = ? WHERE SpotsTypeID = ? AND SpotsID = ?; ";
		exec(connection, sql, [status, type, id], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};

exports.removeALF = function(type, id, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "DELETE FROM traveldb.tab_travelspots WHERE SpotsTypeID = ? AND SpotsID = ?; ";
		exec(connection, sql, [type, id], callback);
		//console.log(sql + ' ' + type + ' ' +id  );
	});
};

exports.editGeographic = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "UPDATE traveldb.tab_travelregion SET ShortCnName = ?, Sequence = ?, UPdateTime = NOW() WHERE RegionID = ?;";
		var it = [];
		for(var i in item) {
			it.push([item[i].ShortCnName, item[i].Sequence, item[i].RegionID]);
		};
		for(var i in it) {
			console.log(sql+' '+it[i]);
			execfinal(connection, sql, it[i], null, false);
		}
		var sql2 = "update traveldb.tab_regionchange set regionkey = regionkey+1;";
		execfinal(connection, sql2, []);
		exec(connection, sql, it[0], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};

exports.addCity = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "INSERT INTO traveldb.tab_travelregion (ShortCnName, RegionCnName, ParentID,CreateTime, UpdateTime, IfLeaf) VALUES(?, ?, ?, NOW(),NOW(), 1);";
		var it = [item.ShortCnName, item.RegionCnName, item.ParentID];
		var sql2 = "update traveldb.tab_regionchange set regionkey = regionkey+1;";
		execfinal(connection, sql2, []);
		exec(connection, sql, it, callback);
		//console.log(sql + ' ' + item.ShortCnName + ' ' +item.RegionCnName +" search:"+item.ParentID);
	});
};

exports.delCity = function(id, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "DELETE FROM traveldb.tab_travelregion WHERE RegionID = ?;";
		var it = [id];
		var sql2 = "update traveldb.tab_regionchange set regionkey = regionkey+1;";
		execfinal(connection, sql2, []);
		exec(connection, sql, it, callback);
		console.log(sql + ' ' + id );
	});
};

exports.updateCity = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "UPDATE traveldb.tab_travelregion SET RegionCnName = ?, ShortCnName = ? WHERE RegionID = ?;";
		var it = [ item.RegionCnName, item.ShortCnName, item.RegionID];
		exec(connection, sql, it, callback);
		console.log(sql + ' ' + JSON.stringify(item) );
	});
};

exports.privileges = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		//var sql = "UPDATE traveldb.tab_travelspots SET CountryID = ?, CityID = ?, SpotsTypeID = ?, CommondReason = ?, NameEn = ?, NameCh = ?, UpdateDate = NOW() WHERE SpotsID = ?; ";
		var sql = "SELECT * FROM traveldb.usr_privileges;";
		console.log(sql);
		var it = [];
		exec(connection, sql, it, callback);
	});
};
exports.uprivileges = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		//var id = res.insertId;
		//console.log(''+res+'  '+id);
		var values = [];
		for(var i in item) {
			//var pwd = crypto.createHash('md5').update(item[i].pwd).digest('hex');
			values.push([item[i].name, item[i].pwd, JSON.stringify(item[i].privileges)]);
		}
		
		var del = "DELETE FROM traveldb.usr_privileges";
		var add = "INSERT INTO traveldb.usr_privileges(name,pwd,privileges)VALUES ?;"
		console.log(JSON.stringify(values));
		execfinal(connection, del, []);
		//console.log('add tab_travelspotslabel '+values[0]);
		exec(connection, add, [values], callback);
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};

exports.editALF = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		//var sql = "UPDATE traveldb.tab_travelspots SET CountryID = ?, CityID = ?, SpotsTypeID = ?, CommondReason = ?, NameEn = ?, NameCh = ?, UpdateDate = NOW() WHERE SpotsID = ?; ";
		var sql = "UPDATE traveldb.tab_travelspots SET CountryID = ?, CityID = ?, SpotsTypeID = ?, CommondReason = ?, NameEn = ?, NameCh = ?, Address = ?, ZipCode = ?, Description = ?, CommondReason = ?, Tel = ?, UpdateDate = NOW(), Rank = ?, Price = ?, Score = ? WHERE SpotsID = ?;";
		var it = [	item.CountryID    ,
					item.CityID       ,
					item.SpotsTypeID  ,
					item.CommondReason,
					item.NameEn       ,
					item.NameCh       ,
					item.Address,
					item.ZipCode,
					item.Description,
					item.CommondReason,
					item.Tel,
					item.Rank,
					item.Price,
					item.Score,
					item.SpotsID,
					];
		var del = "DELETE FROM traveldb.tab_travelspotslabel WHERE SpotsID="+item.SpotsID;
		var add = "INSERT INTO traveldb.tab_travelspotslabel(ClassifyLabelID,SpotsID,UpdateTime)VALUES ?;"
		var values = [];
		for(var i in item.ClassifyLabelID) {
			values.push([item.ClassifyLabelID[i],item.SpotsID,(new Date().toISOString().slice(0, 19).replace('T', ' '))]);
		}
		//console.log('add tab_travelspotslabel '+values[0]);
		
		execfinal(connection, del, []);
		
		execfinal(connection, add, [values]);
		
		exec(connection, sql, it, callback);
		console.log(it.toString());
	});
};

exports.insertALF = function(item, callback) {
	pool.getConnection(function(err, connection) {
		if(err) { 
			console.log(err); 
			callback(true); 
			return;
		}
		var sql = "INSERT INTO traveldb.tab_travelspots(CountryID, CityID, SpotsTypeID, CommondReason, NameEn, NameCh, Address, ZipCode, Description, Tel, UserID, Status, UpdateDate, CreateDate) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,NOW(), NOW()); ";
		
		var it = [	item.CountryID    ,
					item.CityID       ,
					item.SpotsTypeID  ,
					item.CommondReason,
					item.NameEn       ,
					item.NameCh       ,
					item.Address,
					item.ZipCode,
					item.Description,
					item.Tel,
					item.UserID,
					item.Status,
					(new Date().toISOString().slice(0, 19).replace('T', ' ')),
					(new Date().toISOString().slice(0, 19).replace('T', ' '))];
		
		console.log(sql);
		console.log(it);
		execfinal(connection, sql, it, function(err, res){
			var id = res.insertId;
			//console.log(''+res+'  '+id);
			var del = "DELETE FROM traveldb.tab_travelspotslabel WHERE SpotsID="+id;
			var add = "INSERT INTO traveldb.tab_travelspotslabel(ClassifyLabelID,SpotsID,UpdateTime)VALUES ?;"
			var values = [];
			for(var i in item.ClassifyLabelID) {
				values.push([item.ClassifyLabelID[i], id,(new Date().toISOString().slice(0, 19).replace('T', ' '))]);
			}
			//console.log('del tab_travelspotslabel ');
			execfinal(connection, del, []);
			//console.log('add tab_travelspotslabel '+values[0]);
			execfinal(connection, add, [values], null, true);
			callback();
		});
		//console.log(sql + ' ' + start + ' ' +offset +" search:"+search+ ' type:"+type);
	});
};
