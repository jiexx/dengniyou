(function () {
	function frameCtrl() {
        if( !$.trim( $('#footer').html() ) ) {
            $('#footer').rogerReloadFile('./footer.html');
        }
        if( !$.trim( $('#modal').html() ) ) {
            $('#modal').rogerReloadFile('./fragment/dialog-login.html');
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
		$.rogerTrigger('#plan-comment','#/comment',{PlanID:response.PlanInfo[0].PlanID});
		
		$('#BUY').rogerOnceClick(response.PlanInfo[0].PlanID, function (e) {
			$.rogerPost('/pay',{PlanID:e.data}, function (respJSON) {
				console.log(respJSON);
                window.open(respJSON.url, '_blank');
            })
        })

	};
    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    var ctrlPlanpay1 = function(response, realView) {
    	var days = parseInt(response.PlanInfo[0].PlanDays)+1;
        var pickr = $("#calendar").flatpickr({
            inline: true,
            onChange:function (dateObj, dateStr) {
            	for(var i = 1 ; i < days ; i++) {
                    pickr.selectedDates.push(addDays(dateStr, i));
				}
                pickr.redraw();
            }
        });
        //pickr.selectedDates.push('');
        realView.rogerCropImages();
        frameCtrl();

        var adult = parseInt($('#adult option:selected').val());
        var kid = parseInt($('#kid option:selected').val());
        var adultprice = parseFloat(response.PlanInfo[0].AdultPrice);
        var kidprice = parseFloat(response.PlanInfo[0].KidPrice);
        var cash = adult*adultprice+kid*kidprice;
        $('.price').each(function () {
			$(this).html(''+cash);
        })

        var ev = $._data($('#adult'), 'events');
        if(!ev || !ev.change) {
            $('#adult').on("change", function () {
                adult = parseInt($('#adult option:selected').val());
                $('.price').each(function () {
                    cash = adult*adultprice+kid*kidprice
                    $(this).html(''+cash);
                })
            });
        }
        var ev = $._data($('#kid'), 'events');
        if(!ev || !ev.change) {
            $('#kid').on("change", function () {
                kid = parseInt($('#kid option:selected').val());
                $('.price').each(function () {
                    cash = adult*adultprice+kid*kidprice
                    $(this).html(''+cash);
                })
            });
        }

        $('#policy').html(response.PlanInfo[0].Policy.replace(/\r\n/g, '<br>'));

        $('#BUY').rogerOnceClick(null,function (e) {
            var usr = $.rogerGetLoginUser();
            if(!usr) {
            	$.rogerShowLogin();
            	return;
			}
        	var buy = {visitid:usr.UserID,
				servicetripid:response.PlanInfo[0].PlanID,
				servicetripname:response.PlanInfo[0].PlanName,
                servicetriptypeid:response.PlanInfo[0].PlanType,
                username:usr.UserName,
                guideid:response.PlanInfo[0].UserID,
                costmoney: cash,
                realcostmoney: cash,
                traveldays: response.PlanInfo[0].PlanDays,
                remarks: $('#note').val(),
                countryid:response.PlanInfo[0].CountryID,
                cityid:response.PlanInfo[0].StartCityID,
                orderdetails: [{
                    schedules: pickr.selectedDates,
                    personnum: adult,
                    adultNum: adult,
                    kidNum: kid,
                    fullname: $('#username').val(),
                    mobilephone: $('#phone').val(),
                    email: $('#mail').val()
                }]
			};

            $.rogerPost('/pay',buy, function (respJSON) {
                console.log(respJSON);
                window.open(respJSON.url, '_blank');
            })
        })

    };

    var ctrlOrderlist = function(response, realView) {

        realView.rogerCropImages();
    };

	$.rogerRouter({
		'#/':							{view:'home.html',										rootrest:'/home', 						ctrl: ctrlHome},
		'#/plandetail': 				{view:'plandetail.html',									rootrest:'/plan/detail', 				ctrl: ctrlPlandetail},
        '#/planpay1': 				{view:'plandetail-pay-1.html',							rootrest:'/plan/pay1',    				ctrl: ctrlPlanpay1},
        '#/orderlist': 				{view: 'orderlist.html', 								rootrest: '/order/list', 				ctrl: ctrlOrderlist},
		'#/comment':             		{fragment: 'fragment/comment.html',					init: initComment,							ctrl: ctrlComment}
	});
	
	
})();