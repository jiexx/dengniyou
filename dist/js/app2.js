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
    var ctrlTemplateplanNew = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };
    var ctrlShortplanNew = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };


    var ctrlFacilityList = function(response, realView) {

        bindRidoesForSwitch();
        realView.rogerCropImages();
    };

    var ctrlOrderlist = function(response, realView) {

        realView.rogerCropImages();
        if (5 == response.datas[0].status){
            // $('#payBtn').hide()
        }
    };

	$.rogerRouter({
		'#/':                               {view:'product-specialplan.html',					rootrest:'/dashboard', 						                        ctrl: ctrlDashboard},
        '#/spcialplan':                   {view:'product-specialplan.html',					rootrest:'/dashboard/product/specialplan',                        ctrl: ctrlSpecialplan},
        '#/classicplan':                  {view:'product-classicplan.html',					rootrest:'/dashboard/product/classicplan',                        ctrl: ctrlClassicplan},
        '#/service':                       {view:'product-service.html',						rootrest:'/dashboard/product/service',	                        ctrl: ctrlService},
        '#/activiy':                       {view:'product-activity.html',						rootrest:'/dashboard/product/activity',	                        ctrl: ctrlActivity},
        '#/car':                           {view:'product-car.html',    						rootrest:'/dashboard/product/car', 		                        ctrl: ctrlCar},
        '#/attraction':                   {view:'product-attraction.html',					rootrest:'/dashboard/product/attraction',	                        ctrl: ctrlAttraction},
        '#/delicacy':                     {view:'product-delicacy.html',						rootrest:'/dashboard/product/delicacy',	                        ctrl: ctrlDelicacy},
        '#/accommodation':               {view:'product-accommodation.html',				rootrest:'/dashboard/product/accommodation',                     ctrl: ctrlAccommodation},
        '#/travelogue':                    {view:'travelogue-list.html',        				rootrest:'/travelogue/list',                                        ctrl: ctrlTravelogue},
        '#/facilitylist':                 {view:'facilitylist.html',                         rootrest:'/facility/list',                                           ctrl: ctrlFacilityList},
        '#/orderlist':                     {view: 'orderlist.html',                           rootrest: '/order/list',                                              ctrl: ctrlOrderlist},

        '#/shortplandetail':             {view: 'product-shortplan-detail.html',           rootrest: '/dashboard/product/shortplan/detail',                 ctrl: ctrlShortplanDetail},
        '#/templateplandetail':          {view: 'product-tempplan-detail.html',            rootrest: '/dashboard/product/tempplan/detail',                  ctrl: ctrlTemplateplanDetail},

        '#/shortplannew':                 {view: 'product-shortplan-edit.html',             rootrest: '/new/shortplan',                                         ctrl: ctrlTemplateplanNew},
        '#/templateplannew':             {view: 'product-tempplan-edit.html',               rootrest: '/new/templateplan',                                       ctrl: ctrlShortplanNew}
	});

	
});