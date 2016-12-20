(function () {
	
	
	var ctrlHome = function(response, realView) {
		$('#carousel-generic').carousel();
		realView.rogerCropImages();
		$('#footer').rogerReloadFile('./footer.html'); 
		$('#modal').rogerReloadFile('./home-login.html', function(){
			$.rogerInitLoginForm('#login-form', '/login', '/dashboard.html');
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
		realView.rogerCropImages();
		$('#policy').html(response.PlanInfo[0].Policy.replace(/\r\n/g, '<br>'));
		var count = 0;
		$('#photos').rogerUploadImage(100, 100, function(data){
			if(count++ < 5)
			$('#photos').before('<div style="width:100px;" class="col-sm-2" ><img style="width:100px;" src='+data.raw+'><span class="glyphicon glyphicon-remove-sign"></span></img></div>');
		});
		$('#commit').click(function(){
			var user = $.rogerGetLoginUser()
			if(!user) {
				$.rogerShowLogin();
				return;
			}
			var data = {UserID:$.rogerGetLoginUser().UserID,Pics:[]};
			var elems = $('#photos').find('img["src"]').nextAll(), count = elems.length;
			elems.each( function(i) {
				data.Pics.push($(this).attr('src'));
				if (!--count) {
					$.rogerPost('/comment/plan', data, function(){
						$.rogerRefresh();
					});
				}
			});
		});
	};
	
	$.rogerRouter({
		'#/':							{view:'home.html',								rootrest:'/home', 						ctrl: ctrlHome},
		'#/plandetail': 				{view:'plandetail.html',						rootrest:'/plan/detail', 				ctrl: ctrlPlandetail},
	});
	
	
})();