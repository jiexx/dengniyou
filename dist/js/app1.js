(function () {
	function frameCtrl() {
        if( !$.trim( $('#footer').html() ) ) {
            $('#footer').rogerReloadFile('./footer.html');
        }
        if( !$.trim( $('#modal').html() ) ) {
            $('#modal').rogerReloadFile('./home-login.html');
        }
        if($.rogerIsLogined()) {
            $('#userlogin').html('').append('<span class="btn btn-link btn-xs register" id="usrlogout">注销</span>');
            $('#usrlogout').click(function () {
                $.rogerLogout();
                $.rogerRefresh();
            });
            $.rogerHideLogin();
        }else {
            $('#userlogin').html('').append('<span class="btn btn-link btn-xs register" id="usrlogin" data-toggle="modal" data-target="#homeLogin">登录</span>');
            $('#usrlogin').click(function () {
                $.rogerLogin('#homeLogin', '/login'/*, '/dashboard.html'*/);
            })
        }
    }
	
	var ctrlHome = function(response, realView) {
		$('#carousel-generic').carousel();
		realView.rogerCropImages();
        frameCtrl();
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
        frameCtrl();
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
			var usr =$.rogerGetLoginUser();
			console.log(usr);
			var data = {UserID:usr.UserID,   Pics:[],   PlanID:response.PlanInfo[0].PlanID, Comment:$('textarea#commentplan').val()};
            var elems = document.getElementById('photos').querySelectorAll('img[name="pic"]');
            for (var i = 0; i < elems.length; i++) {
            	var pic = elems[i].src;
                data.Pics.push(pic);
			}
            $.rogerPost('/comment/plan', data, function(respJSON){
                $.rogerRefresh();
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