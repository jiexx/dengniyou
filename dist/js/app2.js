$(function () {
	

	var ctrlDashboard = function(response, realView) {
		//$.cookie("dnyuser").UserID;
		//$.rogerPost(reqURL, reqJSON, callback)
	};
	
	
	$.rogerRouter({
		'#/':					{view:'products.html',								rootrest:'/dashboard', 						ctrl: ctrlDashboard},
        '#/facilitylist':               {view:'facilitylist.html',                      rootrest:'/facility/list',              ctrl: ctrlFacilityList},
	});
	
	
});