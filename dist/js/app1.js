(function () {
	
	
	var ctrlHome = function(response, realView) {
		$('#carousel-generic').carousel();
		realView.rogerCropImages();
		$('#footer').rogerReloadFile('./footer.html'); 
		$('#modal').rogerReloadFile('./home-login.html', function(){
			$.rogerInitLoginForm('#homeLogin', '/login', '/dashboard.html');
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
			$('#photos').prepend('<div style="width:100px;" class="col-sm-2" ><img name="pic" style="width:100px;" src='+data.raw+'><span class="glyphicon glyphicon-remove-sign"></span></img></div>');
		});
		$('#commit').click(function(){
			var user = $.rogerGetLoginUser()
			if(!user) {
				$.rogerShowLogin();
				return;
			}
			console.log(JSON.stringify($.rogerGetLoginUser()));
			var data = {UserID:$.rogerGetLoginUser().UserID,   Pics:[],   PlanID:response.PlanInfo[0].PlanID, Comment:$('textarea#commentplan').val()};
            var elems = document.getElementById('photos').querySelectorAll('img[name="pic"]');
            for (var i = 0; i < elems.length; i++) {
            	var pic = elems[i].src;
                data.Pics.push(pic);
			}
            $.rogerPost('/comment/plan', data, function(){
               // $.rogerRefresh();
            });
		});
	};

    var ctrlOrderlist = function(response, realView) {

        realView.rogerCropImages();
    };

	$.rogerRouter({
		'#/':							{view:'home.html',								rootrest:'/home', 						ctrl: ctrlHome},
		'#/plandetail': 				{view:'plandetail.html',							rootrest:'/plan/detail', 				ctrl: ctrlPlandetail},
        '#/orderlist': 				{view: 'orderlist.html', 						rootrest: '/order/list', 				ctrl: ctrlOrderlist},
	});
	
	
})();