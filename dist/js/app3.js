$(function () {
	
	
	var ctrlHome = function(response, realView) {
		$('#carousel-generic').carousel();
		realView.rogerCropImages();
		$('#modal').rogerReloadFile('./home-login.html');
		$('#footer').rogerReloadFile('./footer.html'); 
		$('#login-form').rogerSubmit('/login', function(respJSON){
			if(respJSON[0] && respJSON[0].UserID > 0) {
				if(respJSON[0].UserType == 2) {
					window.location = '/dashboard.html';
				}else if(respJSON[0].Auth == 8) {
					window.location = '/dashboard-manager.html';
				}
				$.removeCookie("user");
				$.cookie("user", data[0], { expires : 10 });
			}
		});
	};
	
	var ctrlPlandetail = function() {
	};
	
	var ctrlDashboard = function() {
	};
	
	var ctrlDashboardMgr = function() {
	};
	
	$.rogerRouter({
		'#/dashboard-manager':					{view:'dashboard-manager.html',								rootrest:'/dashboard/manager', 						ctrl: ctrlDashboardMgr},
	});
	
	
});