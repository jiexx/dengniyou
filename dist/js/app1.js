(function () {
	function frameCtrl() {
        if( !$.trim( $('#footer').html() ) ) {
            $('#footer').rogerReloadFile('./footer.html');
        }
        if( !$.trim( $('#modal').html() ) ) {
            $('#modal').rogerReloadFile('./fragment/dialog-login.html');
        }
        if($.rogerIsLogined()) {
            $('#userlogin').html('').append('<span class="btn btn-link btn-xs register" id="usrlogout">注销</span>');
            $('#usrlogout').click(function () {
                $.rogerLogout();
                $.rogerRefresh();
            });
            $.rogerHideLogin();
        }else {
            $('#userlogin').html('').append('<span class="btn btn-link btn-xs register" id="usrlogin" data-toggle="modal" data-target="#homeLogin">登录</span>');
            $('#usrlogin').click(function () {
                $.rogerLogin('#homeLogin', '/login'/*, '/dashboard.html'*/);
                //$.rogerShowLogin();
            })
        }
        $('#usercenter').rogerOnceClick(null, function () {
            var user = $.rogerGetLoginUser();
            if(!user) {
                $.rogerShowLogin();
                return;
            }

            $.rogerLocation('#/orderlist?userID='+user.UserID+'&usertype=1&status=0&page=1');
        });
    }

    var initHomeList = function (param) {
        return {
            Title: "Meet Joe Black",
            Languages: [
                { Name: "English" },
                { Name: "French" }
            ]
        },
        {
            Title: "Eyes Wide Shut",
            Languages: [
                { Name: "French" },
                { Name: "German" },
                { Name: "Spanish" }
            ]
        };
    };
    var ctrlHomeList = function(response, realView) {

         var i = 0;

    };
	
	var ctrlHome = function(response, realView) {
		$('#carousel-generic').carousel();
        $('#homeSearch').rogerOnceClick(null, function () {
            var k = $('#homeSearchKey').val();
            $.rogerLocation('#/search?key='+k);
        });

        var item = $.tmplItem($('.carousel-caption'));
        console.log(item); 
    
        $('.nav-buttons .theme').on('click','li',function(){
          var text = $(this).text();
          $(this).parent().prev().text(text);
          var changeData = item.data.PlansByLabel[text].__values;
          console.log(changeData);
          
        });
        $('.nav-buttons .country').on('click','li',function(){
          var text = $(this).text();
          $(this).parent().prev().text(text);
          var changeData = item.data.PlansByCountry[text].__values;
          console.log(changeData);
          
        });

        $.rogerTrigger('#movieList', '#/homelist', {Plan:1});
		
		realView.rogerCropImages();
        frameCtrl();
    };
    var ctrlHomeSearch = function(response, realView) {


        realView.rogerCropImages();
        frameCtrl();
    };

	var initComment = function(params) {
		return {
			Comment:{
				PlanID: params.PlanID,
				Comment: '',
				Picture:{Pics:[]}
			}
		};
	};
	var ctrlComment = function(Comment, realView) {
        frameCtrl();
		$('.commit').rogerOnceClick(Comment, function(e){
			var user = $.rogerGetLoginUser()
			if(!user) {
				$.rogerShowLogin();
				return;
			}
			var usr =$.rogerGetLoginUser();
			e.data.Comment.UserID = usr.UserID;
			//console.log(usr);
			$.rogerPost('/comment/plan', e.data, function(respJSON){
				$.rogerRefresh();
			});
		});
	};
    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };
	var ctrlPlandetail = function(response, realView) {
        $('#carousel-generic').carousel();

        var disday = [];
        if(response.PlanCalender.length > 0 && response.PlanCalender[0].Calender) {
            var arr = response.PlanCalender[0].Calender.split(',');
            arr = arr.filter( function( item, index, inputArray ) {
                return inputArray.indexOf(item) == index;
            });
            for(var i in arr) {
                var a = arr[i].split(';');
                if(a.length == 2) {
                    disday.push({from: a[0], to: a[1]})
                }
            }
        }
        var pickr = $("#calendar").flatpickr({
            inline: true,
            "mode": "multiple",
            disable: disday
		});

		realView.rogerCropImages();
        frameCtrl();

        if( response.PlanInfo[0].Policy ){
            $('#policy').html(response.PlanInfo[0].Policy.replace(/\r\n/g, '<br>'));
        }
		$.rogerTrigger('#plan-comment','#/comment',{PlanID:response.PlanInfo[0].PlanID});

        $('#TALK').each(function () {
            var usr = $.rogerGetLoginUser();
            if(!usr) {
                $.rogerLogin('#homeLogin', '/login');
                $.rogerShowLogin();
                return;
            }
            $(this).attr("href","talk?uid="
                +usr.UserID+'&uname='+usr.UserName+'&picurl='+response.IMGHOST+usr.AvatarPicURL+'&tid='+response.PlanInfo[0].UserID);
        });
		
		/*$('#BUY').rogerOnceClick(response.PlanInfo[0].PlanID, function (e) {
			$.rogerPost('/pay',{PlanID:e.data}, function (respJSON) {
				console.log(respJSON);
                window.open(respJSON.url, '_blank');
            })
        })*/

	};
    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };
    function checkDayInDisable(day, len, disable) {
        var begin = new Date(day);
        var end = addDays(day, len-1);
        for(var i in disable) {
            var start = new Date(disable[i].from);
            var close = new Date(disable[i].to);
            if((begin >= start && end <= close) || (begin >= start && begin <= close) || (end >= start && end <= close)){
                return true;
            }
        }
        return false;
    };
    var ctrlPlanpay1 = function(response, realView) {
    	var days = parseInt(response.PlanInfo[0].PlanDays);
        var dates = [];
        var disday = [];
        if(response.PlanCalender.length > 0 && response.PlanCalender[0].Calender) {
            var arr = response.PlanCalender[0].Calender.split(',');
            arr = arr.filter( function( item, index, inputArray ) {
                return inputArray.indexOf(item) == index;
            });
            for(var i in arr) {
                var a = arr[i].split(';');
                if(a.length == 2) {
                    disday.push({from: a[0], to: a[1]});
                }
            }
        }
        var pickr = $("#calendar").flatpickr({
            inline: true,
            disable: disday,
            onChange:function (dateObj, dateStr) {
                if(checkDayInDisable(dateStr, days, disday)) {
                    pickr.selectedDates.splice(0,pickr.selectedDates.length);
                    pickr.redraw();
                    return;
                }
            	for(var i = 1 ; i < days ; i++) {
                    pickr.selectedDates.push(addDays(dateStr, i));
				}
                pickr.redraw();
            	for(var i  in pickr.selectedDates) {
            	    var d = pickr.selectedDates[i]
            	    dates[i] =  d.getUTCFullYear() +'-'+(d.getUTCMonth() + 1)+'-'+ d.getUTCDate();
                }
            }
        });
        //pickr.selectedDates.push('');
        realView.rogerCropImages();
        frameCtrl();

        var adult = parseInt($('#adult option:selected').val());
        var kid = parseInt($('#kid option:selected').val());
        var adultprice = parseFloat(response.PlanInfo[0].AdultPrice);
        var kidprice = parseFloat(response.PlanInfo[0].KidPrice);
        var cash = adult*adultprice+kid*kidprice;
        $('.price').each(function () {
			$(this).html(''+cash);
        })

        var ev = $._data($('#adult'), 'events');
        if(!ev || !ev.change) {
            $('#adult').on("change", function () {
                adult = parseInt($('#adult option:selected').val());
                $('.price').each(function () {
                    cash = adult*adultprice+kid*kidprice
                    $(this).html(''+cash);
                })
            });
        }
        var ev = $._data($('#kid'), 'events');
        if(!ev || !ev.change) {
            $('#kid').on("change", function () {
                kid = parseInt($('#kid option:selected').val());
                $('.price').each(function () {
                    cash = adult*adultprice+kid*kidprice
                    $(this).html(''+cash);
                })
            });
        }
        if( response.PlanInfo[0].Policy ){
            $('#policy').html(response.PlanInfo[0].Policy.replace(/\r\n/g, '<br>'));
        }

        $('#BUY').rogerOnceClick(null,function (e) {
            var usr = $.rogerGetLoginUser();
            if(!usr) {
                $.rogerLogin('#homeLogin', '/login');
            	$.rogerShowLogin();
            	return;
			}
        	var buy = {visitid:usr.UserID,
                servicetripid:response.PlanInfo[0].PlanID,
				servicetripname:response.PlanInfo[0].PlanName,
                servicetriptypeid:response.PlanInfo[0].PlanType,
                username:usr.UserName,
                guideid:response.PlanInfo[0].UserID,
                costmoney: cash,
                realcostmoney: cash,
                traveldays: response.PlanInfo[0].PlanDays,
                remarks: $('#note').val(),
                countryid:response.PlanInfo[0].CountryID,
                cityid:response.PlanInfo[0].StartCityID,
                ordertype:2,
                orderdetails: [{
                    schedules: dates,
                    personnum: adult,
                    adultNum: adult,
                    kidNum: kid,
                    fullname: $('#username').val(),
                    mobilephone: $('#phone').val(),
                    email: $('#mail').val()
                }]
			};
            
            $('#app').rogerReloadFile('./plandetail-pay-2.html', function (realView) {
                var price = realView.find('#totalprice');
                price.html(''+cash);

                var ok = realView.find('#OK');
                ok.rogerOnceClick(null,function () {
                     var newWin = window.open('about:blank');
                    $.rogerPost('/pay',buy, function (respJSON) {

                        if( respJSON.ERR) {
                            $.rogerNotice({Message:'生成订单有错,错误码:'+respJSON.ERR});
                            newWin.close();
                        }else {
                            newWin.location.href = respJSON.url;
                            //window.open(respJSON.url, '_blank');
                            /*var parms = $.rogerGetJsonUrlParams(respJSON.url);
                            for(var i in parms) {
                                $('<input>').attr({
                                    type: 'hidden',
                                    name: i,
                                    value: parms[i]
                                }).appendTo('#Alipay');
                            }
                            $('#Alipay').attr('action', parms.link);
                            $('#Alipay').submit();*/
                        }
                    })
                })
            });
        })

    };

    var ctrlOrderlist = function (response, realView) {

        $("#order-a_all").find("a").each(function () {
            var el = $(this);

            el.rogerOnceClick(null, function () {
                var user = $.rogerGetLoginUser();
                if(!user) {
                    $.rogerShowLogin();
                    return;
                }
                data_href = el.attr("data-value");
                $.rogerLocation(data_href+'&userID='+user.UserID);
            });

        });


        frameCtrl();
        $('#confirm').rogerOnceClick(null, function () {
            var orderid = $('#confirm').data('id');
            var status = $('#confirm').data('status');
            var user = $.rogerGetLoginUser();
            if ('1' == status) {
                var newWin = window.open('about:blank');
                $.rogerPost('/pay', buy, function (respJSON) {
                    if (respJSON.ERR) {
                        $.rogerNotice({Message: '生成订单有错,错误码:' + respJSON.ERR});
                        newWin.close();
                    } else {
                        newWin.location.href = respJSON.url;
                    }
                })
            }
            if ('4' == status) {

                $.rogerPost('http://123.59.144.44/travel/order/confirmFinish', {
                    orderID: orderid,
                }, function () {
                    $.rogerRefresh();
                });
            }
        });

        realView.rogerCropImages();
    };

    var ctrlOrderdetail = function(response, realView) {

        // console.log(JSON.stringify(response));
        realView.rogerCropImages();
        frameCtrl();

        $('#complain-commit').rogerOnceClick(null, function () {
            var Reason = $('#Reason').val();
            var ApplyRefund = $('#ApplyRefund').val();
            var RefundDec = $('#RefundDec').val();
            var OrderID = response.OrderDetail[0].OrderID

            var user = $.rogerGetLoginUser();
            complaintdetail = {"Reason":Reason,"ApplyRefund":ApplyRefund,"UserID":user.UserID,"OrderID":OrderID};
            $.rogerPost('/new/ordercomplaint', complaintdetail, function (respJSON) {
                if (respJSON.ERR) {
                    $.rogerNotice({Message: '投诉提交失败:' + respJSON.ERR});
                } else {
                    window.location.reload();
                }
            });

        });
    };

    var ctrlPlanSearch = function(response, realView) {
        realView.rogerCropImages();
        frameCtrl();
    };
    var ctrlUserInfo = function(response, realView) {
        realView.rogerCropImages();
        frameCtrl();
    };

    //-------------------------------plan customize begin---------------------------------
    var initTemplateplanNew = function(params){
        var usr =$.rogerGetLoginUser();
        var type = $.rogerGetUrlParam('type');
        return {
            PlanInfo:{
                PlanName:'', PlanType: type, PlanPriceBase:0,PicURL:[],CarURL:[],PlanDays:1,StartCity:'',StartCityID:0,Policy:'',CostInclude:'',
                CostExclude:'',VisaNotice:'',Notice:'',CreateUserID:usr.UserID, AdultPrice:0,KidPrice:0, PlanStatus:3,

                Picture: {
                    Pics: []
                },
                Summary:{
                    PlanName:'',
                    PlanFeature:'',
                    PlanLabels:['观光旅游','艺术','轻探险','亲子','浪漫','游学','传统文化','自然风光','美食','商务与投资'],
                },
                PlanSchedule: [{
                    Spot:[{CountryID:'',CountryNameCn:'test',CountryNameEn:'test',CityID:'',CityNameCn:'test',CityNameEn:'test',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:0,SpotPicUrl:''},
                        {CountryID:'',CountryNameCn:'test',CountryNameEn:'test',CityID:'',CityNameCn:'test',CityNameEn:'test',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:1,SpotPicUrl:''},
                        {CountryID:'',CountryNameCn:'test',CountryNameEn:'test',CityID:'',CityNameCn:'test',CityNameEn:'test',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:2,SpotPicUrl:''},
                        {CountryID:'',CountryNameCn:'test',CountryNameEn:'test',CityID:'',CityNameCn:'test',CityNameEn:'test',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:3,SpotPicUrl:''},
                        {CountryID:'',CountryNameCn:'test',CountryNameEn:'test',CityID:'',CityNameCn:'test',CityNameEn:'test',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:4,SpotPicUrl:''},
                    ],
                    TravelInstruction:'',
                    DayName:''
                }]  //0 city, 1 airport, 2 attraction, 3 delicacy, 4 accommodation
            },
            IMGHOST:$.rogerImgHost()
        };
    };
    var initCityChooser = function (PS) {
        return {
            UserData:0,
            Spot:PS.Spot,
            Plan:PS.Plan
        };
    };
    var initSpotChooser = function (PS) {
        return {
            Type:PS.Type,
            Spot:PS.Spot,
            Plan:PS.Plan,
            TypeCn:PS.TypeCn,
            SpotItem:PS.SpotItem,
            Replace:PS.Replace
        };
    };
    var initAirportChooser = function (PS) {
        return {
            Spot:PS.Spot,
            Plan:PS.Plan,
            SpotItem:PS.SpotItem,
            Replace:PS.Replace
        };
    };
    function getItemWithStartCityID(Spot) {
        for(var i in Spot) {
            if(Spot[i].CityID > 0 && Spot[i].ScheduleType == 0){
                return Spot[i];
            }
        }
        return null;
    };
    function getSpotBySpotItem(PlanSchedule, SpotItem) {
        for(var i = 0 ; i < PlanSchedule.length ; i ++ ){
            var ps = PlanSchedule[i];
            for ( var j = 0; j < ps.Spot.length ; j ++ ) {
                if(ps.Spot[j] === SpotItem) {
                    return ps.Spot;
                }
            }
        }
        return null;
    };

    var ctrlCityChooser = function (PS, realView) {
        $('#cityChooser').modal('show');
        $('#cityChooserOK').rogerOnceClick(PS,function (e) {
            var data = e.data;
            var country = $('#country option:selected').val().split(':');
            var city = $('#city option:selected').val().split(':');
            data.Spot.push({CountryID:country[0],CountryNameCn:country[1],CountryNameEn:country[2],CityID:city[0],CityNameCn:city[1],CityNameEn:city[2],AirportCode:'',AirportNameCn:'',AirportNameEn:'',
                SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:0,SpotPicUrl:''});
            $('#cityChooser').modal('hide');
            $.rogerRefresh(data.Plan);
        });
    };
    var ctrlSpotChooser = function (PS, realView) {
        $('#spotChooser').modal('show');
        $('#spotlist').html('').append('<li class="list-group-item">'+PS.TypeCn+'</li>');
        $('#city').change(PS, function (e) {
            var data = e.data;
            var city = $('#city option:selected').val().split(':');
            if(city && city[0]) {
                $('#spotlist').rogerDialogTrigger('fragment/dialog-spotlist.html', '/dialog/'+PS.Type, {CityID:city[0]}, function (data, realView) {
                    //console.log('spot');
                    $("#spotlist .list-group-item").click(function(e) {
                        $("#spotlist .list-group-item").removeClass("active");
                        $(this).addClass("active");
                    });
                });
            }
        });
        var item = getItemWithStartCityID(getSpotBySpotItem(PS.Plan.PlanInfo.PlanSchedule, PS.SpotItem));
        if(item && item.CityID > 0) {
            setCountryCity(item.CountryNameCn, item.CityID);
            $('#spotlist').rogerDialogTrigger('fragment/dialog-spotlist.html', '/dialog/'+PS.Type, {CityID:item.CityID}, function (data, realView) {
                //console.log('spot');
                realView.rogerCropImages();
                $("#spotlist .list-group-item").click(function(e) {
                    $("#spotlist .list-group-item").removeClass("active");
                    $(this).addClass("active");
                });
            });
        }
        $('#spotChooserOK').rogerOnceClick(PS,function (e) {
            var data = e.data;
            var country = $('#country option:selected').val().split(':');
            var city = $('#city option:selected').val().split(':');
            var spot = $('#spotlist  .list-group-item.active').data('info').split(':');
            //${SpotsID}:${NameCh}:${NameEn}:${PicURL}:${Rank}:${TravelTime}:${SpotsTypeID}
            if(data.Replace) {
                ok:
                    for(var i = 0 ; i < data.Plan.PlanInfo.PlanSchedule.length ; i ++ ){
                        var ps = data.Plan.PlanInfo.PlanSchedule[i];
                        for ( var j = 0; j < ps.Spot.length ; i ++ ) {
                            if(ps.Spot[i] === data.SpotItem) {
                                ps.Spot[i]= {CountryID:country[0],CountryNameCn:country[1],CountryNameEn:country[2],CityID:city[0],CityNameCn:city[1],CityNameEn:city[2],AirportCode:'',AirportNameCn:'',AirportNameEn:'',
                                    SpotID:spot[0],SpotName:spot[1],SpotLocalName:spot[2],SpotTravelTime:spot[5],HotelStarLevel:spot[4],ScheduleType:parseInt(spot[6])+1,SpotPicUrl:spot[3]};
                                break ok;
                            }
                        }
                    }
            }else {
                data.Spot.push({CountryID:country[0],CountryNameCn:country[1],CountryNameEn:country[2],CityID:city[0],CityNameCn:city[1],CityNameEn:city[2],AirportCode:'',AirportNameCn:'',AirportNameEn:'',
                    SpotID:spot[0],SpotName:spot[1],SpotLocalName:spot[2],SpotTravelTime:spot[5],HotelStarLevel:spot[4],ScheduleType:parseInt(spot[6])+1,SpotPicUrl:spot[3]});
            }
            $('#cityChooser').modal('hide');
            $.rogerRefresh(data.Plan);
        });
    };
    var ctrlAirportChooser = function (PS, realView) {
        $('#airportChooser').modal('show');
        $('#airportlist').html('').append('<li class="list-group-item">机场</li>');
        $('#airportlist').rogerDialogTrigger('fragment/dialog-airportlist.html', '/dialog/airport', {}, function (data, realView) {
            $('#searchlist').btsListFilter('#searchinput', {itemChild: '.list-group-item-text',initial:false});
            $("#airportlist .list-group-item").click(function(e) {
                $("#airportlist .list-group-item").removeClass("active");
                $(this).addClass("active");
            });
        });
        $('#airportChooserOK').rogerOnceClick(PS,function (e) {
            var data = e.data;
            var airport = $('#airportlist  .list-group-item.active').data('info').split(':');
            //${AirPortCode}:${NameCh}:${NameEn}
            if(data.Replace) {
                ok:
                    for(var i = 0 ; i < data.Plan.PlanInfo.PlanSchedule.length ; i ++ ){
                        var ps = data.Plan.PlanInfo.PlanSchedule[i];
                        for ( var j = 0; j < ps.Spot.length ; i ++ ) {
                            if(ps.Spot[i] === data.SpotItem) {
                                ps.Spot[i]= {CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:airport[0],AirportNameCn:airport[1],AirportNameEn:airport[2],
                                    SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:1,SpotPicUrl:''}
                                break ok;
                            }
                        }
                    }
            }else {
                if(data.Plan.Airports){
                    data.Plan.Airports.AirportCode = airport[0];
                    data.Plan.Airports.NameCh = airport[1];
                    data.Plan.Airports.NameEn = airport[2];
                }else{
                    data.Spot.push({CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:airport[0],AirportNameCn:airport[1],AirportNameEn:airport[2],
                        SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:1,SpotPicUrl:''});
                }
            }
            $('#cityChooser').modal('hide');
            $.rogerRefresh(data.Plan);
        });
    };
    var ctrlTemplateplanNew = function(Plan, realView) {
        $('img[name="needPrefix"]').each(function () {
            var src = $(this).attr('src');
            if(src.indexOf('group1') > -1) {
                $(this).attr('src',Plan.IMGHOST+src);
            }
        })
        Plan.createDay = function(Plan, PlanSchedule){  //  PlanSchedule ==> data-pointer="/PlanInfo/PlanSchedule/-"
            PlanSchedule.push({
                Spot:[{CountryID:'',CountryNameCn:'test',CountryNameEn:'test',CityID:'',CityNameCn:'test',CityNameEn:'test',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:1,SpotPicUrl:''},
                    {CountryID:'',CountryNameCn:'test',CountryNameEn:'test',CityID:'',CityNameCn:'test',CityNameEn:'test',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:1,SpotPicUrl:''},
                    {CountryID:'',CountryNameCn:'test',CountryNameEn:'test',CityID:'',CityNameCn:'test',CityNameEn:'test',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:2,SpotPicUrl:''},
                    {CountryID:'',CountryNameCn:'test',CountryNameEn:'test',CityID:'',CityNameCn:'test',CityNameEn:'test',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:3,SpotPicUrl:''},
                    {CountryID:'',CountryNameCn:'test',CountryNameEn:'test',CityID:'',CityNameCn:'test',CityNameEn:'test',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:4,SpotPicUrl:''},
                ],
                TravelInstruction:'',
                DayName:''
            });
            Plan.PlanInfo.PlanDays ++;
            $.rogerRefresh(Plan);
        };

        Plan.createCity = function (Plan, Spot) {
            $.rogerTrigger('#modal', '#/citychooser', {Plan:Plan, Spot:Spot});
        };
        Plan.createAttraction = function (Plan, Spot) {
            $.rogerTrigger('#modal', '#/spotchooser', {Plan:Plan, Spot:Spot, Type:'attraction', TypeCn:'景点'});
        };
        Plan.createDelicacy = function (Plan, Spot) {
            $.rogerTrigger('#modal', '#/spotchooser', {Plan:Plan, Spot:Spot, Type:'delicacy', TypeCn:'美食'});
        };
        Plan.createAccommodation = function (Plan, Spot) {
            $.rogerTrigger('#modal', '#/spotchooser', {Plan:Plan, Spot:Spot, Type:'accommodation',TypeCn:'酒店'});
        };
        Plan.changeAttraction = function (Plan, SpotItem) {
            $.rogerTrigger('#modal', '#/spotchooser', {Plan:Plan,   Type:'attraction', TypeCn:'景点', SpotItem:SpotItem,Replace:true});
        };
        Plan.changeDelicacy = function (Plan, SpotItem) {
            $.rogerTrigger('#modal', '#/spotchooser', {Plan:Plan,   Type:'delicacy', TypeCn:'美食', SpotItem:SpotItem,Replace:true});
        };
        Plan.changeAccommodation = function (Plan, SpotItem) {
            $.rogerTrigger('#modal', '#/spotchooser', {Plan:Plan,   Type:'accommodation', TypeCn:'酒店',SpotItem:SpotItem,Replace:true});
        };
        Plan.createAirport = function (Plan, Spot) {
            $.rogerTrigger('#modal', '#/airportchooser', {Plan:Plan, Spot:Spot});
        };
        Plan.changeAirport = function (Plan, SpotItem) {
            $.rogerTrigger('#modal', '#/airportchooser', {Plan:Plan, SpotItem:SpotItem, Replace: true});
        };

        $('#save').rogerOnceClick(Plan, function(e){
            var item = getItemWithStartCityID(data.PlanInfo.PlanSchedule[0].Spot);
            if(item && item.CityID > 0) {
                if (!Plan.PlanInfo.PlanID) {
                    var data = {PlanInfo: e.data.PlanInfo};
                    data.PlanInfo.StartCityID = item.CityID;
                    data.PlanInfo.Summary._PlanLabels = data.PlanInfo.Summary.PlanLabels.join();
                    $.rogerPost('/new/tmpplan', data, function (respJSON) {
                        $.rogerNotice({Message: '模板方案成功'});
                    });
                } else {
                    $.rogerPost('/delete/plan', {PlanID: Plan.PlanInfo.PlanID}, function (respJSON) {
                        var data = {PlanInfo: e.data.PlanInfo};
                        data.PlanInfo.StartCityID = item.CityID;
                        data.PlanInfo.Summary._PlanLabels = data.PlanInfo.Summary.PlanLabels.join();
                        $.rogerPost('/new/tmpplan', data, function (respJSON) {
                            $.rogerNotice({Message: '模板方案发布成功'});
                        });
                    });
                }
            }else {
                $.rogerNotice({Message: '请选择起始城市'});
            }
        });
        /*$('#publish').rogerOnceClick(Plan, function(e){
         $.rogerPost('/publish/plan', {PlanID:Plan.PlanInfo.PlanID,Status:1}, function(respJSON){
         $.rogerNotice({Message:'模板方案待审核..'});
         $.rogerRefresh(Plan);
         });
         });*/
        $('#cancel').rogerOnceClick(Plan, function(e){
            $.rogerPost('/publish/plan', {PlanID:Plan.PlanInfo.PlanID,Status:3}, function(respJSON){
                $.rogerNotice({Message:'模板方案已取消发布..'});
                $.rogerRefresh(Plan);
            });
        });

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };
    //-------------------------------plan customize end---------------------------------

	$.rogerRouter({
		'#/':							{view:'home.html',										rootrest:'/home', 						ctrl: ctrlHome},
        '#/search':					{view:'home-search.html',								rootrest:'/home/search',					ctrl: ctrlHomeSearch},
		'#/plandetail': 				{view:'plandetail.html',									rootrest:'/plan/detail', 				ctrl: ctrlPlandetail},
        '#/homelist':                  {fragment: 'fragment/home-list.html',           init: initHomeList,                                                    ctrl: ctrlHomeList},

        '#/templateplannew':         {fragment: 'fragment/visitor-tempplan-edit.html',   init: initTemplateplanNew,                  ctrl: ctrlTemplateplanNew},

        '#/citychooser':                  {fragment: 'fragment/dialog-city-chooser.html',           init: initCityChooser,                                                    ctrl: ctrlCityChooser},
        '#/spotchooser':                  {fragment: 'fragment/dialog-spot-chooser.html',           init: initSpotChooser,                                                    ctrl: ctrlSpotChooser},
        '#/airportchooser':              {fragment: 'fragment/dialog-airport-chooser.html',        init: initAirportChooser,                                                 ctrl: ctrlAirportChooser},

        '#/planpay1': 				{view:'plandetail-pay-1.html',							rootrest:'/plan/pay1',    				ctrl: ctrlPlanpay1},
        '#/orderlist': 				{view: 'orderlist-vistor.html',            			    rootrest: '/order/list', 				ctrl: ctrlOrderlist},
		'#/comment':             		{fragment: 'fragment/comment.html',					init: initComment,							ctrl: ctrlComment},
        '#/orderdetail':            {view:'payCompletion.html',	                            rootrest:'/order/detail',               ctrl: ctrlOrderdetail},
	    '#/plansearch':             {view:'planSearch.html',                                  rootrest:'/plan/plansearch',            ctrl: ctrlPlanSearch},
        '#/userinfo':               {view:'userInfo.html',                                     rootrest:'/user/userinfo',               ctrl: ctrlUserInfo}
    });
	
	
})();