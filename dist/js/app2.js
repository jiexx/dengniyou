$(function () {

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
        $('input[type=radio][name="optradio"]').change(function(e){
            var usr = $.rogerGetLoginUser();
            var url = $(this).next('a').attr('href');
            $.rogerTrigger('#app',url, {UserID:usr.UserID});
        });
	};
    var ctrlClassicplan = function(response, realView) {

        realView.rogerCropImages();
    };
    var ctrlService = function(response, realView) {

        realView.rogerCropImages();
    };
    var ctrlActivity = function(response, realView) {

        realView.rogerCropImages();
    };
    var ctrlCar = function(response, realView) {

        realView.rogerCropImages();
    };
    var ctrlAttraction = function(response, realView) {

        realView.rogerCropImages();
        if(response.Counts > 10) {

        }
    };
    var ctrlAccommodation = function(response, realView) {

        realView.rogerCropImages();
    };
    var ctrlDelicacy = function(response, realView) {

        realView.rogerCropImages();
    };
    var ctrlTravelogue = function(response, realView) {

        realView.rogerCropImages();
    };

    var ctrlFacilityList = function(response, realView) {

        realView.rogerCropImages();
    };

    var ctrlOrderlist = function(response, realView) {

        realView.rogerCropImages();
    };

	$.rogerRouter({
		'#/':                               {view:'product-specialplan.html',					rootrest:'/dashboard', 						                        ctrl: ctrlDashboard},
        '#/spcialplan':                   {view:'product-specialplan.html',					rootrest:'/dashboard', 						                        ctrl: ctrlDashboard},
        '#/classicplan':                  {view:'product-classicplan.html',					rootrest:'/dashboard/product/classicplan',                        ctrl: ctrlClassicplan},
        '#/service':                       {view:'product-service.html',						rootrest:'/dashboard/product/service',	                        ctrl: ctrlService},
        '#/activiy':                       {view:'product-activity.html',						rootrest:'/dashboard/product/activity',	                        ctrl: ctrlActivity},
        '#/car':                           {view:'product-car.html',    						rootrest:'/dashboard/product/car', 		                        ctrl: ctrlCar},
        '#/attraction':                   {view:'product-attraction.html',					rootrest:'/dashboard/product/attraction',	                        ctrl: ctrlAttraction},
        '#/delicacy':                     {view:'product-delicacy.html',						rootrest:'/dashboard/product/delicacy',	                        ctrl: ctrlDelicacy},
        '#/accommodation':               {view:'product-accommodation.html',				rootrest:'/dashboard/product/accommodation',                     ctrl: ctrlAccommodation},
        '#/travelogue':                    {view:'travelogue-list.html',        				rootrest:'/travelogue/list',                                         ctrl: ctrlTravelogue},
        '#/facilitylist':                 {view:'facilitylist.html',                      rootrest:'/facility/list',                  ctrl: ctrlFacilityList},
        '#/orderlist':                  　{view: 'orderlist.html',                           rootrest: '/order/list',                    ctrl: ctrlOrderlist},
	});

	
});