$(function () {
	$.ajaxSetup ({
		// Disable caching of AJAX responses
		cache: false
	});
	$.ajaxPrefilter(function( options, original_Options, jqXHR ) {
		options.async = true;
	});
});
(function( $, undefined ){
	$.extend({
		rogerGetPath:function() {
			var link = $._rogerGetLocation();
			return link.substring(0, link.indexOf("?"));
		},
		rogerWindowPath:function() {
			var link = window.location;
			return link.substring(0, link.indexOf("?"));
		},
		rogerGetURLJsonParams:function() {
			var link = $._rogerGetLocation();
			var url = link.substring(link.indexOf("?")+1);
			var hash;
			var json = {};
			var hashes = url.split('&');
			for (var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				json[hash[0]] = hash[1];
			}
			return json;
		},
		rogerWindowURLParamsString:function() {
			var link = window.location.search;
			return link;
		},
		rogerGetUrlParam:function(key) {
			var params = $.rogerGetURLJsonParams()
			if(params) {
				return params[key];
			}
		},
		_RogerLoadView:function(srcView, destContainer, srcViewReqURL, srcViewReqJSON, callback){
			if(srcView && destContainer && srcViewReqURL) {
				var $view = $("<div/>");
				$($view).load(srcView, function () {
					$.ajax({
						url: srcViewReqURL, type: 'post', dataType: 'json', async: false, data: srcViewReqJSON,
						success: function(respJSON) {
							destContainer.empty();
							destContainer.hide();
							var realView = $view.tmpl(respJSON);
							destContainer.html("").append(realView);
							destContainer.show();
							if(callback) {
								callback(respJSON, realView);
							}
						}
					});
				});
			}
		},
		rogerPost: function (reqURL, reqJSON, callback) {
			$.ajax({
				url: reqURL, type: 'post', dataType: 'json', data: reqJSON,
				success: function(respJSON) {
					if(callback) {
						callback(respJSON);
					}
				}
			});
		},
		rogerRouter: function(router) {
			window._rogerRouter = router;
		},
		_rogerSetLocation: function(loc) {
			//window._rogerCurrLink = loc;
			window.name = loc;
		},
		_rogerGetLocation: function() {
			if(!window.name) {
				return '#/'+$.rogerWindowURLParamsString();
			}
			return window.name;//window._rogerCurrLink;
		},
		rogerGetRouter: function(path) {
			return window._rogerRouter[path];
		},
		rogerLocation: function(url) {
			if(url.substring(0,2)=='#/'){
				var path = url.indexOf("?") > 0 ? url.substring(0, url.indexOf("?")): url;
				var router = $.rogerGetRouter(path);
				if (router) {
					$._rogerSetLocation(url);
					$._RogerLoadView(
						router.view, 
						window._rogerAppContainer, 
						router.rootrest, 
						$.rogerGetURLJsonParams(), 
						function(respJSON, realView) {
							realView._RogerReloadRouters();
							router.ctrl(respJSON, realView);
						}  
					);
				}
			}
		},
		rogerScale: function(src_w, src_h, dst_w, dst_h) {
			var sw = parseFloat(src_w);
			var sh = parseFloat(src_h);
			var dw = parseFloat(dst_w);
			var dh = parseFloat(dst_h);
			var k = dst_h > dst_w ? src_h / dst_h : src_w / dst_w ;
			return  dst_h > dst_w ? (dst_h < src_h ? {w:dst_w, h:dst_h}:{w:dst_w * k, h:dst_h * k}) : (dst_w < src_w ? {w:dst_w, h:dst_h}:{w:dst_w * k, h:dst_h * k});
		},
		rogerGetLoginUser: function(){
			return $.cookie("roger");
		},
		rogerShowLogin: function(){
			$(window._rogerLoginForm).modal('show');
		},
		rogerInitLoginForm: function(loginFormID, reqURL, redirectURL) {
			$(loginFormID).rogerSubmit(reqURL, function(respJSON){
				if(respJSON[0] && respJSON[0].UserID > 0) {
					//window.open(redirectURL,'_blank');
					//window.location = '/dashboard.html?UserID='+respJSON[0].UserID;
					$.removeCookie("roger");
					$.cookie("roger", respJSON[0], { expires : 10 });
					$.rogerRefresh();
				}
			});
			$(loginFormID).modal({ show: false});
			window._rogerLoginForm = loginFormID;
		},
		rogerRefresh: function() {
			$.rogerLocation($._rogerGetLocation());
		}
	});
	$.fn.extend({
		_RogerReloadRouters: function () {
			var elems = $(this).find('a[href]');
			if(elems && elems.length > 0) {
				elems.each(function(){
					var url = $(this).attr('href');
					if(url.substring(0,2)=='#/'){
						$(this).click(function (e) {
							e.preventDefault();
							$.rogerLocation(url);
						});
					}
				});
			}
		},
		rogerGo: function () {
			window._rogerAppContainer = $(this);
			$('html')._RogerReloadRouters();
			$.rogerRefresh();//$.rogerLocation($._rogerGetLocation());//'#/'+$.rogerWindowURLParamsString());
		},
		rogerOnClickRouter: function(container, viewReqURL, viewReqJSON, callback ) {
			$(this).click(function (e) {
				e.preventDefault();
				$._rogerSetLocation($(this).data("href"));
				$._RogerLoadView($(this).data("href"), container, viewReqURL, viewReqJSON, callback );
			});
		},
		rogerOnClickTrigger: function(container, viewReqURL, viewReqJSON, callback ) {
			$(this).click(function (e) {
				e.preventDefault();
				$._RogerLoadView($(this).data("href"), container, viewReqURL, viewReqJSON, callback );
			});
		},
		rogerReloadFile: function (file, callback) {
			var $div = $("<div/>");
			var _this = $(this);
			$($div).load(file, function () {
				_this.empty();
				_this.hide();
				_this.html("").append($div);
				_this.show();
				if(callback) {
					callback($div);
				}
			});
		},
		rogerSubmit: function (reqURL, callback) {
			$(this).on('submit', function(e) {
				e.preventDefault();
				$.ajax({
					url: reqURL, type: 'post', dataType: 'json', data: $(this).serialize(),
					success: function(respJSON) {
						if(callback) {
							callback(respJSON);
						}
					}
				});
			});
		},
		rogerCropImages: function () {
			var elems = $(this).find('img[data-src]');
			if(elems && elems.length > 0) {
				elems.each(function(){
					var parent = $(this).parent();
					var width = Math.ceil(parent.width());
					var height = Math.ceil(parent.height());
					var src = $(this).data('src');
					var index = src.lastIndexOf(".");
					var newSrc = src.substring(0, index)+"_"+width+"x"+height+src.substring(index);
					$(this).attr('src', newSrc);
				});
			}
		},
		rogerUploadImage: function ( width, height, callback) {
			if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
			  return;
			}  
			$(this).hide();
			$(this).append('<div><canvas id="photo" style="position:relative;width:100%;height:100%" /><input type="file" style="position:absolute;opacity:0;top:0;bottom:0;left:0;right:0;width:100%" multiple="multiple"/></div>');
			$('input[type="file"]').change(function(e){
				var files = this.files;
				if (!files[0] || !files[0].type) return;
				for(var i in files) {
				  if (files[i] && files[i].type && files[i].type.indexOf('image') > -1) {
					var reader = new FileReader();
					reader.onloadend = function (evt) {
						var img = new Image();
						img.src = evt.target.result;
						var avatar = document.getElementById("photo");
						var w = width ? width : 300;
						var h = height ? height : 150;
						var ctx = avatar.getContext("2d");
						ctx.fillStyle="#ffffff";
						ctx.fillRect(0, 0, avatar.width, avatar.height);
						img.onload = function() {
							var k = $.rogerScale(w, h, img.width, img.height);
							avatar.width = k.w;
							avatar.height = k.h;
							ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, avatar.width, avatar.height);
							callback({raw:avatar.toDataURL("image/jpeg")});
							ctx.clearRect(0, 0, avatar.width, avatar.height);
						}
					}
					reader.readAsDataURL(files[i]);
				  }
				}
			});
			$(this).show();
			
		},
	});
})( jQuery );