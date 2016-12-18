(function () {
	
	
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
	
	var ctrlPlandetail = function(response, realView) {
		$('#calendar').fullCalendar({
  	  		defaultDate: '2016-12-12',
  	  		editable: true,
  	  		eventLimit: true, // allow "more" link when too many events
  	  		events: [
  	  			{
  	  				title: 'Long Event',
  	  				start: '2016-12-07',
  	  				end: '2016-12-10'
  	  			},
  	  		]
  	  	});
	};
	
	$.rogerRouter({
		'#/':							{view:'home.html',								rootrest:'/home', 						ctrl: ctrlHome},
		'#/plandetail': 				{view:'plandetail.html',						rootrest:'/plan/detail', 				ctrl: ctrlPlandetail},
	});
	
	
})();