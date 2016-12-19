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
		rogerPost: function (reqURL, reqJSON, callback) {
			$(this).on('submit', function(e) {
				e.preventDefault();
				$.ajax({
					url: reqURL, type: 'post', dataType: 'json', data: reqJSON,
					success: function(respJSON) {
						if(callback) {
							callback(respJSON);
						}
					}
				});
			});
		},
		rogerRouter: function(router) {
			window._rogerRouter = router;
		},
		_rogerSetLocation: function(loc) {
			window._rogerCurrLink = loc;
		},
		_rogerGetLocation: function() {
			return window._rogerCurrLink;
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
							/*var url = $(this).attr('href');
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
							}*/
						});
					}
				});
			}
		},
		rogerGo: function () {
			window._rogerAppContainer = $(this);
			$.rogerLocation('#/'+$.rogerWindowURLParamsString());
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
	});
})( jQuery );