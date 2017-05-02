 $(function () { 
    var policy1 = '1  游客在行程开始日期前60天以上提出取消，扣除已产生的费用以外的全部费用；\r\n2  游客在行程开始日期前30天以上提出取消，退还总费用的50%；\r\n3  游客在行程开始日期前15天以上提出取消，退还总费用的20%；\r\n4  游客在行程开始日期前15天（含）以内提出取消，不退还服务费用。';
    var policy2 = '1  一辆如服务描述（或同级别）的车辆使用费（在限定时间和里程范围内）；\r\n2  服务发布者本人作为司机兼导游的服务费（限定时间内），含小费；\r\n3  燃油费\r\n4  停车费\r\n5  车载WiFi热点每天1GB流量\r\n6  高速，桥梁，隧道的过路费，进城费\r\n7  司机/导游的住宿费，空程费\r\n8  如下景点的门票费用：\r\n9  行程描述中酒店（或同等级别酒店）的双人标准间；\r\n10  酒店内自助式早餐；\r\n11  旅行医疗及意外保险；\r\n12  签证办理费用。';
    var policy3 = '1  景点游览和公务/商务活动期间的服务费用；\r\n2  超时等待的费用，资费参看服务描述；\r\n3  机场和送达目的地的停车费。';
    var policy4 = '1  公务和商务活动中的专业翻译费用（可另付费提供）\r\n2  护照费用；\r\n3  航空公司燃油涨幅；\r\n4  酒店内电话、上网，传真、洗熨、收费电视、饮料等额外费用；\r\n5  酒店门童，餐馆服务生小费；\r\n6  报价中未提及的门票；\r\n7  因不可抗拒的客观原因（如天灾、战争、罢工等）、航空公司航班延误或取消等特殊情况导致行程取消或变更，由此产生的额外费用（如延期签证费、住、食及交通费、国家航空运价调整等）；\r\n8  导游及司机加班工资，资费如服务描述；\r\n9  导游及司机行程中缺餐补助，资费如服务描述；\r\n10  服务及方案描述中未提及的景点费用。';
    var policy5 = '1  因游客擅自行动走失，发生事故等产生的费用由游客自行承担；\r\n2  如遇不可预见的事件，如堵车，交通事故等，导游与游客商定可临时合理更改行程，并继续旅程，由此产生的加班费用和超程费用由游客承担；\r\n3  旅客不可要求导游进行违反交通规则、法律、当地风俗的活动，如旅客有违规、违法行为倾向导游须劝阻，劝阻无效则报警处理；\r\n4  导游不可强制旅客参与购物活动或参加自费项目，约定行程外项目需取得旅客同意；\r\n5  原则上导游与游客共进正餐（午餐和晚餐），费用由游客支付，缺少正餐时游客应支付缺餐补助；\r\n6  如导游陪同游客游览景点，游客需为导游支付门票费用。';
    url='';
    pamaeta ={pagestart:0,pagesize:8};
    page = 1;

    function pamaetainit(){
        pamaeta ={pagestart:0,pagesize:8};
        page = 1;
    }

    function getGetUri(para){
        geturiparameta = [];
        $.each(para, function (ind, val) {
            geturiparameta.push(ind+'='+val);
        });
        geturi = geturiparameta.join("&");

        return geturi
    }

    function bindRidoesForSwitch (){
        var ev = $._data($('#menu input[type=radio][name="optradio"]')[0], 'events');

        if(!ev || !ev.change) {
            $('#menu input[type=radio][name="optradio"]').unbind().change(function(e){
                var usr = $.rogerGetLoginUser();
                if(!usr) {
                    $.rogerShowLogin();
                    return;
                }

                pamaetainit();
                url = $(this).next('div').data('href');
                pamaeta["UserID"]=usr.UserID;
                $.rogerTrigger('#app',url, pamaeta);
            });
        }

        var filterev = $._data($('#filter input[type=radio][name="filterradio"]')[0], 'events');
        if(!filter2ev || !filter2ev.change) {

            $('#filterev input[type=radio][name="filterradio"]').unbind().change(function(e){
                var usr = $.rogerGetLoginUser();
                if(!usr) {
                    $.rogerShowLogin();
                    return;
                }
                filtertemp = $(this).val();
                if('all' == filtertemp){
                    delete pamaeta["filter"];
                } else {
                    pamaeta["filter"]=filtertemp;
                }

                pamaeta["UserID"]=usr.UserID;

                if(url == ''){
                    url = $.rogerGetPath() || window.location.hash;
                }

                $.rogerLocation(url,pamaeta);

                // $.rogerTrigger('#app',url, pamaeta);
            });

        }

        var filter2ev = $._data($('#filter2 input[type=radio][name="filterradio"]')[0], 'events');
        if(!filter2ev || !filter2ev.change) {

            $('#filter2 input[type=radio][name="filterradio"]').unbind().change(function(e){
                var usr = $.rogerGetLoginUser();
                if(!usr) {
                    $.rogerShowLogin();
                    return;
                }
                filtertemp = $(this).val();
                if('all' == filtertemp){
                    delete pamaeta["filter"];
                } else {
                    pamaeta["filter"]=filtertemp;
                }

                pamaeta["UserID"]=usr.UserID;

                if(url == ''){
                    url = $.rogerGetPath() || window.location.hash;
                }

                $.rogerLocation(url,pamaeta);

                // $.rogerTrigger('#app',url, pamaeta);
            });

        }

        var filter3ev = $._data($('#filter3 input[type=radio][name="filterradio"]')[0], 'events');
        if(!filter3ev || !filter3ev.change) {
            $('#filter3 input[type=radio][name="filterradio"]').unbind().on('change',function(e){
                var usr = $.rogerGetLoginUser();
                var url = $.rogerGetPath() || window.location.hash;
                if(!usr) {
                    $.rogerShowLogin();
                    return;
                }
                filtertemp = $(this).val();
                if('all' == filtertemp){
                    delete pamaeta["filter"];
                } else {
                    pamaeta["filter"]=filtertemp;
                }

                pamaeta["UserID"]=usr.UserID;
                if(url == ''){
                    url = $.rogerGetPath() || window.location.hash;
                }
                $.rogerTrigger('#app',url, pamaeta);
            });
        }
        function titleList(){
            var urlPath = $.rogerGetPath() || window.location.hash;
              if(urlPath == "#/" || urlPath.indexOf("#/spcialplan") != -1){
                $('#title').show();
                $('#menu').show();
                $('#filter').show();
                $('#filter2').hide();
                $('#filter3').hide();
              }else if(urlPath.indexOf("#/travelogue") != -1 ||urlPath.indexOf("#/travelogueedit") != -1){
                $('#title').hide();
                $('#menu').hide();
                $('#filter').hide();
                $('#filter2').hide();
                $('#filter3').show();
              }else if(urlPath.indexOf("#/orderlist") != -1 || urlPath.indexOf("#/userinfo") != -1){
                $('#title').hide();
                $('#menu').hide();
                $('#filter').hide();
                $('#filter2').hide();
                $('#filter3').hide();
              }
        }
        
        titleList();
        $('.nav-sidebar li').on('click',titleList());

      $("#menu label input").on('change',function (e) {
        if($(this).val() == '0'){
          $('#filter').show();
          $('#filter2').hide();
          $('#filter3').hide();
        }else if($(this).val() == '1'){
          $('#filter').hide();
          $('#filter2').show();
          $('#filter3').hide();
        }else if($(this).val() == '2'){
          $('#filter').hide();
          $('#filter2').hide();
          $('#filter3').hide();
        }
      });

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

        $('#personInfo').rogerOnceClick2(null, function () {
            var user = $.rogerGetLoginUser();
            if(!user) {
                $.rogerLogin('#homeLogin', '/login');
                $.rogerShowLogin();
                return;
            }
            //$.rogerLocation('#/orderlist?userID='+user.UserID+'&usertype=2&status=0&page=1');
            $.rogerLocation('#/userinfo?UserID='+user.UserID);
        });

        $('#usercenter').rogerOnceClick2(null, function () {
            var user = $.rogerGetLoginUser();
            if(!user) {
                $.rogerLogin('#homeLogin', '/login');
                $.rogerShowLogin();
                return;
            }

            page = 1;
            pamaeta["userID"]=user.UserID;
            pamaeta["usertype"]=2;
            pamaeta["status"]=0;
            pamaeta["page"]=page;

            url = "#/orderlist";
            $.rogerLocation('#/orderlist?userID='+user.UserID+'&usertype=2&status=0&page=1');
        });

        $('#productctr').rogerOnceClick2(null, function () {
            var user = $.rogerGetLoginUser();
            if(!user) {
                $.rogerLogin('#homeLogin', '/login');
                $.rogerShowLogin();
                return;
            }
            pamaetainit();
            pamaeta["UserID"]=user.UserID;
            $.rogerLocation('#/spcialplan?'+getGetUri(pamaeta));

        });


        $('#traveloguectr').rogerOnceClick2(null, function () {
            var user = $.rogerGetLoginUser();
            if(!user) {
                $.rogerLogin('#homeLogin', '/login');
                $.rogerShowLogin();
                return;
            }
            pamaeta["UserID"]=user.UserID;

            $.rogerLocation('#/travelogue?UserID='+user.UserID+'&pagestart=0'+'&pagesize='+pamaeta.pagesize);
        });
        //点击资料管理
        $('#datum').rogerOnceClick2(null, function () {
            var user = $.rogerGetLoginUser();
            if(!user) {
                $.rogerLogin('#homeLogin', '/login');
                $.rogerShowLogin();
                return;
            }
            //$.rogerLocation('#/orderlist?userID='+user.UserID+'&usertype=2&status=0&page=1');
            $.rogerLocation('#/userinfodetail');
        });
    }
	var ctrlDashboard = function(response, realView) {
        if( !$.trim( $('#modal').html() ) ) {
            $('#modal').rogerReloadFile('./fragment/dialog-login.html');
        }
        if(!$.rogerGetURLJsonParams()) {
            if(!$.rogerIsLogined()) {
                $.rogerLogin('#homeLogin', '/login');
                $.rogerShowLogin();
            }else{
                var usr = $.rogerGetLoginUser();
                if(!usr) {
                    $.rogerLogin('#homeLogin', '/login');
                    $.rogerShowLogin();
                    return;
                }
                $.rogerLocation('#/?UserID='+usr.UserID)
            }
        }
        $('#productctr').trigger('click');

        bindRidoesForSwitch();
        realView.rogerCropImages();
	};
    var ctrlSpecialplan = function(response, realView) {
        $(".switchCheckbox").bootstrapSwitch();
        $('.release').on('switchChange.bootstrapSwitch', function (e, data) {
            var user = $.rogerGetLoginUser();
            var status = $(this).data("status");
            var ServiceId = $(this).data("serviceid");
            //3,隐藏，4发布
            $.rogerPost('/travel/guideplan/editPlanStatus', {planStatus: status, planID: ServiceId, userID:user.UserID}, function (respJSON) {
                if(respJSON.errcode == 0){
                    $.rogerNotice({Message: '操作成功'});
                }
            });

            // $.get("http://123.59.144.44/travel/guideplan/editPlanStatus?planStatus="+status+"&planID="+ServiceId+"&userID="+user.UserID,function(){
            //     $.rogerNotice({Message: '操作成功'});
            // });
        });
        bindRidoesForSwitch();
        realView.rogerCropImages();
        pageclick();

    };
    var ctrlClassicplan = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };
    var ctrlService = function(response, realView) {

        $(".switchCheckbox").bootstrapSwitch();
        $('.release').on('switchChange.bootstrapSwitch', function (e, data) {
            var status = $(this).data("status");
            var ServiceId = $(this).data("serviceid");
            //3,隐藏，4发布
            $.rogerPost('/update/service/status', {Status: status, ServiceId: ServiceId}, function (respJSON) {
                $.rogerNotice({Message: '操作成功'});

            });
            }
        );
        bindRidoesForSwitch();
        realView.rogerCropImages();

        pageclick();
    };
    var ctrlAttraction = function(response, realView) {
        $(".switchCheckbox").bootstrapSwitch();
        $('.release').on('switchChange.bootstrapSwitch', function (e, data) {
            var status = $(this).data("status");
            var SpotsID = $(this).data("spotsid");
            //1,隐藏，2发布
            $.rogerPost('/update/spots/status', {Status: status, SpotsID: SpotsID}, function (respJSON) {
                $.rogerNotice({Message: '操作成功'});

            });
            }
        );

        realView.rogerCropImages();

        pageclick();
    };

    var ctrlTravelogue = function(response, realView) {

        $(".switchCheckbox").bootstrapSwitch();
        $('.release').on('switchChange.bootstrapSwitch', function (e, data) {
            var status = $(this).data("status");
            var articleID = $(this).data("articleid");
            //0,草稿，1发布
            $.rogerPost('/update/travelogue/status', {articleID:articleID,STATUS:status}, function (respJSON) {
                $.rogerNotice({Message: '操作成功'});

            });
            }
        );
        // $('#filter3 input[type=radio][name="filterradio"]').on('change',function(e){
        //     var usr = $.rogerGetLoginUser();
        //     var url = $.rogerGetPath() || window.location.hash;
        //     if(!usr) {
        //         $.rogerShowLogin();
        //         return;
        //     }
        //     filtertemp = $(this).val();
        //     if('all' == filtertemp){
        //         filtertemp = null;
        //     }
        //     $.rogerTrigger('#app',url, {UserID:usr.UserID,filter:filtertemp});
        // });

        bindRidoesForSwitch();
        realView.rogerCropImages();

        pageclick();
    };

    //calendar格式设置价格库存详情查看
    function priceCalendarDetail(response){
        for(var i = 0; i < response.Planstockquantitys.length; i++){
            response.Planstockquantitys[i].title = '已设置';
            response.Planstockquantitys[i].start = response.Planstockquantitys[i].scheduleDate;
        }
        var trStrEdit ;
        function PriceListEdit(temp){
            trStrEdit = '';
            for(var i = 0; i < temp.length; i++){
                trStrEdit += '<tr><td>'+temp[i].SpendName +'</td>'+
                    '<td>'+ temp[i].AdultPrice +'</td>'+
                    '<td>'+ temp[i].KidPrice +'</td>'+
                    '<td>'+ temp[i].StockQuantity +'</td></tr>';
            }
            $('#dayPriceSet tbody').html(trStrEdit);
        }

        $('#calendar').fullCalendar({
            fixedWeekCount:false,
            buttonIcons:false,
            buttonText:{
                prev:'上月',
                next:'下月',
                prevYear:'上一年',
                nextYear:'下一年',
                today:'今天',
            },
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'prevYear,nextYear'
            },
            eventSources: [
                {
                    events: response.Planstockquantitys,
                    className: 'eventSetted'
                }
            ],
            //events:Plan.PlanInfo.Planstockquantitys,
            dayClick:function(date, jsEvent, view){
                var dd = $.fullCalendar.formatDate(date,'YYYY年MM月DD日');
                var idtemp = $.fullCalendar.formatDate(date,'YYYY-MM-DD');
                var eventArr = view.options.eventSources[0].events;
                var now = new Date();
                if(Date.parse(date) < (Date.parse(now)-1000*60*60*24) ){
                    alert('时间已过期，不可用！');
                }else{      
                    var flag = false;
                    var temp;
                    for(var i=0; i < eventArr.length; i++){
                        if(idtemp == eventArr[i].start){
                            flag = true;
                            temp = eventArr[i].prices;
                            break;
                        }
                    }
                    if(flag){
                        trStrEdit = '';
                        PriceListEdit(temp);
                        $('#dayPriceSet').modal();
                        $('#dayPriceSet .modal-title').html(dd);
                        $('#dayPriceSet .modal-title').attr('data-value',idtemp);
                    }else{
                        alert('此日期暂无设置数据');
                    }
                }
            },
            eventClick:function(eventData,jsEvent, view){
                //console.log(eventData)
                var dd = $.fullCalendar.formatDate(eventData.start,'YYYY年MM月DD日');
                var idtemp = $.fullCalendar.formatDate(eventData.start,'YYYY-MM-DD');
                $('#dayPriceSet').modal();
                $('#dayPriceSet .modal-title').html(dd);
                $('#dayPriceSet .modal-title').attr('data-value',idtemp);
                var temp = eventData.prices;
                PriceListEdit(temp);
            }
        });

    }

    var ctrlShortplanDetail = function(response, realView) {

        //更多报价的切换
        $('#morePrice').on('click',function(){
            $('#morePriceList').css('display','block');
        });
        $('#morePriceList .glyphicon').on('click',function(){
            $('#morePriceList').css('display','none');
        });
        $('#morePriceList').on('click','div label',function(){
            $('#morePriceList div label').removeClass('label-success').addClass('label-warning');
            $(this).removeClass('label-warning').addClass('label-success');
            var AdultPrice = $(this).data('AdultPrice');
            var KidPrice = $(this).data('KidPrice');
            $('#AdultPrice').html(AdultPrice);
            $('#KidPrice').html(KidPrice);
        });

        if( response.PlanInfo[0].Policy ){
            $('#policy').html(response.PlanInfo[0].Policy.replace(/\r\n/g, '<br>'));
        }
        if( response.PlanInfo[0].CostInclude ){
            $('#costinc').html(response.PlanInfo[0].CostInclude.replace(/\r\n/g, '<br>'));
        }
        if( response.PlanInfo[0].CostExclude ){
            $('#costexc').html(response.PlanInfo[0].CostExclude.replace(/\r\n/g, '<br>'));
        }
        if( response.PlanInfo[0].VisaNotice ){
            $('#visa').html(response.PlanInfo[0].VisaNotice.replace(/\r\n/g, '<br>'));
        }
        if( response.PlanInfo[0].Notice ){
            $('#warning').html(response.PlanInfo[0].Notice.replace(/\r\n/g, '<br>'));
        }

        priceCalendarDetail(response);
        
        bindRidoesForSwitch();
        realView.rogerCropImages();
    };
    var ctrlTemplateplanDetail = function(response, realView) {

        //更多报价的切换
        // $('#morePrice').on('click',function(){
        //     $('#morePriceList').css('display','block');
        // });
        // $('#morePriceList .glyphicon').on('click',function(){
        //     $('#morePriceList').css('display','none');
        // });
        // $('#morePriceList').on('click','div label',function(){
        //     $('#morePriceList div label').removeClass('label-success').addClass('label-warning');
        //     $(this).removeClass('label-warning').addClass('label-success');
        //     var AdultPrice = $(this).data('AdultPrice');
        //     var KidPrice = $(this).data('KidPrice');
        //     $('#AdultPrice').html(AdultPrice);
        //     $('#KidPrice').html(KidPrice);
        // });

        if( response.PlanInfo[0].Policy ){
            $('#policy').html(response.PlanInfo[0].Policy.replace(/\r\n/g, '<br>'));
        }
        if( response.PlanInfo[0].CostInclude ){
            $('#costinc').html(response.PlanInfo[0].CostInclude.replace(/\r\n/g, '<br>'));
        }
        if( response.PlanInfo[0].CostExclude ){
            $('#costexc').html(response.PlanInfo[0].CostExclude.replace(/\r\n/g, '<br>'));
        }
        if( response.PlanInfo[0].VisaNotice ){
            $('#visa').html(response.PlanInfo[0].VisaNotice.replace(/\r\n/g, '<br>'));
        }
        if( response.PlanInfo[0].Notice ){
            $('#warning').html(response.PlanInfo[0].Notice.replace(/\r\n/g, '<br>'));
        }
        
        priceCalendarDetail(response);

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };
    var initTemplateplanNew = function(params){
        var usr =$.rogerGetLoginUser();
        var type = $.rogerGetUrlParam('type');
        return {
            PlanInfo:{
                PlanName:'', PlanType: type, PlanPriceBase:0,PicURL:[],CarURL:[],PlanDays:1,StartCity:'',StartCityID:0,Policy:policy1,CostInclude:policy2,
                CostExclude:policy3,VisaNotice:policy4,Notice:policy5,CreateUserID:usr.UserID, AdultPrice:0,KidPrice:0, PlanStatus:3,
                UserPlan:{UserID:usr.UserID},
                PlanSpendInfoList:[{
                    SpendName:'',
                    AdultPrice:0,
                    KidPrice:0
                }],
                Picture: {
                    Pics: []
                },
                Summary:{
                    PlanName:'',
                    PlanFeature:'',
                    PlanLabels:['观光旅游','艺术','轻探险','亲子','浪漫','游学','传统文化','自然风光','美食','商务与投资'],
                },
                PlanSchedule: [{
                    Spot:[/*{CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:0,SpotPicUrl:''},
                          {CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:1,SpotPicUrl:''},
                          {CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:2,SpotPicUrl:''},
                          {CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:3,SpotPicUrl:''},
                          {CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:4,SpotPicUrl:''},
*/                    ],
                    TravelInstruction:'',
                    DayName:''
                }]  //0 city, 1 airport, 2 attraction, 3 delicacy, 4 accommodation
            },
            IMGHOST:$.rogerImgHost()
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
    var initShortplanNew = function(params){
        var usr =$.rogerGetLoginUser();
        var type = $.rogerGetUrlParam('type');
        return {
            PlanInfo:{
                PlanName:'', PlanType: type, PlanPriceBase:0,PicURL:[],CarURL:[],PlanDays:1,StartCity:'',StartCityID:null,Policy:policy1,CostInclude:policy2,
                CostExclude:policy3,VisaNotice:policy4,Notice:policy5,CreateUserID:usr.UserID, AdultPrice:0,KidPrice:0, PlanStatus:3,
                UserPlan:{UserID:usr.UserID},
                PlanSpendInfoList:[{
                    SpendName:'',
                    AdultPrice:0,
                    KidPrice:0
                }],
                Picture:{
                    Pics:[]
                },
                Summary:{
                    PlanName:'',
                    PlanFeature:'',
                    PlanLabels:['观光旅游','艺术','轻探险','亲子','浪漫','游学','传统文化','自然风光','美食','商务与投资'],
                },
                PlanShort: []
            },
            IMGHOST:$.rogerImgHost()
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
    var ctrlSpotChooser = function (PS, realView) {
        $('#spotChooser').modal('show');
        var ReplaceFlag;
        $('#spotlist').html('').append('<li class="list-group-item">'+PS.TypeCn+'</li>');
        $('#city').change(PS, function (e) {
            var data = e.data;
            ReplaceFlag = data.Replace;
            var city = $('#city option:selected').val().split(':');
            if(city && city[0]) {
                $('#spotlist').rogerDialogTrigger('fragment/dialog-spotlist.html', '/dialog/'+PS.Type, {CityID:city[0]}, function (data, realView) {
                    //console.log('spot');
                    $("#spotlist .list-group-item").click(function(e) {
                        if(ReplaceFlag) {
                            $("#spotlist .list-group-item").removeClass("active");
                            $(this).addClass("active");
                        }else{
                            if($(this).hasClass("active")){
                                $(this).removeClass("active");
                            }else{
                                $(this).addClass("active");
                            }
                        }    
                    });
                });
            }
        });
        var item = getItemWithStartCityID(PS.Spot);
        if(item && item.CityID > 0) {
            setCountryCity(item.CountryNameCn, item.CityID);
            $('#spotlist').rogerDialogTrigger('fragment/dialog-spotlist.html', '/dialog/'+PS.Type, {CityID:item.CityID}, function (data, realView) {
                //console.log('spot');
                realView.rogerCropImages();
                $("#spotlist .list-group-item").click(function(e) {
                    if(ReplaceFlag) {
                        $("#spotlist .list-group-item").removeClass("active");
                        $(this).addClass("active");
                    }else{
                        if($(this).hasClass("active")){
                            $(this).removeClass("active");
                        }else{
                            $(this).addClass("active");
                        }
                    }                   
                });
            });
        }
        $('#spotChooserOK').rogerOnceClick(PS,function (e) {
            var data = e.data;
            var country = $('#country option:selected').val().split(':');
            var city = $('#city option:selected').val().split(':');
            if(data.Replace) {
                var spot = $('#spotlist  .list-group-item.active').data('info').split(':');
            }else{
                var spot = [];
                $('#spotlist  .list-group-item.active').each(function(){
                    var tempSpot = $(this).data('info').split(':');
                    spot.push(tempSpot); 
                });            
            }
            //${SpotsID}:${NameCh}:${NameEn}:${PicURL}:${Rank}:${TravelTime}:${SpotsTypeID}
            if(data.Replace) {
                ok:
                for(var i = 0 ; i < data.Plan.PlanInfo.PlanSchedule.length ; i ++ ){
                    var ps = data.Plan.PlanInfo.PlanSchedule[i];
                    for ( var j = 0; j < ps.Spot.length ; j ++ ) {
                        if(ps.Spot[j] === data.SpotItem) {
                            ps.Spot[j]= {CountryID:country[0],CountryNameCn:country[1],CountryNameEn:country[2],CityID:city[0],CityNameCn:city[1],CityNameEn:city[2],AirportCode:'',AirportNameCn:'',AirportNameEn:'',
                                SpotID:spot[0],SpotName:spot[1],SpotLocalName:spot[2],SpotTravelTime:spot[5],HotelStarLevel:spot[4],ScheduleType:parseInt(spot[6])+1,SpotPicUrl:spot[3]};
                            break ok;
                        }
                    }
                }
            }else {
                for(var m=0; m<spot.length; m++){
                    data.Spot.push({CountryID:country[0],CountryNameCn:country[1],CountryNameEn:country[2],CityID:city[0],CityNameCn:city[1],CityNameEn:city[2],AirportCode:'',AirportNameCn:'',AirportNameEn:'',
                    SpotID:spot[m][0],SpotName:spot[m][1],SpotLocalName:spot[m][2],SpotTravelTime:spot[m][5],HotelStarLevel:spot[m][4],ScheduleType:parseInt(spot[m][6])+1,SpotPicUrl:spot[m][3]});
                }                
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
                    for ( var j = 0; j < ps.Spot.length ; j ++ ) {
                        if(ps.Spot[j] === data.SpotItem) {
                            ps.Spot[j]= {CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:airport[0],AirportNameCn:airport[1],AirportNameEn:airport[2],
                                SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:1,SpotPicUrl:''}
                            break ok;
                        }
                    }
                }
            }else {
                if(data.Plan.DetailMain && data.Plan.DetailMain.airports){
                    data.Plan.DetailMain.airports.push({AirportCode:airport[0],NameCh:airport[1],NameEn:airport[2],CreateDate:'',ServiceID:''});
                }else{
                data.Spot.push({CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:airport[0],AirportNameCn:airport[1],AirportNameEn:airport[2],
                    SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:1,SpotPicUrl:''});
                }
            }
            $('#cityChooser').modal('hide');
            $.rogerRefresh(data.Plan);
        });
    };
    //calendar格式设置价格库存
    function priceCalendarEdit(Plan){
        if(!Plan.PlanInfo.Planstockquantitys){
            if(!Plan.Planstockquantitys || Plan.Planstockquantitys.length == 0){
                Plan.PlanInfo.Planstockquantitys=[
                    {
                        scheduleDate: '2017-04-28',
                        start:'2017-04-28',
                        title:'已设置',
                        prices:[
                            {
                                SpendName:'套餐一',
                                AdultPrice:12,
                                KidPrice:9,
                                stockQuantity:8
                            }
                        ]
                    },
                    {
                        scheduleDate: '2017-04-30',
                        title:'已设置',
                        start:'2017-04-30',
                        prices:[
                            {
                                SpendName:'套餐一',
                                AdultPrice:12,
                                KidPrice:9,
                                stockQuantity:8
                            },
                            {
                                SpendName:'套餐二',
                                AdultPrice:12,
                                KidPrice:9,
                                stockQuantity:8
                            },
                            {
                                SpendName:'套餐三',
                                AdultPrice:12,
                                KidPrice:9,
                                stockQuantity:8
                            }
                        ]
                    }
                    ]
            }else{
                Plan.PlanInfo.Planstockquantitys = Plan.Planstockquantitys;
            }
            $.rogerRefresh(Plan);
        }
        //编辑价格
        var trStr = '<tr><td><input type="text" placeholder="请输入"></td>'+
            '<td><input type="text" placeholder="请输入"></td>'+
            '<td><input type="text" placeholder="请输入"></td>'+
            '<td><input type="text" placeholder="请输入"></td>'+
            '<td><span class="glyphicon glyphicon-minus-sign"></span></td></tr>';
        var trStrEdit ;
        function PriceListEdit(temp){
            trStrEdit = '';
            for(var i = 0; i < temp.length; i++){
                trStrEdit += '<tr><td><input type="text" placeholder="请输入" value="'+ temp[i].SpendName +'"></td>'+
                    '<td><input type="text" placeholder="请输入" value="'+ temp[i].AdultPrice +'"></td>'+
                    '<td><input type="text" placeholder="请输入" value="'+ temp[i].KidPrice +'"></td>'+
                    '<td><input type="text" placeholder="请输入" value="'+ temp[i].stockQuantity +'"></td>'+
                    '<td><span class="glyphicon glyphicon-minus-sign"></span></td></tr>';
            }
            $('#dayPriceSet tbody').html(trStrEdit);
        }

        $('#calendar').fullCalendar({
            fixedWeekCount:false,
            buttonIcons:false,
            buttonText:{
                prev:'上月',
                next:'下月',
                prevYear:'上一年',
                nextYear:'下一年',
                today:'今天',
            },
            customButtons: {
                myCustomButton: {
                    text: '批量设置价格',
                    click: function() {
                        $('#monthPriceSet').modal('show');
                        setTimeout(function(){
                            $('#monthPriceSet .fc-today-button').trigger('click');
                        },500);
                    }
                }
            },
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'prevYear,nextYear myCustomButton'
            },
            eventSources: [
                {
                    events: Plan.PlanInfo.Planstockquantitys,
                    className: 'eventSetted'
                }
            ],
            //events:Plan.PlanInfo.Planstockquantitys,
            dayClick:function(date, jsEvent, view){
                var dd = $.fullCalendar.formatDate(date,'YYYY年MM月DD日');
                var idtemp = $.fullCalendar.formatDate(date,'YYYY-MM-DD');
                var eventArr = view.options.eventSources[0].events;
                var now = new Date();
                if(Date.parse(date) < (Date.parse(now)-1000*60*60*24) ){
                    alert('时间已过期，不可用！');
                }else{
                    $('#dayPriceSet').modal();
                    $('#dayPriceSet .modal-title').html(dd);
                    $('#dayPriceSet .modal-title').attr('data-value',idtemp);
                    var flag = false;
                    var temp;
                    for(var i=0; i < eventArr.length; i++){
                        if(idtemp == eventArr[i].start){
                            flag = true;
                            temp = eventArr[i].prices;
                            break;
                        }
                    }
                    if(flag){
                        trStrEdit = '';
                        PriceListEdit(temp);
                    }else{
                        $('#dayPriceSet tbody').html(trStr);
                    }
                }
            },
            eventClick:function(eventData,jsEvent, view){
                //console.log(eventData)
                var dd = $.fullCalendar.formatDate(eventData.start,'YYYY年MM月DD日');
                var idtemp = $.fullCalendar.formatDate(eventData.start,'YYYY-MM-DD');
                $('#dayPriceSet').modal();
                $('#dayPriceSet .modal-title').html(dd);
                $('#dayPriceSet .modal-title').attr('data-value',idtemp);
                var temp = eventData.prices;
                PriceListEdit(temp);
            }
        });

        $('#dayPriceSet td .glyphicon-plus-sign').on('click',function(){
            var trLength = $('#dayPriceSet tr').length;
            if(trLength > 10){
                alert('最多只能设置10组报价，已达到最大值！');
            }else{
                $('#dayPriceSet tbody').append(trStr);
            }
        });
        $('#dayPriceSet').on('click',' td .glyphicon-minus-sign',function(){
            $(this).parent().parent().remove();
        });
        //读取设置的价格表单
        function getPrices(trTemp,prices){
            $.each(trTemp,function(x,y){
                var SpengName = $(this).find('td:eq(0) input').val();
                var AdutlPrice = $(this).find('td:eq(1) input').val();
                var KidPrice = $(this).find('td:eq(2) input').val();
                var stockQuantity = $(this).find('td:eq(3) input').val();
                if( SpengName != '' || AdutlPrice  != '' || KidPrice  != '' || stockQuantity  != '' ){
                    prices[x] = {
                        SpendName: SpengName,
                        AdultPrice: AdutlPrice,
                        KidPrice: KidPrice,
                        stockQuantity: stockQuantity
                    };
                }
            });
        }

        $('#dayPriceSet #dayConfirm').on('click',function(){
            var prices = [];
            var dayTime = $('#dayPriceSet .modal-title').attr('data-value');
            var trTemp = $('#dayPriceSet tbody tr');
            var dataTemp = {};
            getPrices(trTemp,prices);
            var eventArr = Plan.PlanInfo.Planstockquantitys;
            var flag = false;
            if(prices.length == 0){
                for(var i=0; i < eventArr.length; i++){
                    if(dayTime == eventArr[i].start){
                        Plan.PlanInfo.Planstockquantitys.splice(i,1);
                        break;
                    }
                }
            }else{
                for(var i=0; i < eventArr.length; i++){
                    if(dayTime == eventArr[i].start){
                        flag = true;
                        Plan.PlanInfo.Planstockquantitys[i].prices = prices;
                        break;
                    }
                }
                if(!flag){
                    dataTemp = {
                        scheduleDate: dayTime,
                        start:dayTime,
                        title:'已设置',
                        prices:prices
                    }
                    Plan.PlanInfo.Planstockquantitys.push(dataTemp);
                }
            }
            
            $('#dayPriceSet').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').css('display','none');
            $.rogerRefresh(Plan);            
        });

        //批量设置价格
        var selectDays = [];
        $('#calendar2').fullCalendar({
            fixedWeekCount:false,
            buttonIcons:false,
            buttonText:{
                prev:'上月',
                next:'下月',
                prevYear:'上一年',
                nextYear:'下一年',
                today:'今天',
            },
            selectable:true,
            customButtons: {
                myCustomButton: {
                    text: '全选',
                    click: function() {
                        var title = $('#monthPriceSet .fc-center h2').text();
                        var monthSelf = moment(title,'MMM YYYY','en').format('YYYY-MM');
                        var daysInMonth = moment(title, 'MMM YYYY','en').daysInMonth();
                        var eventData,i,start,istyle;
                        selectDays = [];
                        var now = new Date();
                        var nowMD = moment(now).format('YYYY-MM');
                        if(Date.parse(monthSelf) < Date.parse(nowMD)){
                            alert('当前月份已过期，请重新选择月份！')
                        }else{
                            var startDay = 1;
                            if(monthSelf == nowMD ){
                                startDay = now.getDate();
                            }
                            for( i=startDay; i <= daysInMonth; i++){
                                if(i <= 9){
                                    istyle = "-0" + i;
                                }else{
                                    istyle = "-" + i;
                                }
                                start = monthSelf + istyle;
                                eventData = {
                                    title: '已选中',
                                    id:i,
                                    start: start,
                                    //end: end,
                                    className:'eventStyle'
                                };
                                selectDays.push(eventData);
                            }
                            //console.log(eventData,i,start,istyle,selectDays);
                            var displayEv = Plan.PlanInfo.Planstockquantitys.concat(selectDays);
                            $('#calendar2').fullCalendar( 'removeEvents' );
                            $('#calendar2').fullCalendar('renderEvents', displayEv, true);
                            $('#calendar2').fullCalendar('unselect');
                        }
                    }
                },
                myCustomButton2: {
                    text: '取消全选',
                    click: function() {
                        selectDays = [];
                        $('#calendar2').fullCalendar( 'removeEvents' );
                        $('#calendar2').fullCalendar('renderEvents', Plan.PlanInfo.Planstockquantitys, true);
                        $('#calendar2').fullCalendar('unselect');
                    }
                },
                myCustomButton3:{
                    text: '清除本月',
                    click: function(){
                        var confirmRes = confirm('确认清除本月所有已设置数据吗？确认后数据无法恢复，请谨慎操作！');
                        if(confirmRes){
                            var title = $('#monthPriceSet .fc-center h2').text();
                            var monthSelf = moment(title,'MMM YYYY','en').format('YYYY-MM');
                            var daysInMonth = moment(title, 'MMM YYYY','en').daysInMonth();
                            var eventData,i,start,istyle;
                            deleteDays = [];
                            var now = new Date();
                            var nowMD = moment(now).format('YYYY-MM');
                            if(Date.parse(monthSelf) < Date.parse(nowMD)){
                                alert('当前月份已过期，请重新选择月份！')
                            }else{
                                var startDay = 1;
                                if(monthSelf == nowMD ){
                                    startDay = now.getDate();
                                }
                                for( i=startDay; i <= daysInMonth; i++){
                                    if(i <= 9){
                                        istyle = "-0" + i;
                                    }else{
                                        istyle = "-" + i;
                                    }
                                    start = monthSelf + istyle;
                                    deleteDays.push(start);
                                }
                                var eventAll = Plan.PlanInfo.Planstockquantitys;
                                for(var j = 0; j < deleteDays.length; j++){
                                    for(var k = 0; k < eventAll.length; k++){
                                        if(deleteDays[j] == eventAll[k].start){
                                            eventAll.splice(k,1);
                                            break;
                                        }
                                    }
                                }
                                $('#monthPriceSet').modal('hide');
                                $('body').removeClass('modal-open');
                                $('.modal-backdrop').css('display','none');
                                $.rogerRefresh(Plan);
                            }
                        }
                    }
                }
            },
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'prevYear,nextYear myCustomButton myCustomButton2 myCustomButton3'
            },
            eventSources: [
                {
                    events: Plan.PlanInfo.Planstockquantitys,
                    className: 'eventSetted'
                }
            ],
            dayClick:function(date, jsEvent, view, resourceObj){
                // var dd = $.fullCalendar.formatDate(date,'YYYY年MM月DD日');
                // var bgColor = $(this).css('background-color');
                // console.log(bgColor.toString());
                // if(bgColor == 'rgb(255, 0, 0)'){
                //     $(this).css('background-color', '#FFF');
                // }else{
                //     $(this).css('background-color', '#F00');
                // }
            },
            select: function( start, end, jsEvent, view,  resource ) {
                console.log(start._d);
                var id = start._d.getDate();
                var startDay = moment(start._d).format('YYYY-MM-DD');
                var eventData = {
                    title: '已选中',
                    id:id,
                    start: startDay,
                    //end: end,
                    className:'eventStyle'
                };
                console.log(id);
                var flag = 0;
                for(var i = 0; i < selectDays.length; i++){
                    if(selectDays[i].id == id){
                        selectDays.splice(i,1);
                        flag = 1;
                        break;
                    }
                }
                if(flag != 1){
                    selectDays.push(eventData);
                }
                console.log(selectDays);
                var displayEv = Plan.PlanInfo.Planstockquantitys.concat(selectDays);
                $('#calendar2').fullCalendar( 'removeEvents' );
                $('#calendar2').fullCalendar('renderEvents', displayEv, true);
                $('#calendar2').fullCalendar('unselect');
            },
        });

        $('#monthPriceSet').on('click',' td .glyphicon-plus-sign',function(){
            var trLength = $('#monthPriceSet #addPriceItem tbody tr').length;
            console.log(trLength);
            if(trLength > 10){
                alert('最多只能设置10组报价，已达到最大值！');
            }else{
                $('#monthPriceSet #addPriceItem tbody').append(trStr);
            }
        });
        $('#monthPriceSet').on('click',' td .glyphicon-minus-sign',function(){
            $(this).parent().parent().remove();
        });
        $('#monthPriceSet #monthConfirm').on('click',function(){
            var prices = [];
            var trTemp = $('#monthPriceSet #addPriceItem  tbody tr');
            getPrices(trTemp,prices);
            if(prices.length != 0){
                var eventArr = Plan.PlanInfo.Planstockquantitys;
                for(var n=0; n < selectDays.length; n++){
                    var dayTime = selectDays[n].start;
                    var dataTemp = {};
                    var flag = false;
                    for(var i=0; i < eventArr.length; i++){
                        if(dayTime == eventArr[i].start){
                            flag = true;
                            Plan.PlanInfo.Planstockquantitys[i].prices = prices;
                            break;
                        }
                    }
                    if(!flag){
                        dataTemp = {
                            scheduleDate: dayTime,
                            start:dayTime,
                            title:'已设置',
                            prices:prices
                        }
                        Plan.PlanInfo.Planstockquantitys.push(dataTemp);
                    }
                }
            }
            $('#monthPriceSet').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').css('display','none');
            $.rogerRefresh(Plan);            
        });
    }

    var ctrlTemplateplanNew = function(Plan, realView) {
        if(!Plan.PlanInfo.PlanSpendInfoList){
            if(Plan.PlanSpendInfoList.length == 0){
                Plan.PlanInfo.PlanSpendInfoList=[{
                    SpendName:'',
                    AdultPrice:0,
                    KidPrice:0
                }]
            }else{
                Plan.PlanInfo.PlanSpendInfoList = Plan.PlanSpendInfoList;
            }            
            $.rogerRefresh(Plan);
        }
        

        $('img[name="needPrefix"]').each(function () {
            var src = $(this).attr('src');
            if(src.indexOf('group1') > -1) {
                $(this).attr('src',Plan.IMGHOST+src);
            }
        })
        // Plan.createPrices = function(Plan,Prices){
        //     Prices.push({
        //             PriceName:'',
        //             AdultPrice:0,
        //             KidPrice:0
        //         });

        //     $.rogerRefresh(Plan);
        // };

        Plan.createDay = function(Plan, PlanSchedule){  //  PlanSchedule ==> data-pointer="/PlanInfo/PlanSchedule/-"
            PlanSchedule.push({
                Spot:[{CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:1,SpotPicUrl:''},
                    {CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:1,SpotPicUrl:''},
                    {CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:2,SpotPicUrl:''},
                    {CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:3,SpotPicUrl:''},
                    {CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:4,SpotPicUrl:''},
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

        //库存价格日历
        priceCalendarEdit(Plan);

        $('#save').rogerOnceClick(Plan, function(e){
            var item = getItemWithStartCityID(Plan.PlanInfo.PlanSchedule[0].Spot);
            if(item && item.CityID > 0) {
                if (!Plan.PlanInfo.PlanID) {
                    var data = {PlanInfo: e.data.PlanInfo};
                    data.PlanInfo.StartCityID = item.CityID;
                    data.PlanInfo.StartCity = item.CityNameCn;
                    data.PlanInfo.PlanPriceBase = data.PlanInfo.AdultPrice;
                    data.PlanInfo.Summary._PlanLabels = data.PlanInfo.Summary.PlanLabels.join();

                    minAdultPrice = 0;
                    minKidPrice = 0;
                    var index=0;
                    for(planSpendInfo in data.PlanInfo.PlanSpendInfoList){
                        index ++;
                        if(null == planSpendInfo.SpendName || '' == planSpendInfo.SpendName){
                            planSpendInfo.SpendName = "套餐" + index
                        }

                        bFindFlag = false;
                        //取第一个成人儿童价格
                        if (planSpendInfo.AdultPrice > 0 && !bFindFlag) {
                            minAdultPrice = planSpendInfo.AdultPrice;
                            minKidPrice = planSpendInfo.AidPrice;
                            bFindFlag = true;
                        }

                    }

                    data.PlanInfo.AdultPrice = minAdultPrice;
                    data.PlanInfo.KidPrice = minKidPrice;
                    $.rogerPost('/new/tmpplan', data, function (respJSON) {

                        if(respJSON.PlanInfo.insertId && data.PlanInfo.Planstockquantitys){
                            var PlanstockquantitysInsert = new Array();
                            Planstockquantitys = data.PlanInfo.Planstockquantitys;
                            for(var day in Planstockquantitys){
                                var PlanstockquantitysDay = Planstockquantitys[day];
                                var  scheduleDate = PlanstockquantitysDay["scheduleDate"];
                                scheduleDate = scheduleDate.replace(new RegExp("-","gm"),'');
                                var prices = PlanstockquantitysDay["prices"]
                                for(var pricesindex in prices){
                                    prices[pricesindex]["scheduleDate"] = scheduleDate;
                                    prices[pricesindex]["planID"] = respJSON.PlanInfo.insertId;;
                                    PlanstockquantitysInsert.push(prices[pricesindex]);
                                }

                            }

                            $.rogerPost('/new/stock', {info:{infoid:1,"Planstockquantitys":PlanstockquantitysInsert}}, function (respJSONInner) {
                                $.rogerNotice({Message: '模板方案成功'});
                                $('#show').removeClass("btn btn-warning invisible");
                                $('#show').addClass("btn btn-warning");
                                $('#show').click(function (e) {
                                    $.rogerLocation('#/templateplandetail?PlanID='+respJSON.PlanInfo.insertId);
                                })
                            });
                        }



                        //$('#show').attr('href',);
                    });
                } else {
                    $.rogerPost('/delete/plan', {PlanID: Plan.PlanInfo.PlanID}, function (respJSON) {
                        var data = {PlanInfo: e.data.PlanInfo};
                        data.PlanInfo.StartCityID = item.CityID;
                        data.PlanInfo.StartCity = item.CityNameCn;
                        data.PlanInfo.PlanPriceBase = data.PlanInfo.AdultPrice;
                        data.PlanInfo.Summary._PlanLabels = data.PlanInfo.Summary.PlanLabels.join();

                        minAdultPrice = 0;
                        minKidPrice = 0;
                        var index=0;
                        for(planSpendInfo in data.PlanInfo.PlanSpendInfoList){
                            index ++;
                            if(null == planSpendInfo.SpendName || '' == planSpendInfo.SpendName){
                                planSpendInfo.SpendName = "套餐" + index
                            }

                            bFindFlag = false;
                            //取第一个成人儿童价格
                            if (planSpendInfo.AdultPrice > 0 && !bFindFlag) {
                                minAdultPrice = planSpendInfo.AdultPrice;
                                minKidPrice = planSpendInfo.AidPrice;
                                bFindFlag = true;
                            }
                        }

                        data.PlanInfo.AdultPrice = minAdultPrice;
                        data.PlanInfo.KidPrice = minKidPrice;

                        $.rogerPost('/new/tmpplan', data, function (respJSON) {
                            $.rogerNotice({Message: '模板方案发布成功'});
                            $('#show').removeClass("btn btn-warning invisible");
                            $('#show').addClass("btn btn-warning");
                            $('#show').click(function (e) {
                                $.rogerLocation('#/templateplandetail?PlanID='+respJSON.PlanInfo.insertId);
                            })
                            //$('#show').attr('href','#/templateplandetail?PlanID='+respJSON.PlanInfo.insertId);
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

            orderdetail = e.data.OrderDetail;

            $.rogerPost('/publish/plan', {PlanID:Plan.PlanInfo.PlanID,Status:3}, function(respJSON){
                $.rogerNotice({Message:'模板方案已取消发布..'});
                $.rogerRefresh(Plan);
            });
        });

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };
    
    var ctrlShortplanNew = function(Plan, realView) {

        if(!Plan.PlanInfo.PlanSpendInfoList){
            if(Plan.PlanSpendInfoList.length == 0){
                Plan.PlanInfo.PlanSpendInfoList=[{
                    SpendName:'',
                    AdultPrice:0,
                    KidPrice:0
                }]
            }else{
                Plan.PlanInfo.PlanSpendInfoList = Plan.PlanSpendInfoList;
            }            
            $.rogerRefresh(Plan);
        }

        $('img[name="needPrefix"]').each(function () {
            var src = $(this).attr('src');
            if(src.indexOf('group1') > -1) {
                $(this).attr('src',Plan.IMGHOST+src);
            }
        });
        // Plan.createPrices = function(Plan,Prices){
        //     Prices.push({
        //             PriceName:'',
        //             AdultPrice:0,
        //             KidPrice:0
        //         });

        //     $.rogerRefresh(Plan);
        // };
        Plan.createDay = function(Plan, PlanShort){  //  PlanSchedule ==> data-pointer="/PlanInfo/PlanSchedule/-"
            PlanShort.push({Label:'', Day:PlanShort.length+1, Content:null, PicURL: null, PicEnable:false});
            $.rogerRefresh(Plan);
        };
        Plan.createPicture = function(Plan, PlanShort){  //  PlanSchedule ==> data-pointer="/PlanInfo/PlanSchedule/-"
            PlanShort.push({Label:null, Day:null, Content:null, PicURL: null, PicEnable:true});
            $.rogerRefresh(Plan);
        };
        Plan.createContent = function(Plan, PlanShort){  //  PlanSchedule ==> data-pointer="/PlanInfo/PlanSchedule/-"
            PlanShort.push({Label:null, Day:null, Content:'desc', PicURL: null, PicEnable:false});
            $.rogerRefresh(Plan);
        };
        Plan.createCity = function (Plan, CityID) {
            $.rogerTrigger('#modal', '#/citychooser2', {Plan:Plan, CityID:CityID});
        };

        //库存价格日历
        priceCalendarEdit(Plan);


        $('#save').rogerOnceClick(Plan, function(e){
            if(!Plan.PlanInfo.PlanID) {
                var data = {PlanInfo:e.data.PlanInfo};
                data.PlanInfo.Summary._PlanLabels = data.PlanInfo.Summary.PlanLabels.join();
                data.PlanInfo.PlanPriceBase = data.PlanInfo.AdultPrice;

                minAdultPrice = 0;
                minKidPrice = 0;
                var index=0;
                for(planSpendInfo in data.PlanInfo.PlanSpendInfoList){
                    index ++;
                    if(null == planSpendInfo.SpendName || '' == planSpendInfo.SpendName){
                        planSpendInfo.SpendName = "套餐" + index
                    }

                    bFindFlag = false;
                    //取第一个成人儿童价格
                    if (planSpendInfo.AdultPrice > 0 && !bFindFlag) {
                        minAdultPrice = planSpendInfo.AdultPrice;
                        minKidPrice = planSpendInfo.AidPrice;
                        bFindFlag = true;
                    }
                }

                data.PlanInfo.AdultPrice = minAdultPrice;
                data.PlanInfo.KidPrice = minKidPrice;

                $.rogerPost('/new/shortplan', data, function(respJSON){

                    if(respJSON.PlanInfo.insertId && data.PlanInfo.Planstockquantitys){
                        var PlanstockquantitysInsert = new Array();
                        Planstockquantitys = data.PlanInfo.Planstockquantitys;
                        for(var day in Planstockquantitys){
                            var PlanstockquantitysDay = Planstockquantitys[day];
                            var  scheduleDate = PlanstockquantitysDay["scheduleDate"];
                            scheduleDate = scheduleDate.replace(new RegExp("-","gm"),'');
                            var prices = PlanstockquantitysDay["prices"]
                            for(var pricesindex in prices){
                                prices[pricesindex]["scheduleDate"] = scheduleDate;
                                prices[pricesindex]["planID"] = respJSON.PlanInfo.insertId;;
                                PlanstockquantitysInsert.push(prices[pricesindex]);
                            }

                        }

                        $.rogerPost('/new/stock', {info:{infoid:1,"Planstockquantitys":PlanstockquantitysInsert}}, function (respJSONInner) {
                            $.rogerNotice({Message: '快捷方案发布成功'});
                            $('#show').removeClass("btn btn-warning invisible");
                            $('#show').addClass("btn btn-warning");
                            $('#show').click(function (e) {
                                $.rogerLocation('#/shortplandetail?PlanID='+respJSON.PlanInfo.insertId);
                            })
                        });
                    }


                    //$('#show').attr('href','#/shortplandetail?PlanID='+respJSON.PlanInfo.insertId);
                });
            }else {
                var data = {PlanInfo:e.data.PlanInfo};
                data.PlanInfo.Summary._PlanLabels = data.PlanInfo.Summary.PlanLabels.join();
                data.PlanInfo.PlanPriceBase = data.PlanInfo.AdultPrice;
                $.rogerPost('/delete/plan', {PlanID:data.PlanInfo.PlanID}, function(respJSON){

                    minAdultPrice = 0;
                    minKidPrice = 0;
                    var index=0;
                    for(planSpendInfo in data.PlanInfo.PlanSpendInfoList){
                        index ++;
                        if(null == planSpendInfo.SpendName || '' == planSpendInfo.SpendName){
                            planSpendInfo.SpendName = "套餐" + index
                        }

                        bFindFlag = false;
                        //取第一个成人儿童价格
                        if (planSpendInfo.AdultPrice > 0 && !bFindFlag) {
                            minAdultPrice = planSpendInfo.AdultPrice;
                            minKidPrice = planSpendInfo.AidPrice;
                            bFindFlag = true;
                        }
                    }

                    data.PlanInfo.AdultPrice = minAdultPrice;
                    data.PlanInfo.KidPrice = minKidPrice;

                    $.rogerPost('/new/shortplan', data, function(respJSON){
                        $.rogerNotice({Message:'快捷方案发布成功'});
                        $('#show').removeClass("btn btn-warning invisible");
                        $('#show').addClass("btn btn-warning");
                        $('#show').click(function (e) {
                            $.rogerLocation('#/shortplandetail?PlanID='+respJSON.PlanInfo.insertId);
                        });
                        //$('#show').attr('href','#/shortplandetail?PlanID='+respJSON.PlanInfo.insertId);
                    });
                });
            }
        });

        $('#publish').rogerOnceClick(Plan, function(e){
            $.rogerPost('/publish/plan', {PlanID:Plan.PlanInfo.PlanID,Status:1}, function(respJSON){
                $.rogerNotice({Message:'模板方案待审核..'});
                $.rogerRefresh(Plan);
            });
        });
        $('#cancel').rogerOnceClick(Plan, function(e){
            $.rogerPost('/publish/plan', {PlanID:Plan.PlanInfo.PlanID,Status:3}, function(respJSON){
                $.rogerNotice({Message:'模板方案已取消发布..'});
                $.rogerRefresh(Plan);
            });
        });

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };

    var pageclick = function() {

        $('[name=page]').click(function (e) {
            clickpage = $(this).data("value");
            //前一页
            if(clickpage == 'p'){
                if(page > 1){
                    page = page-1;
                } else {
                    return;
                }
                //后一页
            } else if(clickpage == 'n'){
                if(page < $('[name=page]').length-2){
                    page = page+1;
                } else {
                    return;
                }
                //当前页
            } else if( page == clickpage){
                return;
                //其他
            } else {
                page = clickpage;
            }
            pamaeta["pagestart"] = (page-1)*8;
            pamaeta["page"] = page;

            url = $.rogerGetPath() || window.location.hash;


            $.rogerTrigger('#app',url, pamaeta);
        });
    };

    var ctrlFacilityList = function(response, realView) {
        console.log(response);
        bindRidoesForSwitch();
        realView.rogerCropImages();
        pageclick();

    };

    var ctrlDelicacyDetail = function(response, realView) {
        var usr = $.rogerGetLoginUser();
        $('#release').rogerOnceClick(response, function (e) {
                temp = e.data.SpotDetail[0];
                var status = $('#release').data("status")
                //1,隐藏，2发布
                $.rogerPost('/update/spots/status', {Status: status, SpotsID: temp.SpotsID}, function (respJSON) {
                    $.rogerNotice({Message: '发布成功'});

                });
            }
        );

        $('#edit').rogerOnceClick(response, function (e) {
                temp = e.data.SpotDetail[0];
                $.rogerLocation('#/delicacyedit?SpotsID='+temp.SpotsID+"&spotType=2");
            }
        );

        $('#delete').rogerOnceClick(response, function (e) {
            var del = confirm("确定要删除吗？删除后数据无法恢复，请谨慎操作！");
            if(del){
                temp = e.data.SpotDetail[0];
                $.rogerPost('/delete/spots', {SpotsID:temp.SpotsID}, function (respJSON) {
                    $.rogerNotice({Message: '删除成功'});
                    $.rogerLocation('#/delicacy'+"?UserID="+usr.UserID);
                });
            }
        });

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };

    var ctrlAccommodationDetail = function(response, realView) {
        var usr = $.rogerGetLoginUser();
        $('#release').rogerOnceClick(response, function (e) {
            temp = e.data.SpotDetail[0];
            var status = $('#release').data("status")
            //1,隐藏，2发布
            $.rogerPost('/update/spots/status', {Status: status, SpotsID: temp.SpotsID}, function (respJSON) {
                $.rogerNotice({Message: '发布成功'});

            });
        });

        $('#edit').rogerOnceClick(response, function (e) {
                    temp = e.data.SpotDetail[0];
                $.rogerLocation('#/accommodationedit?SpotsID='+temp.SpotsID+"&spotType=3");
            }
        );

        $('#delete').rogerOnceClick(response, function (e) {
            var del = confirm("确定要删除吗？删除后数据无法恢复，请谨慎操作！");
            if(del){
                temp = e.data.SpotDetail[0];
                $.rogerPost('/delete/spots', {SpotsID:temp.SpotsID}, function (respJSON) {
                    $.rogerNotice({Message: '删除成功'});
                    $.rogerLocation('#/accommodation'+"?UserID="+usr.UserID);
                });
            }
        });

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };

    var ctrlAttractionDetail = function(response, realView) {
        var usr = $.rogerGetLoginUser();
        $('#release').rogerOnceClick(response, function (e) {
                temp = e.data.SpotDetail[0];
                var status = $('#release').data("status")
            //1,隐藏，2发布
            $.rogerPost('/update/spots/status', {Status: status, SpotsID: temp.SpotsID}, function (respJSON) {
                $.rogerNotice({Message: '发布成功'});
                $.rogerLocation('#/attraction'+"?UserID="+usr.UserID);
            });
            }
        );

        $('#edit').rogerOnceClick(response, function (e) {
                temp = e.data.SpotDetail[0];
                $.rogerLocation('#/attractionedit?SpotsID='+temp.SpotsID+"&spotType=1");
            }
        );

        $('#delete').rogerOnceClick(response, function (e) {
            var del = confirm("确定要删除吗？删除后数据无法恢复，请谨慎操作！");
            if(del){
                temp = e.data.SpotDetail[0];
                $.rogerPost('/delete/spots', {SpotsID:temp.SpotsID}, function (respJSON) {
                    $.rogerNotice({Message: '删除成功'});
                    $.rogerLocation('#/attraction'+"?UserID="+usr.UserID);
                });
            }
        });

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };

    var ctrlOrderlist = function(response, realView) {
        var usr = $.rogerGetLoginUser();
        var Avatar = $.rogerImgHost() + usr.AvatarPicURL;
        $('.avatar img').attr('src', Avatar);

        // $('#personInfo').rogerOnceClick( null, function () {
        //     $.rogerLocation('#/userinfo?UserID='+usr.UserID);
        // });
        $('#orderList').rogerOnceClick( null, function () {
            $.rogerLocation('#/orderlist?userID='+usr.UserID+'&usertype=2&status=0&page=1');
        });
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

        $('.confirm').on('click',function () {
            var orderid= $(this).data('id');
            var status= $(this).data('status');
            var user = $.rogerGetLoginUser();
            if('2'==status) {
                $.rogerPost('/update/order',{OrderID:orderid,Status:3, CloseReason:'',OperateDesc:'',OperateUserID:user.UserID},function () {
                    $.rogerRefresh();
                });
            }
            if('5'==status) {
                $.rogerPost('/update/order',{OrderID:orderid,Status:5,CloseReason:'导游拒绝接单',OperateUserID:user.UserID},function () {
                    $.rogerRefresh();
                });
            }
            if('3'==status) {

                $.rogerPost('/update/order',{OrderID:orderid,Status:4, CloseReason:'',OperateDesc:'',OperateUserID:user.UserID},function () {
                    $.rogerRefresh();
                });
            }
        });

        pageclick();

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };

    var initUserInfoDetail = function(PS, realView){
         var usr =$.rogerGetLoginUser();
         var returnvalue = {
             DetailMain:{},
             IMGHOST: $.rogerImgHost()
         };
         $.rogerPost('/guideDetail', {UserID: usr.UserID}, function (respJSON) {
             returnvalue.DetailMain = respJSON.datas;
             $.rogerRefresh(returnvalue);
         });
         return returnvalue;
     };

    var ctrlUserInfoDetail = function(response, realView) {
         $('#edit').rogerOnceClick(response, function (e) {
                 temp = e.data.DetailMain[0];
                 $.rogerLocation('#/userinfoedit');
             }
         );
         bindRidoesForSwitch();
         realView.rogerCropImages();
    };

    var initUserInfoEdit = function(PS, realView){
        var usr =$.rogerGetLoginUser();
        var returnvalue = {
            DetailMain:{},
            IMGHOST: $.rogerImgHost()
        };
        $.rogerPost('/guideDetail', {UserID: usr.UserID}, function (respJSON) {
            returnvalue.DetailMain = respJSON.datas;
            returnvalue.DetailMain.labels = respJSON.datas.labels.split(';');
            if(returnvalue.DetailMain.labels[returnvalue.DetailMain.labels.length-1] == ''){
                returnvalue.DetailMain.labels.pop();
            }
            if(respJSON.datas.telsForshow == null || (respJSON.datas.telsForshow && respJSON.datas.telsForshow.length == 0)){
                returnvalue.DetailMain.telsForshow = [
                    {
                        item1:'',
                        item2:'',
                        item3:'',
                        item4:''
                    }
                ];
            }
            if(respJSON.datas.hasLanguageForshow == null || (respJSON.datas.hasLanguageForshow && respJSON.datas.hasLanguageForshow.length == 0)){
                returnvalue.DetailMain.hasLanguageForshow = [
                    {
                        item1:'',
                        item2:'',
                        item3:'',
                        item4:''
                    }
                ];
            }
            if(respJSON.datas.drivingLicensesForshow == null || (respJSON.datas.drivingLicensesForshow && respJSON.datas.drivingLicensesForshow.length == 0)){
                returnvalue.DetailMain.drivingLicensesForshow = [
                    {
                        item1:'',
                        item2:'',
                        item3:'',
                        item4:''
                    }
                ];
            }
            if(respJSON.datas.skillsForshow == null || (respJSON.datas.skillsForshow && respJSON.datas.skillsForshow.length == 0)){
                returnvalue.DetailMain.skillsForshow = [
                    {
                        item1:'',
                        item2:'',
                        item3:'',
                        item4:''
                    }
                ];
            }
            if(respJSON.datas.interestForshow == null || (respJSON.datas.interestForshow && respJSON.datas.interestForshow.length == 0)){
                returnvalue.DetailMain.interestForshow = [
                    {
                        item1:'',
                        item2:'',
                        item3:'',
                        item4:''
                    }
                ];
            }
            
            $.rogerRefresh(returnvalue);
        });
        return returnvalue;
    };

    var ctrlUserInfoEdit = function(response, realView) {
        response.createLabel = function (User) {
            response.DetailMain.labels.push('');
            $.rogerRefresh(User);
        };
        $('input[name="sex"]').on('change',function(){
            var val=$(this).val();
            response.DetailMain.sex = val;
        });
        flatpickr(".flatpickr");
        $('.flatpickr-calendar').css('width','330px');

        response.createCity = function (response) {
            $.rogerTrigger('#modal', '#/citychooser6', {response:response});
        };
        response.createCity2 = function (response) {
            $.rogerTrigger('#modal', '#/citychooser7', {response:response});
        };
        response.createCountry = function (response) {
            $.rogerTrigger('#modal', '#/countrychooser', {response:response});
        };
        response.createTels = function(response){
            response.DetailMain.telsForshow.push({
                item1:'',
                item2:'',
                item3:'',
                item4:''
            });
            $.rogerRefresh(response);
        };
        response.createLanguages = function(response){
            response.DetailMain.hasLanguageForshow.push({
                item1:'',
                item2:'',
                item3:'',
                item4:''
            });
            $.rogerRefresh(response);
        };
        response.createdrivingLicenses = function(response){
            response.DetailMain.drivingLicensesForshow.push({
                item1:'',
                item2:'',
                item3:'',
                item4:''
            });
            $.rogerRefresh(response);
        };
        response.createskills = function(response){
            response.DetailMain.skillsForshow.push({
                item1:'',
                item2:'',
                item3:'',
                item4:''
            });
            $.rogerRefresh(response);
        };
        response.createinterests = function(response){
            response.DetailMain.interestForshow.push({
                item1:'',
                item2:'',
                item3:'',
                item4:''
            });
            $.rogerRefresh(response);
        };

        $('#userUpdate').rogerOnceClick(response,function(e){

            function changeFormat(forShow, str, x){
                var i,j;
                response.DetailMain[str] = '';
                for(i=0; i<response.DetailMain[forShow].length; i++){
                    for(j=1; j<5; j++){
                        if(response.DetailMain[forShow][i]['item'+j]){
                            response.DetailMain[str] += response.DetailMain[forShow][i]['item'+j];
                            if(j==x){
                                response.DetailMain[str] += ';'
                            }else{
                                response.DetailMain[str] += ':'
                            }
                        }
                    }
                }
                // console.log(response.DetailMain[str]);
                // response.DetailMain[str].replace('/\:+/g',':');
                // console.log(response.DetailMain[str]);
                // response.DetailMain[str].replace('/\:\;/g',';');
                // console.log(response.DetailMain[str]);
            }
            changeFormat('telsForshow', 'tels',3);
            changeFormat('hasLanguageForshow', 'hasLanguage',3);
            changeFormat('skillsForshow', 'skills',3);
            changeFormat('drivingLicensesForshow', 'drivingLicenses',4);
            changeFormat('interestForshow', 'interest',2);

            if(response.DetailMain.avatarPicURL && response.DetailMain.avatarPicURL.indexOf('group1/') == -1){
                var avatarPicBase64 = response.DetailMain.avatarPicURL;
            }
            if(response.DetailMain.mainPageLogoURL && response.DetailMain.mainPageLogoURL.indexOf('group1/') == -1){
                var mainPageLogoBase64 = response.DetailMain.mainPageLogoURL;
            }
            if(response.DetailMain.coverPicURL && response.DetailMain.coverPicURL.indexOf('group1/') == -1){
                var coverPicBase64 = response.DetailMain.coverPicURL;
            }else if(response.DetailMain.coverPicURL.indexOf('group1/') != -1){
                var coverPicUrl = response.DetailMain.coverPicURL;
            }
            if(response.DetailMain.picurls.length > 0 ){
                var filesBase64 = [],filesUrl = [];
                for(var m =0; m < response.DetailMain.picurls.length; m++ ){
                    if( response.DetailMain.picurls[m].indexOf('group1/') == -1 ){
                        filesBase64.push(response.DetailMain.picurls[m]);
                    }else{
                        filesUrl.push(response.DetailMain.picurls[m]);
                    }
                }
            }

            if(!response.DetailMain.scheduleList){response.DetailMain.scheduleList = [];}
            if(!response.DetailMain.guiderList){response.DetailMain.guiderList = [];}
            if(!response.DetailMain.travelPlaceList){response.DetailMain.travelPlaceList = [];}
            if(!response.DetailMain.facilitiesModelList){response.DetailMain.facilitiesModelList = [];}
            if(!response.DetailMain.planList){response.DetailMain.planList = [];}
            if(!response.DetailMain.serviceList){response.DetailMain.serviceList = [];}
            if(!response.DetailMain.travelFoodList){response.DetailMain.travelFoodList = [];}
            if(!response.DetailMain.travelHotelList){response.DetailMain.travelHotelList = [];}
            if(!response.DetailMain.travelSpotsList){response.DetailMain.travelSpotsList = [];}
            if(!response.DetailMain.verifyPhotoUrls){response.DetailMain.verifyPhotoUrls = [];}
            var data = {
                "appType": "",
                "commandid": 0,
                "coverPicBase64": coverPicBase64,
                "coverPicUrl": coverPicUrl,
                "filesBase64": filesBase64,
                "filesUrl": filesUrl,
                "avatarPicBase64": avatarPicBase64,
                "mainPageLogoBase64": mainPageLogoBase64,
                "guider": response.DetailMain
            };
            data.guider.labels = response.DetailMain.labels.join(';');
            $.rogerPost('/guideDetail/update',data,function(data){
                alert('保存成功！');
                $.rogerLocation('#/userinfodetail');
            });
        });

        $('#userBack').rogerOnceClick(response,function(e){
            $.rogerLocation('#/userinfodetail');
        });

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };

    var ctrlServicedetail = function (response, realView) {
        // 车辆与装备轮播图初始化
        $('.vmcarousel-centered-infitine').vmcarousel({
           centered: true,
           start_item: 1,
           autoplay: false,
           infinite: true
        });
        var usr = $.rogerGetLoginUser();

        //包车详情页
        var disday = [];
        for(var i=0; i<response.VehicleSchedule.length; i++){
            disday.push(response.VehicleSchedule[i].scheduleFormatTime);
        }

        var pickr = $("#calendarDetail").flatpickr({
            inline: true,
            mode: "multiple",
            disable: disday,
            minDate: new Date()
        });

        $('#release').rogerOnceClick(response, function (e) {
                temp = e.data.DetailMain[0];
                var status = $('#release').data("status")
            //3,隐藏，4发布
                $.rogerPost('/update/service/status', {Status: status, ServiceId: temp.serviceID}, function (respJSON) {
                    $.rogerNotice({Message: '发布成功'});

                });
            }
        );

        $('#edit').rogerOnceClick(response, function (e) {
                temp = e.data.DetailMain[0];
                if (temp.serviceTypeID == 1) {
                    //包车
                    $.rogerLocation('#/servicecaredit?ServiceID=' + temp.serviceID);
                } else if (temp.serviceTypeID == 3 || temp.serviceTypeID == 4) {
                    //接机送机
                    $.rogerLocation('#/servicepickupedit?ServiceID=' + temp.serviceID);
                } else if (temp.serviceTypeID == 5) {
                    //租车
                    $.rogerLocation('#/caredit?ServiceID=' + temp.serviceID);
                } else if (temp.serviceTypeID == 6) {
                    //活动
                    $.rogerLocation('#/activityedit?ServiceID=' + temp.serviceID);
                    //其他
                } else {
                    $.rogerLocation('#/serviceotheredit?ServiceID=' + temp.serviceID);
                }

            }
        );
        // //租车
        // $('#editCar').rogerOnceClick(response, function (e) {
        //         temp = e.data.DetailMain[0];
        //         $.rogerLocation('#/caredit?ServiceID='+temp.serviceID);
        //     }
        // );
        // //接送机
        // $('#editPickup').rogerOnceClick(response, function (e) {
        //         temp = e.data.DetailMain[0];
        //         $.rogerLocation('#/servicepickupedit?ServiceID='+temp.serviceID);
        //     }
        // );
        // //其他服务类
        // $('#editOther').rogerOnceClick(response, function (e) {
        //         temp = e.data.DetailMain[0];
        //         $.rogerLocation('#/serviceotheredit?ServiceID='+temp.serviceID);
        //     }
        // );

        $('#delete').rogerOnceClick(response, function (e) {
            var del = confirm("确定要删除吗？删除后数据无法恢复，请谨慎操作！");
            if(del){
                temp = e.data.DetailMain[0];
                $.rogerPost('/delete/service', {ServiceId:temp.serviceID}, function (respJSON) {
                    $.rogerNotice({Message: '删除成功'});
                    if (temp.serviceTypeID == 6) {
                        $.rogerLocation('#/activiy'+"?UserID="+usr.UserID);
                    }else if(temp.serviceTypeID == 5){
                        $.rogerLocation('#/car'+"?UserID="+usr.UserID);
                    }else{
                        $.rogerLocation('#/service'+"?UserID="+usr.UserID);
                    }
                });
            }
        });

        realView.rogerCropImages();

    };

    var ctrlFacilityDetail = function(response, realView) {

        console.log(JSON.stringify(response));

        $('#edit').rogerOnceClick(response, function (e) {
                temp = e.data.Facility[0];
                $.rogerLocation('#/equipedit?facilityID='+temp.facilityID);
            }
        );

        $('#delete').rogerOnceClick(response, function (e) {
            var del = confirm("确定要删除吗？删除后数据无法恢复，请谨慎操作！");
            if(del){
                temp = e.data.Facility[0];
                var usr =$.rogerGetLoginUser();
                $.rogerPost('/delete/facility', {facilityID:temp.facilityID}, function (respJSON) {
                    $.rogerNotice({Message: '删除成功'});
                    $.rogerLocation('#/facilitylist'+"?UserID="+usr.UserID);
                });
            }
        });
        bindRidoesForSwitch();
        realView.rogerCropImages();
    };

    var ctrlTravelogueDetail = function(response, realView) {

        var user = $.rogerGetLoginUser();
        $('#publish').rogerOnceClick(response, function(e){
            temp = e.data.Travelogue[0];
            var status = $('#publish').data("status")
            $.rogerPost('/update/travelogue/status', {articleID:temp.articleID,STATUS:status}, function(respJSON){
                $.rogerNotice({Message:'操作攻略成功'});
                if(respJSON){
                    //跳转到详情页面
                    $.rogerLocation('#/travelogue?UserID='+user.UserID+'&page=1');
                }
            });
        });

        $('#delete').rogerOnceClick(response, function(e){
            temp = e.data.Travelogue[0];
            var status = $('#publish').data("status")
            $.rogerPost('/delete/travelogue', {articleID:temp.articleID}, function(respJSON){
                $.rogerNotice({Message:'删除攻略成功'});
                if(respJSON){
                    //跳转到详情页面
                    $.rogerLocation('#/travelogue?UserID='+user.UserID+'&page=1');
                }
            });
        });

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };



    var initAttractionEdit=function(){
        var SpotsID = $.rogerGetUrlParam('SpotsID');
        spotType = $.rogerGetUrlParam('spotType');
        var usr =$.rogerGetLoginUser();
        var returnvalue = {
            SpotDetail:
            {
                SpotsID:'' ,
                UserID:usr.UserID ,
                CountryID:'' ,
                CityID:'' ,
                SpotsTypeID:spotType ,
                CommondReason: '' ,
                CreateDate:'' ,
                SpotsType:'' ,
                NameEn:'' ,
                NameCh:'',
                Status:'',
                UpdateDate: '' ,
                Flavor:'' ,
                PicURL:''  ,
                Address:'' ,
                ZipCode:'' ,
                ZoneCode:'' ,
                Tel:'' ,
                Description:'' ,
                Price:''  ,
                Score: '' ,
                LocalName: '',
                Alias:'' ,
                comment: '' ,
                TravelTime:'' ,
                CountryName:'' ,
                CityName: '',
                picURLs:{picURLs:[]},
                SpotLabels: {
                    LabelIDs:[],
                    Labels:[],
                },
                ClassifyLabels:[]
            },
            IMGHOST: $.rogerImgHost()
        };

        $.rogerPost('/dashboard/product/attraction/detail', {"spotType":spotType,"spotsID": SpotsID, "userID": usr.UserID}, function (respJSON, reqJSON) {
            if(respJSON){
                if (null != respJSON["SpotDetail"] && respJSON["SpotDetail"].length > 0) {
                    var spotdetail = respJSON["SpotDetail"][0];

                    if (null == respJSON["SpotPics"] || '' == respJSON["SpotPics"] || respJSON["SpotPics"].length==0) {
                        spotdetail["picURLs"]=returnvalue["SpotDetail"]["picURLs"]

                    }else {

                        picURLs = [];
                        for( key in respJSON["SpotPics"]){
                            picURLs.push(respJSON["SpotPics"][key].PicURL);
                            // spotdetail["picURLs"]["picURLs"][key]=respJSON["SpotPics"][key].PicURL

                        }
                        spotdetail["picURLs"]={"picURLs":picURLs};
                    }

                    if (null == respJSON["SpotLabels"] || '' == respJSON["SpotLabels"] || respJSON["SpotLabels"].length==0) {
                        spotdetail["SpotLabels"]=returnvalue["SpotDetail"]["SpotLabels"]

                    }else {

                        LabelIDs = [];
                        Labels=[];
                        for( key in respJSON["SpotLabels"]){
                            LabelIDs.push(respJSON["SpotLabels"][key]["ClassifyLabelID"]);
                            Labels.push(respJSON["SpotLabels"][key]["ClassifyLabel"])
                        }
                        spotdetail["SpotLabels"]={"LabelIDs":LabelIDs,"Labels":Labels};
                    }

                    returnvalue = {"SpotDetail":spotdetail}

                    console.log(returnvalue["SpotDetail"])

                }
                if (null != respJSON["ClassifyLabels"] && '' != respJSON["ClassifyLabels"]) {
                     returnvalue['SpotDetail']["ClassifyLabels"] = respJSON["ClassifyLabels"];
                 }
            }

            $.rogerRefresh(returnvalue);
        });

        return returnvalue;
    },ctrlAttractionEdit=function(Spots, realView){

        Spots.createLabel = function(Spots, Labels){
            var newLabel = [];
            var newLabelID = [];
            $('#attrLabel li input').each(function(){
                if ($(this).prop('checked')) {
                    var temp = $(this).next().text();
                    var tempID = $(this).val();
                    newLabel.push(temp);
                    newLabelID.push(tempID);
                }
            });

            Spots.SpotDetail.SpotLabels.LabelIDs = Spots.SpotDetail.SpotLabels.LabelIDs.concat(newLabelID);
            Spots.SpotDetail.SpotLabels.Labels = Spots.SpotDetail.SpotLabels.Labels.concat(newLabel);
            console.log(Spots);
            $.rogerRefresh(Spots);
        };
        $('#labelConfirm').on('click',function(){
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        });


        Spots.createCity = function (Spots) {
            $.rogerTrigger('#modal', '#/citychooser3', {Spots:Spots});
        };

        $('#save').rogerOnceClick(Spots, function(e){

            temp = e.data.SpotDetail;
            tempSpotLabels = []
            if(null != temp.SpotLabels.LabelIDs && 0< temp.SpotLabels.LabelIDs.length){
                for(key in temp.SpotLabels.LabelIDs){
                    tempSpotLabels.push({LabelID:temp.SpotLabels.LabelIDs[key],SpotsID:temp.SpotsID})
                }
            }
            if(null != temp.SpotsID && '' != temp.SpotsID){
                var data = {
                    DeleteSpotsPics:temp,
                    DeleteTravelSpotsLabel:temp,
                    SpotDetail:temp,
                    picURLs:{picURLs:temp.picURLs.picURLs,SpotsID:temp.SpotsID},
                    SpotLabels:tempSpotLabels,
                    // file:filedata,
                    // coverFile:coverFiledata,
                    IMGHOST:e.data.IMGHOST
                };
                $.rogerPost('/update/spots', data, function(respJSON){
                    $.rogerNotice({Message:'修改成功'});
                    if(respJSON){
                        //跳转到详情页面
                        if(temp.SpotsTypeID==1){
                            $.rogerLocation('#/attractiondetail?spotsID='+temp.SpotsID);
                        }else if(temp.SpotsTypeID==2){
                            $.rogerLocation('#/delicacydetail?spotsID='+temp.SpotsID);
                        }else if(temp.SpotsTypeID==3){
                            $.rogerLocation('#/accommodationdetail?spotsID='+temp.SpotsID);
                        }
                    }
                });
            } else {
                temp["SpotLabels"]=tempSpotLabels;
                temp["Status"]=1;
                var data = {
                    SpotDetail:temp,
                    // file:filedata,
                    // coverFile:coverFiledata,
                    IMGHOST:e.data.IMGHOST
                };
                $.rogerPost('/new/spots', data, function(respJSON){
                    $.rogerNotice({Message:'保存成功'});

                    if(respJSON){
                        //跳转到详情页面
                        if(temp.SpotsTypeID==1){
                            $.rogerLocation('#/attractiondetail?spotsID='+respJSON.SpotDetail.insertId);
                        }else if(temp.SpotsTypeID==2){
                            $.rogerLocation('#/delicacydetail?spotsID='+respJSON.SpotDetail.insertId);
                        }else if(temp.SpotsTypeID==3){
                            $.rogerLocation('#/accommodationdetail?spotsID='+respJSON.SpotDetail.insertId);
                        }
                    }

                });
            }

        });

        // $('#publish').rogerOnceClick(Spots, function(e){
        //     console.data.log('publish');
        //
        //     temp = e.data.SpotDetail;
        //
        //     if(null != temp.SpotsID && '' != temp.SpotsID){
        //         tempSpotLabels = []
        //         if(null != temp.SpotLabels.LabelIDs && 0< temp.SpotLabels.LabelIDs.length){
        //             for(key in temp.SpotLabels.LabelIDs){
        //                 tempSpotLabels.push({LabelID:temp.SpotLabels.LabelIDs[0],SpotsID:temp.SpotsID})
        //             }
        //         }
        //
        //
        //         var data = {
        //             DeleteSpotsPics:temp,
        //             DeleteTravelSpotsLabel:temp,
        //             SpotDetail:temp,
        //             picURLs:{picURLs:temp.picURLs.picURLs,SpotsID:temp.SpotsID},
        //             SpotLabels:tempSpotLabels,
        //             // file:filedata,
        //             // coverFile:coverFiledata,
        //             IMGHOST:e.data.IMGHOST
        //         };
        //
        //         temp["Status"]=2;
        //
        //         $.rogerPost('/update/spots', data, function(respJSON){
        //             $.rogerNotice({Message:'景点发布成功'});
        //
        //         });
        //     } else {
        //
        //         temp["Status"]=2;
        //         var data = {
        //             SpotDetail:temp,
        //             // file:filedata,
        //             // coverFile:coverFiledata,
        //             IMGHOST:e.data.IMGHOST
        //         };
        //         $.rogerPost('/new/spots', data, function(respJSON){
        //             $.rogerNotice({Message:'景点发布成功'});
        //
        //         });
        //     }
        //
        //
        //
        //
        // });

        bindRidoesForSwitch();
        realView.rogerCropImages();
    } ;

    //服务描述图文编辑模块
     function serviceDescDetail(TraveLogue,TravelogueDetail){
         TraveLogue.createDay = function(TraveLogue, TravelogueDetail){  //  PlanSchedule ==> data-pointer="/PlanInfo/PlanSchedule/-"
             TravelogueDetail.push({label:' ', DAY:'0', content:null, picURL: null});
             $.rogerRefresh(TraveLogue);
         };
         TraveLogue.createPicture = function(TraveLogue, TravelogueDetail){  //  PlanSchedule ==> data-pointer="/PlanInfo/PlanSchedule/-"
             TravelogueDetail.push({label:null, DAY:null, content:null, picURL: null, PE:true});
             $.rogerRefresh(TraveLogue);
         };
         TraveLogue.createContent = function(TraveLogue, TravelogueDetail){  //  PlanSchedule ==> data-pointer="/PlanInfo/PlanSchedule/-"
             TravelogueDetail.push({label:null, DAY:null, content:' ', picURL: null});
             $.rogerRefresh(TraveLogue);
         };

         TraveLogue.insertDay = function(TraveLogue, TravelogueDetail){
             var indexInsert;
             $('.functionBtn').on('click','li',function(e){
                 indexInsert = $(this).attr('data-index');
                 TravelogueDetail.splice(indexInsert + 1,0,{label:' ', DAY:'0', content:null, picURL: null});
                 $.rogerRefresh(TraveLogue);
             });
         };
         TraveLogue.insertPicture = function(TraveLogue, TravelogueDetail){
             var indexInsert;
             $('.functionBtn').on('click','li',function(e){
                 indexInsert = $(this).attr('data-index');
                 TravelogueDetail.splice(indexInsert + 1,0,{label:null, DAY:null, content:null, picURL: null, PE:true});
                 $.rogerRefresh(TraveLogue);
             });
         };
         TraveLogue.insertContent = function(TraveLogue, TravelogueDetail){
             var indexInsert;
             $('.functionBtn').on('click','li',function(e){
                 indexInsert = $(this).attr('data-index');
                 TravelogueDetail.splice(indexInsert + 1,0,{label:null, DAY:null, content:' ', picURL: null});
                 $.rogerRefresh(TraveLogue);
             });
         };
     }

    var initServiceEdit=function(){
         var ServiceID = $.rogerGetUrlParam('ServiceID');
         var usr = $.rogerGetLoginUser();
         result = {
             DetailMain:
             {
                 serviceID: '',
                 userID: '',
                 serviceName: '',
                 serviceTypeID: '',
                 serviceTypeName: '',
                 primaryPrice: '',
                 unit: '',
                 priceType: '',
                 serviceTime: '',
                 serviceOutTimePrice: '',
                 incMileage: '',
                 exMileagePrice: '',
                 freeForDelay: '',
                 waitOutTimePrice: '',
                 description: '',
                 serviceStatus: '',
                 serviceMethod: '',
                 picURLs:[],
                 coverURL:'',
                 detailServiceMethod: [],
                 facilities: [
                     {
                         serviceID: '',
                         facilityID: '',
                         userID: '',
                         facilityType: '',
                         facilityName: '',
                         brand: '',
                         model: '',
                         produceYear: '',
                         seats: '',
                         person: '',
                         clazz: '',
                         insurance: '',
                         description: '',
                         luggage: '',
                         facilityPics: [
                             // "group1/M00/00/00/CgkB6Vfo4B-AIZdyAAFCQ2cYzZ8551.jpg"
                         ]
                     }
                 ],
                 airports: [],
                 policy: [
                     {
                       policyType: 1,
                       policyID: '',
                       policyName: "退订政策",
                       serviceTypeID: '',
                       day1: '',
                       ratio1: '',
                       day2: '',
                       ratio2: '',
                       day3: '',
                       ratio3: '',
                       day4: '',
                       ratio4: '',
                       customRatio: '',
                       caution: '',
                       description: '',
                       type:''
                     },
                     {
                       policyType: 2,
                       policyID: '',
                       policyName: '费用包含',
                       serviceTypeID: '',
                       day1: '',
                       ratio1: '',
                       day2: '',
                       ratio2: '',
                       day3: '',
                       ratio3: '',
                       day4: '',
                       ratio4: '',
                       customRatio: '',
                       caution: '',
                       description: '',
                       type: 5
                     },
                     {
                       policyType: 3,
                       policyID: '',
                       policyName: '费用不包含',
                       serviceTypeID: '',
                       day1: '',
                       ratio1: '',
                       day2: '',
                       ratio2: '',
                       day3: '',
                       ratio3: '',
                       day4: '',
                       ratio4: '',
                       customRatio: '',
                       caution: '',
                       description: '',
                       type: 5
                     },
                     {
                       policyType: 4,
                       policyID: '',
                       policyName: '预订须知',
                       serviceTypeID: '',
                       day1: '',
                       ratio1: '',
                       day2: '',
                       ratio2: '',
                       day3: '',
                       ratio3: '',
                       day4: '',
                       ratio4: '',
                       customRatio: '',
                       caution: '',
                       description: '',
                       type: 5
                     }
                 ],
                 vehicleInfo:
                 {
                     vehicleInfoID: '',
                     serviceID: '',
                     brand: '',
                     model: '',
                     produceYear: '',
                     seats: '',
                     person: '',
                     clazz: '',
                     insurance: '',
                     luggage: ''
                 },
                 vehicleCharges: [
                     {
                         chargeID:'',
                         chargePrice:'',
                         chargeType:'',
                         serviceID:''
                     },
                     {
                         chargeID:'',
                         chargePrice:'',
                         chargeType:'',
                         serviceID:''
                     },
                     {
                         chargeID:'',
                         chargePrice:'',
                         chargeType:'',
                         serviceID:''
                     }],
                 vehicleAddress: [{
                    addressID: '',
                    serviceID: '',
                    addressType: '',
                    address: ''
                 }],
                 lendAddresses:[{address:'',addressID:'',addressType:1,serviceID:''}],
                 repayAddresses:[{address:'',addressID:'',addressType:2,serviceID:''}],
                 vehicleSchedule: [],
                 labels: [],
                 activityPrice: {
                    activityID: '',
                    serviceID: '',
                    adultPrice: '',
                    kidPrice: '',
                    duration: ''
                },
                 houseInfo:{
                    houseID: '',
                    serviceID: '',
                    person: '',
                    room: '',
                    bed: '',
                    address: '',
                    zipCode: '',
                    zoneCode: '+86',
                    tel: '',
                    toilet: '',
                    checkInTime: '',
                    checkOutTime: '',
                    countryID: '',
                    countryNameCn: '',
                    countryNameEn:'' ,
                    cityID: '',
                    cityNameCn: '',
                    cityNameEn: ''
                 },
                 TravelogueDetail: [
                     {label:' ', DAY:'0', content:null, picURL: null},
                     {label:null, DAY:null, content:null, picURL: null, PE:true},
                     {label:null, DAY:null, content:' ', picURL: null}
                 ],
             },
             IMGHOST: $.rogerImgHost()
         };
         $.rogerPost('/dashboard/product/service/detail', {"ServiceID": ServiceID, "userID": usr.UserID}, function (respJSON, reqJSON) {
             if(respJSON){
                 //console.log(JSON.stringify(respJSON));
                 if (null != respJSON["UserFacilities"] && '' != respJSON["UserFacilities"]) {
                         result["DetailMain"]["userFacilities"] = respJSON["UserFacilities"]
                     }
                 if (null != respJSON["CarBrand"] && '' != respJSON["CarBrand"]) {
                         result["DetailMain"]["carBrand"] = respJSON["CarBrand"]
                     }
                 if (null != respJSON["DetailMain"] && respJSON["DetailMain"].length > 0) {

                     picURLs = respJSON["DetailMain"][0]["picURLs"];
                     covers = respJSON["DetailMain"][0]["covers"];
                     coverURL="";
                     picURLs2 =[];

                     for(key in picURLs){

                         if(1 == covers[key]){
                             coverURL = picURLs[key];
                             delete picURLs[key];
                             respJSON["DetailMain"][0]["coverURL"] = coverURL;
                         } else{
                             picURLs2.push(picURLs[key]);
                         }
                     }
                     respJSON["DetailMain"][0]["picURLs"] = picURLs2;


                     if (null != respJSON["DetailServiceMethod"] && '' != respJSON["DetailServiceMethod"]) {
                         result["DetailMain"]["detailServiceMethod"] = respJSON["DetailServiceMethod"]
                     }
                     if (null != respJSON["Facility"] && '' != respJSON["Facility"]) {
                         result["DetailMain"]["facilities"] = respJSON["Facility"]
                         result["DetailMain"]["facilities"][0]["facilityId"] =result["DetailMain"]["facilities"][0]["facilityID"];
                     }

                     if (null != respJSON["Airports"] && '' != respJSON["Airports"]) {
                         result["DetailMain"]["airports"] = respJSON["Airports"]
                     }
                     if (null != respJSON["Policy"] && '' != respJSON["Policy"]) {
                        while(respJSON["Policy"].length < 4)
                            {
                             respJSON["Policy"].push({policyType: '',policyID: '',policyName: '',serviceTypeID: '',day1: '',ratio1: '',day2: '',ratio2: '',day3: '',ratio3: '',day4: '',ratio4: '',customRatio: '',caution: '',description: '',type: 5});
                            }
                         result["DetailMain"]["policy"] = respJSON["Policy"];
                     }
                     if (null != respJSON["VehicleInfo"] && '' != respJSON["VehicleInfo"]) {
                         result["DetailMain"]["vehicleInfo"] = respJSON["VehicleInfo"][0]
                     }
                     if (null != respJSON["VehicleCharges"] && '' != respJSON["VehicleCharges"]) {
                         result["DetailMain"]["vehicleCharges"] = respJSON["VehicleCharges"]
                     }
                     if (null != respJSON["VehicleAddress"] && '' != respJSON["VehicleAddress"]) {
                         result["DetailMain"]["vehicleAddress"] = respJSON["VehicleAddress"];
                         //提车地址
                        var lendAddresses = [];
                        //repayAddresses
                        var repayAddresses = [];
                        for(key in result["DetailMain"]["vehicleAddress"]){
                            if(1 == result["DetailMain"]["vehicleAddress"][key]["addressType"]){
                                lendAddresses.push(result["DetailMain"]["vehicleAddress"][key])
                            }else{
                                repayAddresses.push(result["DetailMain"]["vehicleAddress"][key])
                            }

                        }
                        result["DetailMain"]["lendAddresses"]=lendAddresses;
                        result["DetailMain"]["repayAddresses"]=repayAddresses;

                     }
                     if (null != respJSON["VehicleSchedule"] && '' != respJSON["VehicleSchedule"]) {
                         result["DetailMain"]["vehicleSchedule"] = respJSON["VehicleSchedule"]
                     }
                     if (null != respJSON["Labels"] && '' != respJSON["Labels"]) {
                         result["DetailMain"]["labels"] = respJSON["Labels"]
                     }
                     if (null != respJSON["ActivityPrice"] && '' != respJSON["ActivityPrice"]) {
                         result["DetailMain"]["activityPrice"] = respJSON["ActivityPrice"][0]
                     }
                     if (null != respJSON["HouseInfo"] && '' != respJSON["HouseInfo"]) {
                         result["DetailMain"]["houseInfo"] = respJSON["HouseInfo"][0]
                     }


                    result["DetailMain"]= deepCopy(result["DetailMain"],respJSON.DetailMain[0],respJSON.IMGHOST);
                     function deepCopy(des,source,img) {
                        for (var key in source) {
                            if(key){
                                if(typeof source[key]==='object'){
                                   //deepCopy(des[key],source[key])
                                   des[key] = JSON.stringify(source[key]);
                                   des[key] = JSON.parse(des[key]);
                                   // if(key == 'picURLs'){
                                   //      for(var i = 0; i < source[key].length ; i++){
                                   //          des[key][i] = img + source[key][i];
                                   //      }
                                   //  }else{

                                   //  }
                                }else{
                                        des[key] = source[key];

                                }
                              //des[key] = typeof source[key]==='object'? deepCopy(des[key],source[key]): source[key];
                              //des[key] = source[key];
                            }
                           }
                        return des;
                    }
                    // console.log(result["DetailMain"]);

                 } else {
                     //主数据没有的时候，汽车铭牌取得
                     if (null != respJSON["CarBrand"] && '' != respJSON["CarBrand"]) {
                         result["DetailMain"]["carBrand"] = respJSON["CarBrand"]
                     }
                 }
             }

             $.rogerRefresh(result);
         });
         return result;
    },ctrlServiceEdit=function(tmplItem, realView){
        var html;
        var typeVal;
        $('#policydiv input[type=radio]').on('click',function(){
            html = $(this).parent().next().html();
            $('#type').val($(this).val());
            $('#type').trigger("keyup");
            typeVal = $(this).val();
            tmplItem.DetailMain.policy[0].type = typeVal;
            if(typeVal == 5 || typeVal == '5' ){
                tmplItem.DetailMain.policy[0].policyName = '自定义的退订政策';
            }
        });
        $("#policyconfirm").on('click',function(){
            var days = $('#policycontent4 p');
            if(typeVal == 5 || typeVal == '5'){
                html = '<h3>自定义的退订政策</h3>'+
                       '<p>1、服务开始前'+ days.eq(0).find('input').val() +'天(含)以上退订，退还服务费用的99%；</p>'+
                       '<p>2、服务开始前'+ days.eq(1).find('input').val() +'天(含)以上退订，退还服务费用的50%；</p>'+
                       '<p>3、服务开始前'+ days.eq(2).find('input').val() +'天(含)以上退订，退还服务费用的20%；</p>'+
                       '<p>4、服务开始前'+ days.eq(3).find('input').val() +'天以内退订，不退还服务费用；</p>'+
                       '<p>5、导游未及时接单或拒绝订单，全额退还服务费用</p>';

            }
            $("#policyView").html(html);
        });
        //包车中关联车辆
        $('#carList input[type=radio]').on('click',function(){
            var val = $(this).val();
            var detail = $(this).parent().next().find('li');
            $('#facilityID').val(val).trigger("keyup");
            tmplItem.DetailMain.facilities[0].brand = detail.eq(0).find('span').text();
            tmplItem.DetailMain.facilities[0].model = detail.eq(1).find('span').text();
            tmplItem.DetailMain.facilities[0].person = detail.eq(2).find('span').text();
            tmplItem.DetailMain.facilities[0].luggage = detail.eq(3).find('span').text();
            var clazz = detail.eq(4).find('span').text();
            if(clazz == '经济'){
                tmplItem.DetailMain.facilities[0].clazz = '1';
            }else if(clazz == '舒适'){
                tmplItem.DetailMain.facilities[0].clazz = '2';
            }else if(clazz == '豪华'){
                tmplItem.DetailMain.facilities[0].clazz = '3';
            }
            var insurance = detail.eq(5).find('span').text();
            if( insurance == '有'){
                tmplItem.DetailMain.facilities[0].insurance = '1';
            }else if( insurance == '无'){
                tmplItem.DetailMain.facilities[0].insurance = '0';
            }

            $('#facilityconfirm').on('click',function(){
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $.rogerRefresh(tmplItem);
            });

        });

        //选择汽车品牌
        $('#carBrand').on('focus',function(){
            $('#carBrandList').modal('show');
            $('#carBrandList  input[type=radio]').on('click',function(){
                var val = $(this).next().text();
                tmplItem.DetailMain.vehicleInfo.brand = val;

            });
            $('#carBrandconfirm').on('click',function(){
                $('#carBrandList').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $.rogerRefresh(tmplItem);
            });
        });

        //包车
        $('#save').rogerOnceClick(tmplItem, function(e){
            var usr =$.rogerGetLoginUser();
            console.log('test');
            temp = e.data.DetailMain;
            var filedata = e.data.DetailMain.picURLs;
            var coverFiledata = e.data.DetailMain.coverURL;

            temp["userID"]=usr.UserID;
            temp["serviceTypeID"]=1;
            temp["unit"]='天';
            temp["priceType"]='1';
            temp["serviceStatus"]='3';
            if(temp["pictureIDs"]){
                temp["pictureIds"]=temp["serviceID"];
            }

            temp["policyBean"]= temp["policy"][0];
            temp["feeBean"]= temp["policy"][1];
            temp["feeBean"]["type"]=5;
            temp["feeNoBean"]= temp["policy"][2];
            temp["feeNoBean"]["type"]=5;
            temp["noticeBean"]= temp["policy"][3];
            temp["noticeBean"]["type"]=5;
            temp["coverFileWeb"]=coverFiledata;
            temp["filesWeb"]=filedata;

            if(4 == temp["policyBean"]["type"]){
                temp["policyBean"]["policyID"] = 29;
            }else if(3 == temp["policyBean"]["type"]){
                temp["policyBean"]["policyID"] = 28;
            }else if(2 == temp["policyBean"]["type"]){
                temp["policyBean"]["policyID"] = 27;
            }else if(1 == temp["policyBean"]["type"]){
                temp["policyBean"]["policyID"] = 26;
            } else {
                temp["policyBean"]["ratio1"]=0.89;
                temp["policyBean"]["ratio2"]=0.85;
                temp["policyBean"]["ratio3"]=0.82;
                temp["policyBean"]["ratio4"]=0.75;
            }

            temp["imghost"]=e.data.IMGHOST;
            console.log('test');
            var data = {
                reqUploadService:temp,
                // file:filedata,
                // coverFile:coverFiledata,
                IMGHOST:e.data.IMGHOST
            };
            $.rogerPost('/new/service/car', data, function(respJSON){
                $.rogerNotice({Message:'保存包车成功'});

                if(respJSON){
                    //跳转到详情页面
                    $.rogerLocation('#/servicecardetail?ServiceID='+respJSON.ServiceID);
                }

            });

        });

        //租车增加存车取车地址
        tmplItem.createLendAddress = function (User) {
            User.DetailMain.lendAddresses.push({address:'',addressID:'',addressType:1,serviceID:''});
            $.rogerRefresh(tmplItem);
        };
        tmplItem.createRepayAddress = function (User) {
            User.DetailMain.repayAddresses.push({address:'',addressID:'',addressType:2,serviceID:''});
            $.rogerRefresh(tmplItem);
        };

        var disday = [];
        if(tmplItem.DetailMain.vehicleSchedule.length > 0 ) {
            for(var i=0; i<tmplItem.DetailMain.vehicleSchedule.length; i++) {
                disday.push(tmplItem.DetailMain.vehicleSchedule[i].scheduleFormatTime);
            }
        }
        var pickr = $("#calendar").flatpickr({
            inline: true,
            mode: "multiple",
            defaultDate: disday,
            minDate: new Date(),
            onChange:function (dateObj, dateStr) {
                tmplItem.DetailMain["schedules"]=dateStr.split("; ");

            }
        });
        $('#carClazz').on('click','input',function(){
            var clazz = $(this).val();
            tmplItem.DetailMain.vehicleInfo.clazz = clazz;
        });
        $('#carInsurance').on('click','input',function(){
            var clazz = $(this).val();
            tmplItem.DetailMain.vehicleInfo.insurance = clazz;
        });
        //租车
        $('#saveCar').rogerOnceClick(tmplItem, function(e){
            var usr =$.rogerGetLoginUser();
            console.log('test');
            temp = e.data.DetailMain;
            var filedata = e.data.DetailMain.picURLs;
            var coverFiledata = e.data.DetailMain.coverURL;

            temp["userID"]=usr.UserID;
            temp["serviceTypeID"]=5;
            temp["unit"]='天';
            temp["priceType"]='1';
            temp["serviceStatus"]='3';
            if(temp["pictureIDs"]){
                temp["pictureIds"]=temp["serviceID"];
            }

            temp["policyBean"]= temp["policy"][0];
            temp["feeBean"]= temp["policy"][1];
            temp["feeBean"]["type"]=5;
            temp["feeNoBean"]= temp["policy"][2];
            temp["feeNoBean"]["type"]=5;
            temp["noticeBean"]= temp["policy"][3];
            temp["noticeBean"]["type"]=5;
            temp["coverFileWeb"]=coverFiledata;
            temp["filesWeb"]=filedata;
            temp["policyBean"]["type"]=5;
            temp["policyBean"]["serviceTypeID"]=5;


            temp["imghost"]=e.data.IMGHOST;
            console.log('test');
            var data = {
                reqUploadService:temp,
                // file:filedata,
                // coverFile:coverFiledata,
                IMGHOST:e.data.IMGHOST
            };
            $.rogerPost('/new/service/car', data, function(respJSON){
                $.rogerNotice({Message:'保存租车成功'});

                if(respJSON){
                    //跳转到详情页面
                    $.rogerLocation('#/cardetail?ServiceID='+respJSON.ServiceID);
                }

            });

        });

        //接送机添加机场
        tmplItem.createAirport = function (Plan, Spot) {
            $.rogerTrigger('#modal', '#/airportchooser', {Plan:Plan, Airports:Spot});
        };
        $('.deleteAirport').on('click',function(){
            var index = $(this).parent().index();
            tmplItem.DetailMain.airports.splice(index,1);
            $.rogerRefresh(tmplItem);
        });

        $('#savePickup').rogerOnceClick(tmplItem, function(e){
            var usr =$.rogerGetLoginUser();
            temp = e.data.DetailMain;
            var filedata = e.data.DetailMain.picURLs;
            var coverFiledata = e.data.DetailMain.coverURL;

            temp["userID"]=usr.UserID;
            if(temp["serviceTypeName"]=='接机' || temp["serviceTypeName"]==''){
                temp["serviceTypeID"]=3;
            }else if(temp["serviceTypeName"]=='送机'){
                temp["serviceTypeID"]=4;
            }
            temp["unit"]='次';
            temp["priceType"]='1';
            temp["serviceStatus"]='3';
            if(temp["pictureIDs"]){
                temp["pictureIds"]=temp["serviceID"];
            }

            var serviceAirportsItem = {};
            var serviceAirports = [];
            temp.serviceAirports = [];
            for(var i=0; i<temp["airports"].length; i++){
                serviceAirportsItem = {};
                !function(){
                    for(var akey in temp["airports"][i]) {
                    var akeyNew = akey.replace(/\b\w+\b/g, function(word){
                    return word.substring(0,1).toLowerCase()+word.substring(1);}
                    );
                    console.log(akeyNew,akey);
                    serviceAirportsItem[akeyNew] = temp["airports"][i][akey];
                    }
                }(i)

                serviceAirports[i]=serviceAirportsItem;
            }
            temp.serviceAirports=serviceAirports;
            console.log(temp.serviceAirports);


            temp["policyBean"]= temp["policy"][0];
            temp["feeBean"]= temp["policy"][1];
            temp["feeBean"]["type"]=5;
            temp["feeNoBean"]= temp["policy"][2];
            temp["feeNoBean"]["type"]=5;
            temp["noticeBean"]= temp["policy"][3];
            temp["noticeBean"]["type"]=5;
            temp["coverFileWeb"]=coverFiledata;
            temp["filesWeb"]=filedata;

            if(4 == temp["policyBean"]["type"]){
                temp["policyBean"]["policyID"] = 29;
            }else if(3 == temp["policyBean"]["type"]){
                temp["policyBean"]["policyID"] = 28;
            }else if(2 == temp["policyBean"]["type"]){
                temp["policyBean"]["policyID"] = 27;
            }else if(1 == temp["policyBean"]["type"]){
                temp["policyBean"]["policyID"] = 26;
            } else {
                temp["policyBean"]["ratio1"]=0.89;
                temp["policyBean"]["ratio2"]=0.85;
                temp["policyBean"]["ratio3"]=0.82;
                temp["policyBean"]["ratio4"]=0.75;
            }

            temp["imghost"]=e.data.IMGHOST;
            console.log('test');
            var data = {
                reqUploadService:temp,
                // file:filedata,
                // coverFile:coverFiledata,
                IMGHOST:e.data.IMGHOST
            };
            $.rogerPost('/new/service/car', data, function(respJSON){
                $.rogerNotice({Message:'接送机服务保存成功'});

                if(respJSON){
                    //跳转到详情页面
                    $.rogerLocation('#/servicepickupdetail?ServiceID='+respJSON.ServiceID);
                }

            });

        });

        tmplItem.createCity = function (tmplItem) {
            $.rogerTrigger('#modal', '#/citychooser4', {Spots:tmplItem});
        };
        //其他服务
        if ($('#ServiceTypeName').val() == '民宿') {
                $('#minsuInfo').show();
            }else {
                $('#minsuInfo').hide();
            }
        $('#ServiceTypeChoice').on('click','input',function(){
            var ServiceTypeId = $(this).val();
            var ServiceTypeName = $(this).next().text();
            $('#ServiceTypeId').val(ServiceTypeId).trigger('keyup');
            $('#ServiceTypeName').val(ServiceTypeName).trigger('keyup');
            if (ServiceTypeName == '民宿') {
                $('#minsuInfo').show();
            }else {
                $('#minsuInfo').hide();
            }
        });

        $('#PriceTypeChoice').on('click','input[type="radio"]',function(){
            var PriceType = $(this).val();
            $('#PriceType').val(PriceType).trigger('keyup');
            if(PriceType == '2'){
                $('#primaryPrice').val('').trigger('keyup');
            }
        });

        $('#saveOther').rogerOnceClick(tmplItem, function(e){
            var usr =$.rogerGetLoginUser();
            temp = e.data.DetailMain;
            var filedata = e.data.DetailMain.picURLs;
            var coverFiledata = e.data.DetailMain.coverURL;

            temp["userID"]=usr.UserID;
            temp["unit"]='天';
            if(temp["priceType"] == '' || !temp["priceType"] ){
            temp["priceType"]='1';
            }
            temp["serviceStatus"]='3';
            if(temp["pictureIDs"]){
                temp["pictureIds"]=temp["serviceID"];
            }

            temp["policyBean"]= temp["policy"][0];
            temp["feeBean"]= temp["policy"][1];
            temp["feeBean"]["type"]=5;
            temp["feeNoBean"]= temp["policy"][2];
            temp["feeNoBean"]["type"]=5;
            temp["noticeBean"]= temp["policy"][3];
            temp["noticeBean"]["type"]=5;
            temp["coverFileWeb"]=coverFiledata;
            temp["filesWeb"]=filedata;

            if(4 == temp["policyBean"]["type"]){
                temp["policyBean"]["policyID"] = 29;
            }else if(3 == temp["policyBean"]["type"]){
                temp["policyBean"]["policyID"] = 28;
            }else if(2 == temp["policyBean"]["type"]){
                temp["policyBean"]["policyID"] = 27;
            }else if(1 == temp["policyBean"]["type"]){
                temp["policyBean"]["policyID"] = 26;
            } else {
                temp["policyBean"]["ratio1"]=0.89;
                temp["policyBean"]["ratio2"]=0.85;
                temp["policyBean"]["ratio3"]=0.82;
                temp["policyBean"]["ratio4"]=0.75;
            }

            temp["imghost"]=e.data.IMGHOST;
            console.log('test');
            var data = {
                reqUploadService:temp,
                // file:filedata,
                // coverFile:coverFiledata,
                IMGHOST:e.data.IMGHOST
            };
            $.rogerPost('/new/service/car', data, function(respJSON){
                $.rogerNotice({Message:'服务保存成功'});

                if(respJSON){
                    //跳转到详情页面
                    $.rogerLocation('#/serviceotherdetail?ServiceID='+respJSON.ServiceID);
                }

            });

        });

        $('#saveActivity').rogerOnceClick(tmplItem, function(e){
            var usr =$.rogerGetLoginUser();
            temp = e.data.DetailMain;
            var filedata = e.data.DetailMain.picURLs;
            var coverFiledata = e.data.DetailMain.coverURL;

            temp["userID"]=usr.UserID;
            temp["unit"]='天';
            temp["serviceTypeID"]=6;
            temp["priceType"]='1';
            temp["serviceStatus"]='3';
            if(temp["pictureIDs"]){
                temp["pictureIds"]=temp["serviceID"];
            }

            temp["policyBean"]= temp["policy"][0];
            temp["feeBean"]= temp["policy"][1];
            temp["feeBean"]["type"]=5;
            temp["feeNoBean"]= temp["policy"][2];
            temp["feeNoBean"]["type"]=5;
            temp["noticeBean"]= temp["policy"][3];
            temp["noticeBean"]["type"]=5;
            temp["coverFileWeb"]=coverFiledata;
            temp["filesWeb"]=filedata;

            if(4 == temp["policyBean"]["type"]){
                temp["policyBean"]["policyID"] = 29;
            }else if(3 == temp["policyBean"]["type"]){
                temp["policyBean"]["policyID"] = 28;
            }else if(2 == temp["policyBean"]["type"]){
                temp["policyBean"]["policyID"] = 27;
            }else if(1 == temp["policyBean"]["type"]){
                temp["policyBean"]["policyID"] = 26;
            } else {
                temp["policyBean"]["ratio1"]=0.89;
                temp["policyBean"]["ratio2"]=0.85;
                temp["policyBean"]["ratio3"]=0.82;
                temp["policyBean"]["ratio4"]=0.75;
            }

            temp["imghost"]=e.data.IMGHOST;
            console.log('test');
            var data = {
                reqUploadService:temp,
                // file:filedata,
                // coverFile:coverFiledata,
                IMGHOST:e.data.IMGHOST
            };
            $.rogerPost('/new/service/car', data, function(respJSON){
                $.rogerNotice({Message:'活动保存成功'});

                if(respJSON){
                    //跳转到详情页面
                    $.rogerLocation('#/serviceactivitydetail?ServiceID='+respJSON.ServiceID);
                }

            });

        });

        //服务描述图文编辑
        serviceDescDetail(tmplItem,tmplItem.TravelogueDetail);
        //服务的编辑页面不需要发布按钮
         // $('#publish').rogerOnceClick(tmplItem, function(e){
         //     var usr =$.rogerGetLoginUser();
         //     console.log('test');
         //     temp = e.data.DetailMain;
         //
         //     var picURLs = e.data.DetailMain.picURLs;
         //     var coverURL = e.data.DetailMain.coverURL;
         //     var Pictures =[];
         //     for(key in picURLs){
         //         Pictures.push({"picURL":picURLs[key],"cover":0});
         //     }
         //
         //     if (null != coverURL && coverURL!=''){
         //         Pictures.push({"picURL":coverURL,"cover":1});
         //     }
         //
         //     temp["Pictures"]=Pictures;
         //     temp["userID"]=usr.UserID;
         //     temp["serviceTypeID"]=1;
         //     temp["unit"]='天';
         //     temp["priceType"]='1';
         //     temp["serviceStatus"]='4';
         //
         //     var data = {
         //         DetailMain:temp,
         //         IMGHOST:e.data.IMGHOST
         //     };
         //     $.rogerPost('/new/service/car', data, function(respJSON){
         //         $.rogerNotice({Message:'发布包车成功'});
         //
         //     });
         //
         // });

        bindRidoesForSwitch();
        realView.rogerCropImages();
    } ;

    var initTraveLogueEdit=function(){
        var usr =$.rogerGetLoginUser();
        var type = $.rogerGetUrlParam('type');

         // '/travelogue/detail'
        returnvalue= {
            Travelogue: {
                articleID: '',
                userID: usr.UserID,
                articlePicURL: '',
                description: '',
                title: '',
                userName: null,
                avatarPicURL: '',
                type: '',
                STATUS: '',
                createDate: '',
                browseCount: '',
                praiseCount: '',
                evaluateCount: '',
                TravelogueDetail: [
                {label:' ', DAY:'0', content:null, picURL: null},
                {label:null, DAY:null, content:null, picURL: null, PE:true},
                {label:null, DAY:null, content:' ', picURL: null}
                ],
                TravelogueToPlan2:[]
            },
            IMGHOST:$.rogerImgHost()
        };

        var articleID = $.rogerGetUrlParam('articleID');

        $.rogerPost('/travelogue/detail', {"articleID": articleID,"userID": usr.UserID}, function (respJSON, reqJSON) {
            if(respJSON){

                if (null != respJSON["Travelogue"] && respJSON["Travelogue"].length > 0) {
                    returnvalue["Travelogue"]=respJSON["Travelogue"][0];
                }
                if (null != respJSON["TravelogueDetail"] && '' != respJSON["TravelogueDetail"] && respJSON["TravelogueDetail"].length>0) {
                    returnvalue["Travelogue"]["TravelogueDetail"] = respJSON["TravelogueDetail"];
                }

                if (null != respJSON["TravelogueToPlan"] && '' != respJSON["TravelogueToPlan"] && respJSON["TravelogueToPlan"].length>0) {
                    returnvalue["Travelogue"]["TravelogueToPlan"] = respJSON["TravelogueToPlan"];
                    var planList = [];
                    for(var m=0; m < respJSON["TravelogueToPlan"].length; m++){
                        planList.push(respJSON["TravelogueToPlan"][m].planID);
                    }                    
                    returnvalue["Travelogue"]["TravelogueToPlan2"] = planList;
                }

                $.rogerRefresh(returnvalue);

            }});

        return returnvalue

    },ctrlTraveLogueEdit=function(TraveLogue, realView){
        //关联方案
        $.ajax({
            url:"/dashboard/product/specialplan",
            data:{
                pagestart:0,
                pagesize:8,
                UserID:10083
            },
            success:function(data){
                data = JSON.parse(data);
                var dataD = data.PlansByUser;
                var html = '';
                var flag = '';
                for(var m = 0; m < dataD.length; m++){
                    if(dataD[m].StartCountry == null){dataD[m].StartCountry=''}
                    if(dataD[m].StartCity == null){dataD[m].StartCity=''}

                    for(var n=0; n < TraveLogue.Travelogue.TravelogueToPlan2.length; n++ ){
                        if(dataD[m].PlanID == TraveLogue.Travelogue.TravelogueToPlan2[n]){flag = "checked";}
                    }
                    html +='<li class="row"><div class="col-md-1"><input type="checkbox" name="planRadios" value="" data-value="'+ dataD[m].PlanID +'" '+ flag +'></div><div class="col-md-11">'+
                            '<h4>'+dataD[m].PlanName+'</h4>'+
                            '<div class="col-md-5">'+
                                '<img src="'+ data.IMGHOST + dataD[m].PicURL +'" alt="方案封面" style="width:60px; height:60px;">'+
                            '</div>'+
                            '<div class="col-md-6">'+
                                '<p>开始城市：'+ dataD[m].StartCountry + dataD[m].StartCity + '</p>'+
                                '<p>方案ID：' + dataD[m].PlanNumber + '</p>'+
                            '</div></div></li>';
                    //console.log(html);
                    flag = '';
                }
                $('#planListDetail').html(html);

            }
        });
        var TravelogueToPlan2 = TraveLogue.Travelogue.TravelogueToPlan2;
        //关联方案选择
        $('#planListDetail').on('click','li input',function(){
            var PlanID = $(this).data('value');
            if($(this).prop('checked')){
                if(TravelogueToPlan2.length<3){
                    TravelogueToPlan2.push(PlanID);
                }else{
                    alert("最多只能关联三个方案！");
                    $(this).prop('checked',false);
                }
                console.log(TravelogueToPlan2);
            }else{
                for(var m = 0; m < TravelogueToPlan2.length; m++){
                    if(PlanID == TravelogueToPlan2[m]){
                        TravelogueToPlan2.splice(m,1);
                    }
                }
                console.log(TravelogueToPlan2);
            }
        });

        $('#planconfirm').on('click',function(){
            var html = '';
            $('#planListDetail li input').each(function(){
                if($(this).prop('checked')){
                    html+= '<li class="row">'+$(this).parent().next().html() + "</li>";
                }
                
            });
            $('#planListDetail2').html(html);
        })


         TraveLogue.createDay = function(TraveLogue, TravelogueDetail){  //  PlanSchedule ==> data-pointer="/PlanInfo/PlanSchedule/-"
            TravelogueDetail.push({label:' ', DAY:'0', content:null, picURL: null});
            $.rogerRefresh(TraveLogue);
        };
         TraveLogue.createPicture = function(TraveLogue, TravelogueDetail){  //  PlanSchedule ==> data-pointer="/PlanInfo/PlanSchedule/-"
            TravelogueDetail.push({label:null, DAY:null, content:null, picURL: null, PE:true});
            $.rogerRefresh(TraveLogue);
        };
         TraveLogue.createContent = function(TraveLogue, TravelogueDetail){  //  PlanSchedule ==> data-pointer="/PlanInfo/PlanSchedule/-"
            TravelogueDetail.push({label:null, DAY:null, content:' ', picURL: null});
            $.rogerRefresh(TraveLogue);
        };

        TraveLogue.insertDay = function(TraveLogue, TravelogueDetail){
            var indexInsert;
            $('.functionBtn').on('click','li',function(e){
                indexInsert = $(this).attr('data-index');
                TravelogueDetail.splice(indexInsert + 1,0,{label:' ', DAY:'0', content:null, picURL: null});
                $.rogerRefresh(TraveLogue);
            });            
        };
         TraveLogue.insertPicture = function(TraveLogue, TravelogueDetail){
            var indexInsert;
            $('.functionBtn').on('click','li',function(e){
                indexInsert = $(this).attr('data-index');
                TravelogueDetail.splice(indexInsert + 1,0,{label:null, DAY:null, content:null, picURL: null, PE:true});
                $.rogerRefresh(TraveLogue);
            });            
        };
         TraveLogue.insertContent = function(TraveLogue, TravelogueDetail){
            var indexInsert;
            $('.functionBtn').on('click','li',function(e){
                indexInsert = $(this).attr('data-index');
                TravelogueDetail.splice(indexInsert + 1,0,{label:null, DAY:null, content:' ', picURL: null});
                $.rogerRefresh(TraveLogue);
            });            
        };

        $('#save').rogerOnceClick(TraveLogue, function(e){
            temp = e.data.Travelogue;

            //关联方案数据调整
            var PlanList = temp.TravelogueToPlan2;
            var PlanListNew = [];
            for(var m=0; m< PlanList.length; m++){
                PlanListNew.push({
                    articleID:temp.articleID,
                    userID:temp.userID,
                    planID:PlanList[m]
                })
            }
            temp.TravelogueToPlan = PlanListNew;
            console.log(temp);

            temp["STATUS"]=1;

            TravelogueDetail = temp.TravelogueDetail;
            hasArticlePicURL = 0;
            for(key in TravelogueDetail){
                TravelogueDetail[key]["articleID"]=temp["articleID"];
                if(hasArticlePicURL==0
                    &&TravelogueDetail.length>0
                    && null != TravelogueDetail[key]["picURL"]
                    && ""!=TravelogueDetail[key]["picURL"]){
                    temp["articlePicURL"] = TravelogueDetail[key]["picURL"];
                    hasArticlePicURL=1;
                }

            }

            if(null != temp.articleID && temp.articleID!=''){

                temp["DeleteTravelogueDetail"] = {articleID:temp["articleID"]};

                abc = {articleID:temp["articleID"]};
                abc["Travelogue"]=temp;
                abc["TravelogueDetail"]=temp["TravelogueDetail"];
                var data = {
                    DeleteTravelogueDetail:abc,
                    IMGHOST:e.data.IMGHOST
                };

                $.rogerPost('/update/travellogue', data, function(respJSON){
                    $.rogerNotice({Message:'更新攻略成功'});
                    if(respJSON){
                        //跳转到详情页面
                        $.rogerLocation('#/traveloguedetail?articleID='+temp.articleID);
                    }
                });
            } else{
                var data = {
                    Travelogue:temp,
                    IMGHOST:e.data.IMGHOST
                };

                $.rogerPost('/new/travellogue', data, function(respJSON){
                    $.rogerNotice({Message:'保存攻略成功'});
                    if(respJSON){
                        //跳转到详情页面
                        $.rogerLocation('#/traveloguedetail?articleID='+respJSON.Travelogue.insertId);
                    }
                });
            }

        });


        bindRidoesForSwitch();
        realView.rogerCropImages();
    } ;

    var initEquipEdit=function(){
        var usr =$.rogerGetLoginUser();
        var facilityID = $.rogerGetUrlParam('facilityID');
        var facilityType = $.rogerGetUrlParam('facilityType');
        returnvalue = {
            Facility : {
                facilityID :"" ,
                userID :usr.UserID,
                facilityType : facilityType,
                facilityName : "",
                brand : "",
                model : "",
                produceYear : "",
                seats : "",
                person : "",
                clazz : "",
                insurance : "",
                description : "",
                luggage : "",
                coverURL : "",
                pics : []
            },
            IMGHOST : $.rogerImgHost()
        };



        $.rogerPost('/facility/detail', {"facilityID": facilityID, "userID": usr.UserID}, function (respJSON, reqJSON) {
            if(respJSON){

                if (null != respJSON["Facility"] && respJSON["Facility"].length > 0) {
                    returnvalue["Facility"]=respJSON["Facility"][0];
                    if(null == respJSON["Facility"][0]["pics"] || respJSON["Facility"][0]["pics"].length==0){
                        returnvalue["Facility"]["pics"] = [];
                    }
                }
                if (null != respJSON["CarBrand"] && '' != respJSON["CarBrand"]) {
                    returnvalue["carBrand"] = respJSON["CarBrand"]
                }

                $.rogerRefresh(returnvalue);

            }});


        return returnvalue;

    },ctrlEquipEdit=function(Facility, realView){

        //选择汽车品牌
        $('#carBrand').on('focus',function(){
            $('#carBrandList').modal('show');
            $('#carBrandList  input[type=radio]').on('click',function(){
                var val = $(this).next().text();
                Facility.Facility.brand = val;

            });
            $('#carBrandconfirm').on('click',function(){
                $('#carBrandList').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $.rogerRefresh(Facility);
            });
        });

        $('#save').rogerOnceClick(Facility, function(e){
            var usr =$.rogerGetLoginUser();
            console.log('ctrlEquipEdit');
            console.log(JSON.stringify(e.data.Facility));

            temp = e.data.Facility;

            picURLsData=[];
            picURLsID=[];
            for(key in temp.pics) {
                if(temp.pics[key].indexOf("data:image/jpeg;base64") !=-1){
                    picURLsData.push({isCover:2,picUrl:temp.pics[key],facilityID:temp["facilityID"]});
                } else {
                    picURLsID.push({isCover:2,picUrl:temp.pics[key],facilityID:temp["facilityID"]});
                }

            }

            if(null !=temp["coverURL"] && temp["coverURL"].length>0){
                if(temp["coverURL"].indexOf("data:image/jpeg;base64") !=-1){
                    picURLsData.push({isCover:1,picUrl:temp["coverURL"],facilityID:temp["facilityID"]});
                } else{
                    picURLsID.push({isCover:1,picUrl:temp["coverURL"],facilityID:temp["facilityID"]});
                }

            }

            temp["deletePicURLs"] = {facilityID:temp.facilityID};
            temp["picURLs"] = picURLsData;
            temp["picURLsID"] = picURLsID;

            var data = {
                Facility:temp,
                // file:filedata,
                // coverFile:coverFiledata,
                IMGHOST:e.data.IMGHOST
            };

            if(null == temp["facilityID"] || temp["facilityID"].length==0){
                $.rogerPost('/new/facility', data, function(respJSON){
                    $.rogerNotice({Message:'保存装备成功'});

                    if(respJSON){
                        //跳转到详情页面
                        $.rogerLocation('#/equipdetail?facilityID='+respJSON.Facility.insertId);
                    }

                });
            } else {
                $.rogerPost('/update/facility', data, function(respJSON){
                    $.rogerNotice({Message:'更新装备成功'});

                    if(respJSON){
                        //跳转到详情页面
                        $.rogerLocation('#/equipdetail?facilityID='+temp.facilityID);
                    }

                });

            }

        });


        bindRidoesForSwitch();
        realView.rogerCropImages();
    } ;

    var ctrlOrderdetail = function(response, realView) {

        console.log(JSON.stringify(response));

        $('#commitR').rogerOnceClick(response, function (e) {
            orderDetail = e.data.OrderDetail[0];
            orderEvaluateI = e.data.OrderEvaluateI[0];
            orderEvaluate = e.data.OrderEvaluate[0];

            data = {};

            data["Remark"]=orderEvaluateI["ReplyDetail"];
            data["AnswerID"]=orderDetail["GuideID"];
            data["SponsorID"]=orderEvaluate["TouristID"];
            data["OrderEvaluateID"]=orderEvaluate["OrderEvaluateID"];


            $.rogerPost('/new/order/reply', data , function(respJSON){
                $.rogerNotice({Message:'完成回复'});

                window.location.reload();

            });
        });

        bindRidoesForSwitch();
        realView.rogerCropImages();

    };

     var initCityChooser = function (PS) {
         return {
             UserData:0,
             Spot:PS.Spot,
             Plan:PS.Plan
         };
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
     var ctrlCityChooser2 = function (PS, realView) {
         $('#cityChooser').modal('show');
         $('#cityChooserOK').rogerOnceClick(PS,function (e) {
             var data = e.data;
             var country = $('#country option:selected').val().split(':');
             var city = $('#city option:selected').val().split(':');
             data.Plan.PlanInfo.StartCityID = city[0];
             data.Plan.PlanInfo.StartCity = city[1];
             $('#cityChooser').modal('hide');
             $.rogerRefresh(data.Plan);
         });
     };
     var initCityChooser3 = function (PS) {
         return {
             UserData:0,
             Spot:PS.Spots,
             Plan:PS.Spots
         };
     };
     var ctrlCityChooser3 = function (PS, realView) {
         $('#cityChooser').modal('show');
         $('#cityChooserOK').rogerOnceClick(PS,function (e) {
             var data = e.data.Plan.SpotDetail;
             var country = $('#country option:selected').val().split(':');
             var city = $('#city option:selected').val().split(':');
             $('#cityChooser').modal('hide');
             data.CountryID=country[0];
             data.CountryName=country[1];
             data.CityID=city[0];
             data.CityName=city[1];
             $.rogerRefresh(e.data.Plan);
         });
     };
     var ctrlCityChooser4 = function (PS, realView) {
         $('#cityChooser').modal('show');
         $('#cityChooserOK').rogerOnceClick(PS,function (e) {
             var data = e.data.Plan.DetailMain.houseInfo;
             var country = $('#country option:selected').val().split(':');
             var city = $('#city option:selected').val().split(':');
             $('#cityChooser').modal('hide');
             data.countryID=country[0];
             data.countryNameCn=country[1];
             data.cityID=city[0];
             data.cityNameCn=city[1];
             $.rogerRefresh(e.data.Plan);
         });
     };
     var initCityChooser5 = function (PS) {
         return {
             User:PS.User
         };
     };
     var ctrlCityChooser5 = function (PS, realView) {
         $('#cityChooser').modal('show');
         $('#cityChooserOK').rogerOnceClick(PS,function (e) {
             var data = e.data.User;
             var country = $('#country option:selected').val().split(':');
             var city = $('#city option:selected').val().split(':');
             data.User[0].CityID = city[0];
             data.User[0].CityName = city[1];
             data.User[0].CountryID = country[0];
             data.User[0].CountryName = country[1];
             $('#cityChooser').modal('hide');
             $.rogerRefresh(data);
         });
     };
     var initCityChooser6 = function (PS) {
         return {
             DetailMain:PS.response.DetailMain
         };
     };
     var ctrlCityChooser6 = function (PS, realView) {
         $('#cityChooser').modal('show');
         $('#cityChooserOK').rogerOnceClick(PS,function (e) {
             var data = e.data;
             var country = $('#country option:selected').val().split(':');
             var city = $('#city option:selected').val().split(':');
             data.DetailMain.cityID = city[0];
             data.DetailMain.cityCnName = city[1];
             data.DetailMain.countryID = country[0];
             data.DetailMain.countryName = country[1];
             $('#cityChooser').modal('hide');
             $.rogerRefresh(data);
         });
     };
     var ctrlCityChooser7 = function (PS, realView) {
         $('#cityChooser').modal('show');
         $('#cityChooserOK').rogerOnceClick(PS,function (e) {
             var data = e.data;
             var country = $('#country option:selected').val().split(':');
             var city = $('#city option:selected').val().split(':');
             data.DetailMain.homeCityID = city[0];
             data.DetailMain.homeCityName = city[1];
             data.DetailMain.homeCountryID = country[0];
             data.DetailMain.homeCountryName = country[1];
             $('#cityChooser').modal('hide');
             $.rogerRefresh(data);
         });
     };
     var ctrlCountryChooser = function (PS, realView) {
         $('#cityChooser').modal('show');
         $('#cityChooserOK').rogerOnceClick(PS,function (e) {
             var data = e.data;
             var country = $('#country option:selected').val().split(':');
             data.DetailMain.nationality = country[0];
             data.DetailMain.nationalityName = country[1];
             $('#cityChooser').modal('hide');
             $.rogerRefresh(data);
         });
     };




	$.rogerRouter({
		'#/':                               {view:'product-specialplan.html',                         rootrest:'/dashboard', 						                    ctrl: ctrlDashboard},
        '#/spcialplan':                   {view:'product-specialplan.html',                         rootrest:'/dashboard/product/specialplan',                          ctrl: ctrlSpecialplan},
        '#/classicplan':                  {view:'product-classicplan.html',                         rootrest:'/dashboard/product/classicplan',                          ctrl: ctrlClassicplan},
        '#/service':                       {view:'product-service.html',                              rootrest:'/dashboard/product/service',	                        ctrl: ctrlService},
        '#/activiy':                       {view:'product-activity.html',	                            rootrest:'/dashboard/product/activity',	                        ctrl: ctrlService},
        '#/car':                           {view:'product-car.html',                                   rootrest:'/dashboard/product/car', 		                        ctrl: ctrlService},
        '#/attraction':                   {view:'product-attraction.html',                           rootrest:'/dashboard/product/attraction',	                        ctrl: ctrlAttraction},
        '#/delicacy':                     {view:'product-delicacy.html',                              rootrest:'/dashboard/product/delicacy',	                        ctrl: ctrlAttraction},
        '#/accommodation':                {view:'product-accommodation.html',                       rootrest:'/dashboard/product/accommodation',                        ctrl: ctrlAttraction},
        '#/travelogue':                    {view:'travelogue-list.html',                              rootrest:'/travelogue/list',                                      ctrl: ctrlTravelogue},
        '#/facilitylist':                 {view:'facilitylist.html',                                  rootrest:'/facility/list',                                        ctrl: ctrlFacilityList},
        '#/orderlist':                     {view: 'orderlist-guide.html',                             rootrest: '/order/list',                                          ctrl: ctrlOrderlist},

        '#/shortplandetail':             {view: 'product-shortplan-detail.html',                    rootrest: '/dashboard/product/shortplan/detail',                  ctrl: ctrlShortplanDetail},
        '#/templateplandetail':          {view: 'product-tempplan-detail.html',                     rootrest: '/dashboard/product/tempplan/detail',                   ctrl: ctrlTemplateplanDetail},

        '#/delicacydetail':               {view:'product-delicacy-detail.html',	                     rootrest:'/dashboard/product/delicacy/detail',                     ctrl: ctrlDelicacyDetail},
        '#/accommodationdetail':        {view:'product-accommodation-detail.html',                 rootrest:'/dashboard/product/accommodation/detail',	           ctrl: ctrlAccommodationDetail},
        '#/attractiondetail':            {view:'product-attraction-detail.html',                    rootrest:'/dashboard/product/attraction/detail',                  ctrl: ctrlAttractionDetail},

        '#/serviceotherdetail':           {view:'product-service-other-detail.html',               rootrest:'/dashboard/product/service/detail',                      ctrl: ctrlServicedetail},
        '#/shortplannew':                 {fragment: 'fragment/product-shortplan-edit.html',       init: initShortplanNew,                                                   ctrl: ctrlShortplanNew},
        '#/templateplannew':             {fragment: 'fragment/product-tempplan-edit.html',         init: initTemplateplanNew,                                                ctrl: ctrlTemplateplanNew},

        '#/shortplanedit':               {fragment: 'fragment/product-shortplan-edit.html',        rootrest:'/plan/detail/short',                                         ctrl: ctrlShortplanNew},
        '#/templateplanedit':            {fragment: 'fragment/product-tempplan-edit.html',         rootrest:'/plan/detail/tmpl',                                         ctrl: ctrlTemplateplanNew},

       '#/spotchooser':                  {fragment: 'fragment/dialog-spot-chooser.html',           init: initSpotChooser,                                                    ctrl: ctrlSpotChooser},
        '#/airportchooser':              {fragment: 'fragment/dialog-airport-chooser.html',        init: initAirportChooser,                                                 ctrl: ctrlAirportChooser},
        '#/userinfoedit':                 {fragment:'fragment/userInfo-guide-edit.html',            init: initUserInfoEdit,   /*rootrest: '/user/info', */                    ctrl: ctrlUserInfoEdit},
        '#/userinfodetail':               {fragment:'fragment/userInfo-guide-detail.html',          init: initUserInfoDetail,   /*rootrest: '/user/info', */                  ctrl: ctrlUserInfoDetail},
        '#/equipdetail':                  {view:'product-equip-detail.html',                          rootrest:'/facility/detail',                                       ctrl: ctrlFacilityDetail},
        '#/servicecardetail':            {view:'product-service-car-detail.html',	                  rootrest:'/dashboard/product/service/detail',                      ctrl: ctrlServicedetail},
        '#/cardetail':                    {view:'product-car-detail.html',	                          rootrest:'/dashboard/product/service/detail',                      ctrl: ctrlServicedetail},
        '#/serviceactivitydetail':       {view:'product-activity-detail.html',	                      rootrest:'/dashboard/product/service/detail',                      ctrl: ctrlServicedetail},
        '#/servicepickupdetail':         {view:'product-service-pickup-detail.html',	              rootrest:'/dashboard/product/service/detail',                      ctrl: ctrlServicedetail},
        '#/traveloguedetail':            {view:'travelogue-detail.html',	                           rootrest:'/travelogue/detail',                                       ctrl: ctrlTravelogueDetail},
        '#/attractionedit':               {fragment: 'fragment/product-attraction-edit.html',       init: initAttractionEdit,                                                 ctrl: ctrlAttractionEdit},
        '#/accommodationedit':            {fragment: 'fragment/product-accommodation-edit.html',   init: initAttractionEdit,                                              ctrl: ctrlAttractionEdit},
        '#/activityedit':                 {fragment: 'fragment/product-activity-edit.html',          init: initServiceEdit,                                                   ctrl: ctrlServiceEdit},
        '#/delicacyedit':                 {fragment: 'fragment/product-delicacy-edit.html',          init: initAttractionEdit,                                                   ctrl: ctrlAttractionEdit},
        '#/caredit':                       {fragment: 'fragment/product-car-edit.html',                init: initServiceEdit,                                                        ctrl: ctrlServiceEdit},
        '#/servicecaredit':               {fragment: 'fragment/product-service-car-edit.html',      init: initServiceEdit,                                               ctrl: ctrlServiceEdit},
        '#/servicepickupedit':            {fragment: 'fragment/product-service-pickup-edit.html',   init: initServiceEdit,                                              ctrl: ctrlServiceEdit},
        '#/serviceotheredit':             {fragment: 'fragment/product-service-other-edit.html',    init: initServiceEdit,                                               ctrl: ctrlServiceEdit},
        '#/travelogueedit':               {fragment: 'fragment/travelogue-edit.html',               init: initTraveLogueEdit,                                                 ctrl: ctrlTraveLogueEdit},
        '#/equipedit':                     {fragment: 'fragment/product-equip-edit.html',           init: initEquipEdit,                                                      ctrl: ctrlEquipEdit},
        '#/orderdetail':                  {fragment:'payCompletion.html',	                        rootrest:'/order/detail',                                              ctrl: ctrlOrderdetail},


        '#/citychooser':                  {fragment: 'fragment/dialog-city-chooser.html',           init: initCityChooser,                        ctrl: ctrlCityChooser},
        '#/citychooser2':                  {fragment: 'fragment/dialog-city-chooser.html',           init: initCityChooser,                       ctrl: ctrlCityChooser2},
        '#/citychooser3':                 {fragment: 'fragment/dialog-city-chooser.html',             init: initCityChooser3,                     ctrl: ctrlCityChooser3},
        '#/citychooser4':                 {fragment: 'fragment/dialog-city-chooser.html',             init: initCityChooser3,                     ctrl: ctrlCityChooser4},
        '#/citychooser5':                 {fragment: 'fragment/dialog-city-chooser.html',             init: initCityChooser5,                     ctrl: ctrlCityChooser5},
        '#/citychooser6':                 {fragment: 'fragment/dialog-city-chooser.html',             init: initCityChooser6,                     ctrl: ctrlCityChooser6},
        '#/citychooser7':                 {fragment: 'fragment/dialog-city-chooser.html',             init: initCityChooser6,                     ctrl: ctrlCityChooser7},
        '#/countrychooser':               {fragment: 'fragment/dialog-country-chooser.html',          init: initCityChooser6,                     ctrl: ctrlCountryChooser}
    });


	
});