(function () {
	function frameCtrl() {
        if( !$.trim( $('#footer').html() ) ) {
            $('#footer').rogerReloadFile('./footer.html');
        }
        if( !$.trim( $('#modal').html() ) ) {
            $('#modal').rogerReloadFile('./dialog/home-login.html');
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

	var initComment = function(params) {
		return {
			Comment:{
				PlanID: params.PlanID,
				Comment: '',
				Picture:{Pics:[]}
			}
		};
	};
	var ctrlComment = function(Comment, realView) {
		$('.commit').rogerOnceClick(Comment, function(e){
			var user = $.rogerGetLoginUser()
			if(!user) {
				$.rogerShowLogin();
				return;
			}
			var usr =$.rogerGetLoginUser();
			e.data.Comment.UserID = usr.UserID;
			//console.log(usr);
			$.rogerPost('/comment/plan', e.data, function(respJSON){
				$.rogerRefresh();
			});
		});
	};
	var ctrlPlandetail = function(response, realView) {

        var pickr = $("#calendar").flatpickr({
            inline: true,
            "mode": "multiple"
		});
        pickr.selectedDates.push('');
		realView.rogerCropImages();
        frameCtrl();

		$('#policy').html(response.PlanInfo[0].Policy.replace(/\r\n/g, '<br>'));
		realView.rogerCropImages();
		$.rogerTrigger('#plan-comment','#/comment',{PlanID:response.PlanInfo[0].PlanID});

	};

    var ctrlOrderlist = function(response, realView) {

        realView.rogerCropImages();
    };

	$.rogerRouter({
		'#/':							{view:'home.html',										rootrest:'/home', 						ctrl: ctrlHome},
		'#/plandetail': 				{view:'plandetail.html',									rootrest:'/plan/detail', 				ctrl: ctrlPlandetail},
        '#/orderlist': 				{view: 'orderlist.html', 								rootrest: '/order/list', 				ctrl: ctrlOrderlist},
		'#/comment':             		{fragment: 'fragment/comment.html',					init: initComment,							ctrl: ctrlComment}
	});
	
	
})();