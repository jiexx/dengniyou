$(function () {
	

	var ctrlDashboard = function(response, realView) {
		//$.cookie("dnyuser").UserID;
		//$.rogerPost(reqURL, reqJSON, callback)
	};
    var ctrlFacilityList = function(response, realView) {

        realView.rogerCropImages();
    };

    var ctrlOrderlist = function(response, realView) {

        realView.rogerCropImages();
    };

	$.rogerRouter({
		'#/':					{view:'products.html',								rootrest:'/dashboard', 						ctrl: ctrlDashboard},
        '#/facilitylist':               {view:'facilitylist.html',                      rootrest:'/facility/list',              ctrl: ctrlFacilityList},
        '#/orderlist': {view: 'orderlist.html', rootrest: '/order/list', ctrl: ctrlOrderlist},
	});
	
	
});