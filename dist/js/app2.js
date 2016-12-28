$(function () {

    function bindRidoesForSwitch (){
        var ev = $._data($('#menu input[type=radio][name="optradio"]')[0], 'events');
        if(!ev || !ev.change) {
            $('#menu input[type=radio][name="optradio"]').change(function(e){
                var usr = $.rogerGetLoginUser();
                var url = $(this).next('a').attr('href');
                $.rogerTrigger('#app',url, {UserID:usr.UserID});
            });
        }
    }
	var ctrlDashboard = function(response, realView) {
        if( !$.trim( $('#modal').html() ) ) {
            $('#modal').rogerReloadFile('./home-login.html');
        }
        if(!$.rogerGetURLJsonParams()) {
            if(!$.rogerIsLogined()) {
                $.rogerShowLogin();
            }else{
                var usr = $.rogerGetLoginUser();
                $.rogerLocation('#/?UserID='+usr.UserID)
            }
        }
        bindRidoesForSwitch();
        realView.rogerCropImages();
	};
    var ctrlSpecialplan = function(response, realView) {
        bindRidoesForSwitch();
        realView.rogerCropImages();
    };
    var ctrlClassicplan = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };
    var ctrlService = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };
    var ctrlActivity = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };
    var ctrlCar = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };
    var ctrlAttraction = function(response, realView) {

        realView.rogerCropImages();
        if(response.Counts > 10) {

        }
    };
    var ctrlAccommodation = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };
    var ctrlDelicacy = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };
    var ctrlTravelogue = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };

    var ctrlShortplanDetail = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };
    var ctrlTemplateplanDetail = function(response, realView) {

        $('#refundpolicy').html(response.PlansByUser[0].Policy.replace(/\r\n/g, '<br>'));
        $('#costpolicy').html(response.PlansByUser[0].CostInclude.replace(/\r\n/g, '<br>'));
        $('#excostpolicy').html(response.PlansByUser[0].CostExclude.replace(/\r\n/g, '<br>'));
        $('#visapolicy').html(response.PlansByUser[0].VisaNotice.replace(/\r\n/g, '<br>'));
        $('#noticepolicy').html(response.PlansByUser[0].Notice.replace(/\r\n/g, '<br>'));

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };
    var initTemplateplanNew = function(){
        return {
            PlanInfo:{
                PlanName:'',
                AdultPrice:'',
                KidPrice:'',
                PlanLabels:['观光旅游','艺术','轻探险','亲子','浪漫','游学','传统文化','自然风光','美食','商务与投资'],
                PlanFeature:'',
                CoverPicURL:'',
                CarPicURL:'',
                PicURL:[],
                Policy:'',
                CostInclude:'',
                CostExclude:'',
                VisaNotice:'',
                Notice:''
            },
            PlanSchedule:{
                __countScheduleID:1,
                Day:[{
                    Spot:[{CountryID:'',CountryNameCn:'test',CountryNameEn:'test',CityID:'',CityNameCn:'test',CityNameEn:'test',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:0,SpotPicUrl:''},
                          {CountryID:'',CountryNameCn:'test',CountryNameEn:'test',CityID:'',CityNameCn:'test',CityNameEn:'test',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:1,SpotPicUrl:''},
                          {CountryID:'',CountryNameCn:'test',CountryNameEn:'test',CityID:'',CityNameCn:'test',CityNameEn:'test',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:2,SpotPicUrl:''},
                          {CountryID:'',CountryNameCn:'test',CountryNameEn:'test',CityID:'',CityNameCn:'test',CityNameEn:'test',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:3,SpotPicUrl:''},
                          {CountryID:'',CountryNameCn:'test',CountryNameEn:'test',CityID:'',CityNameCn:'test',CityNameEn:'test',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:4,SpotPicUrl:''},
                    ],
                    TravelInstruction:''
                }]  //0 city, 1 airport, 2 attraction, 3 delicacy, 4 accommodation
            }
        };
    }
    var ctrlTemplateplanNew = function(Plan, realView) {
        $('#newOneDay').rogerOnceClick(function(){
            Plan.PlanSchedule.__countScheduleID ++;
            Plan.PlanSchedule.Day.push({
                City:[{Name:''}],
                Airport:[{AirportCode:'',AirportNameCn:'',AirportNameEn:''}],
                Attraction:[{NameCh:'',NameEn:'',CountryName:'',CityName:'',Address:'',ZipCode:''}],
                Delicacy:[{NameCh:'',NameEn:'',CountryName:'',CityName:'',Address:'',ZipCode:''}],
                Accommodation:[{NameCh:'',NameEn:'',CountryName:'',CityName:'',Address:'',ZipCode:''}]
            });
            $.rogerRefresh(Plan);
        });
        $('#save').rogerOnceClick(function(){
            $.rogerCollect(Plan, function(){
                console.log(Plan);
            })
        });
        bindRidoesForSwitch();
        realView.rogerCropImages();
    };
    var initShortplanNew = function(){
      return null;
    };
    var ctrlShortplanNew = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };


    var ctrlFacilityList = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };

    var ctrlDelicacyDetail = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };

    var ctrlAccommodationDetail = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };

    var ctrlAttractionDetail = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };

    var ctrlOrderlist = function(response, realView) {

        realView.rogerCropImages();
        if (5 == response.datas[0].status){
            // $('#payBtn').hide()
        }
    };

    var ctrlServicedetail = function(response, realView) {

        realView.rogerCropImages();
        if (5 == response.datas[0].status){
            // $('#payBtn').hide()
        }
    };


	$.rogerRouter({
		'#/':                               {view:'product-specialplan.html',					rootrest:'/dashboard', 						                        ctrl: ctrlDashboard},
        '#/spcialplan':                   {view:'product-specialplan.html',					rootrest:'/dashboard/product/specialplan',                        ctrl: ctrlSpecialplan},
        '#/classicplan':                  {view:'product-classicplan.html',					rootrest:'/dashboard',                                               ctrl: ctrlClassicplan},
        '#/service':                       {view:'product-service.html',						rootrest:'/dashboard/product/service',	                        ctrl: ctrlService},
        '#/activiy':                       {view:'product-activity.html',						rootrest:'/dashboard/product/activity',	                        ctrl: ctrlActivity},
        '#/car':                           {view:'product-car.html',    						rootrest:'/dashboard/product/car', 		                        ctrl: ctrlCar},
        '#/attraction':                   {view:'product-attraction.html',					rootrest:'/dashboard/product/attraction',	                        ctrl: ctrlAttraction},
        '#/delicacy':                     {view:'product-delicacy.html',						rootrest:'/dashboard/product/delicacy',	                        ctrl: ctrlDelicacy},
        '#/accommodation':               {view:'product-accommodation.html',				rootrest:'/dashboard/product/accommodation',                     ctrl: ctrlAccommodation},
        '#/travelogue':                    {view:'travelogue-list.html',        				rootrest:'/travelogue/list',                                         ctrl: ctrlTravelogue},
        '#/facilitylist':                 {view:'facilitylist.html',                         rootrest:'/facility/list',                                             ctrl: ctrlFacilityList},
        '#/orderlist':                     {view: 'orderlist.html',                           rootrest: '/order/list',                                              ctrl: ctrlOrderlist},

        '#/shortplandetail':             {view: 'product-shortplan-detail.html',          rootrest: '/dashboard/product/shortplan/detail',                  ctrl: ctrlShortplanDetail},
        '#/templateplandetail':          {view: 'product-tempplan-detail.html',           rootrest: '/dashboard/product/tempplan/detail',                   ctrl: ctrlTemplateplanDetail},

        '#/delicacydetail':             {view:'product-delicacy-detail.html',	            rootrest:'/dashboard/product/delicacy/detail',	                 ctrl: ctrlDelicacyDetail},
        '#/accommodationdetail':       {view:'product-accommodation-detail.html',	        rootrest:'/dashboard/product/accommodation/detail',	             ctrl: ctrlAccommodationDetail},
        '#/attractiondetail':           {view:'product-attraction-detail.html',	         rootrest:'/dashboard/product/attraction/detail',	             ctrl: ctrlAttractionDetail},

        '#/serviceotherdetail':           {view:'product-service-other-detail.html',	  rootrest:'/dashboard/product/service/detail',	                        ctrl: ctrlServicedetail},
        '#/shortplannew':                 {fragment: 'fragment/product-shortplan-edit.html',             init: initShortplanNew,                                          ctrl: ctrlShortplanNew},

        '#/templateplannew':             {fragment: 'fragment/product-tempplan-edit.html',               init: initTemplateplanNew,                                      ctrl: ctrlTemplateplanNew},
        '#/servicecardetail':           {view:'product-service-car-detail.html',	  rootrest:'/dashboard/product/service/detail',ctrl: ctrlServicedetail},
        '#/cardetail':           {view:'product-car-detail.html',	  rootrest:'/dashboard/product/service/detail',ctrl: ctrlServicedetail},
        '#/serviceactivitydetail':      {view:'product-activity-detail.html',	  rootrest:'/dashboard/product/service/detail',ctrl: ctrlServicedetail},

	});


	
});