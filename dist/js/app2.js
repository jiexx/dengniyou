$(function () {
	
	var ctrlPlandetail = function(response, realView) {
		realView.rogerCropImages();
	};
	
	var ctrlDashboard = function(response, realView) {
		//$.cookie("dnyuser").UserID;
		//$.rogerPost(reqURL, reqJSON, callback)
	};
	
	
	$.rogerRouter({
		'#/':					{view:'products.html',								rootrest:'/dashboard', 						ctrl: ctrlDashboard},
	});
	
	
});