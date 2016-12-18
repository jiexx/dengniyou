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
			return window._rogerCurrLink.substring(0, window._rogerCurrLink.indexOf("?"));
		},
		rogerGetURLJsonParams:function() {
			var url = window._rogerCurrLink.substring(window._rogerCurrLink.indexOf("?")+1);
			var hash;
			var json = {};
			var hashes = url.split('&');
			for (var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				json[hash[0]] = hash[1];
			}
			return json;
		},
		rogerGetUrlParam:function(key) {
			var params = $.rogerGetURLJsonParams()
			if(params) {
				return params[key];
			}
		},
		_RogerLoadView:function(srcView, destContainer, srcViewReqURL, srcViewReqJSON, callback){
			if(srcView && destContainer && URL) {
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
		rogerRouter: function(router) {
			window._rogerRouter = router;
		},
		rogerLocation: function(loc) {
			window._rogerCurrLink = loc;
		},
		rogerGetLocation: function() {
			return window._rogerCurrLink;
		},
		rogerGetRouter: function(path) {
			return window._rogerRouter[path];
		},
	});
	$.fn.extend({
		_RogerReloadRouters: function () {
			var elems = $(this).find('a[href]');
			if(elems && elems.length > 0) {
				elems.each(function(){
					var attr = $(this).attr('href');
					if(attr.substring(0,2)=='#/'){
						$(this).click(function (e) {
							e.preventDefault();
							var url = $(this).attr('href');
							var path = url.indexOf("?") > 0 ? url.substring(0, url.indexOf("?")): url;
							var router = $.rogerGetRouter(path);
							if (router) {
								$.rogerLocation(url);
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
						});
					}
				});
			}
		},
		rogerGo: function () {
			var router = window._rogerRouter['#/'];
			window._rogerAppContainer = $(this);
			if (router) {
				$.rogerLocation('#/');
				$._RogerLoadView(
					router.view, 
					$(this), 
					router.rootrest, 
					$.rogerGetURLJsonParams(), 
					function(respJSON, realView) {
						$('html')._RogerReloadRouters();
						router.ctrl(respJSON, realView);
					}  
				);
			}
		},
		rogerOnClickRouter: function(container, viewReqURL, viewReqJSON, callback ) {
			$(this).click(function (e) {
				e.preventDefault();
				window._rogerCurrLink = $(this).data("href");
				$._RogerLoadView($(this).data("href"), container, viewReqURL, viewReqJSON, callback );
			});
		},
		rogerOnClickTrigger: function(container, viewReqURL, viewReqJSON, callback ) {
			$(this).click(function (e) {
				e.preventDefault();
				$._RogerLoadView($(this).data("href"), container, viewReqURL, viewReqJSON, callback );
			});
		},
		rogerReloadFile: function (file) {
			var $div = $("<div/>");
			var _this = $(this);
			$($div).load(file, function () {
				_this.empty();
				_this.hide();
				_this.html("").append($div);
				_this.show();
			});
		},
		rogerSubmit: function (reqURL, reqJSON, callback) {
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
	});
})( jQuery );