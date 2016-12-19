(function () {
	
	
	var ctrlHome = function(response, realView) {
		$('#carousel-generic').carousel();
		realView.rogerCropImages();
		$('#footer').rogerReloadFile('./footer.html'); 
		$('#modal').rogerReloadFile('./home-login.html');
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
		realView.rogerCropImages();
	};
	
	$.rogerRouter({
		'#/':							{view:'home.html',								rootrest:'/home', 						ctrl: ctrlHome},
		'#/plandetail': 				{view:'plandetail.html',						rootrest:'/plan/detail', 				ctrl: ctrlPlandetail},
	});
	
	
})();