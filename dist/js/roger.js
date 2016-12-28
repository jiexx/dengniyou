$(function () {
	$.ajaxSetup ({
		// Disable caching of AJAX responses
		cache: false
	});
	$.ajaxPrefilter(function( options, original_Options, jqXHR ) {
		options.async = true;
	});
	function escapeReplacer (m) {
		switch (m) {
			case '~1': return '/'
			case '~0': return '~'
		}
		throw new Error('Invalid tilde escape: ' + m)
	}

	function untilde (str) {
		if (!/~/.test(str)) return str
		return str.replace(/~[01]/g, escapeReplacer)
	}

	function setter (obj, pointer, value) {
		var part
		var hasNextPart

		for (var p = 1, len = pointer.length; p < len;) {
			part = untilde(pointer[p++])
			hasNextPart = len > p

			if (typeof obj[part] === 'undefined') {
				// support setting of /-
				if (Array.isArray(obj) && part === '-') {
					part = obj.length
				}

				// support nested objects/array when setting values
				if (hasNextPart) {
					if ((pointer[p] !== '' && pointer[p] < Infinity) || pointer[p] === '-') obj[part] = []
					else obj[part] = {}
				}
			}

			if (!hasNextPart) break
			obj = obj[part]
		}

		var oldValue = obj[part]
		if (value === undefined) delete obj[part]
		else obj[part] = value
		return oldValue
	}

	function compilePointer (pointer) {
		if (typeof pointer === 'string') {
			pointer = pointer.split('/')
			if (pointer[0] === '') return pointer
			throw new Error('Invalid JSON pointer.')
		} else if (Array.isArray(pointer)) {
			return pointer
		}

		throw new Error('Invalid JSON pointer.')
	}

	function get (obj, pointer) {
		if (typeof obj !== 'object') throw new Error('Invalid input object.')
		pointer = compilePointer(pointer)
		var len = pointer.length
		if (len === 1) return obj

		for (var p = 1; p < len;) {
			obj = obj[untilde(pointer[p++])]
			if (len === p) return obj
			if (typeof obj !== 'object') return undefined
		}
	}

	function set (obj, pointer, value) {
		if (typeof obj !== 'object') throw new Error('Invalid input object.')
		pointer = compilePointer(pointer)
		if (pointer.length === 0) throw new Error('Invalid JSON pointer for set.')
		return setter(obj, pointer, value)
	}

	function compile (pointer) {
		var compiled = compilePointer(pointer)
		return {
			get: function (object) {
				return get(object, compiled)
			},
			set: function (object, value) {
				return set(object, compiled, value)
			}
		}
	}
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
			if(link.indexOf("?") < 0) {
				return null;
			}
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
		_RogerLoadViewByJSON:function(srcView, destContainer, reqJSON, callback){
			if(srcView && destContainer  ) {
				var $view = $("<div/>");
				$($view).load(srcView, function () {
					destContainer.empty();
					destContainer.hide();
					var realView = $view.tmpl(reqJSON);
					destContainer.html("").append(realView);
					destContainer.show();
					if(callback) {
						callback(reqJSON, realView);
					}
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
		rogerGetAppContainer:function() {
			return window._rogerAppContainer;
		},
		rogerSetAppContainer:function(app) {
			window._rogerAppContainer = app;
		},
		rogerGetRouter: function(path) {
			return window._rogerRouter[path];
		},
		rogerLocation: function(url, reqJSON) {
			if(url.substring(0,2)=='#/'){
				var path = url.indexOf("?") > 0 ? url.substring(0, url.indexOf("?")): url;
				var router = $.rogerGetRouter(path);
				if (router) {
					if(router.view) {
						$._rogerSetLocation(url);
						$._RogerLoadView(
							router.view,
							$.rogerGetAppContainer(),
							router.rootrest,
							$.rogerGetURLJsonParams(),
							function(respJSON, realView) {
								realView._RogerReloadRouters();
								router.ctrl(respJSON, realView);
							}
						);
					}else if(router.fragment) {
						var req = reqJSON ? reqJSON : router.init();
						$._RogerLoadViewByJSON(
							router.fragment,
							$.rogerGetAppContainer(),
							req,
							function(respJSON, realView) {
								realView._RogerReloadRouters();
								router.ctrl(respJSON, realView);
							}
						)
					}
				}
			}
		},
        rogerTrigger: function(container, url, viewReqJSON ) {
            if(url.substring(0,2)=='#/') {
                var router = $.rogerGetRouter(url);
                if (router) {
					if(router.view) {
						$._rogerSetLocation(url);
						$._RogerLoadView(
							router.view,
							$(container),
							router.rootrest,
							viewReqJSON,
							function(respJSON, realView) {
								realView._RogerReloadRouters();
								router.ctrl(respJSON, realView);
							}
						);
					}else if(router.fragment){
						$._RogerLoadViewByJSON(
							router.fragment,
							$(container),
							router.init(),
							function(respJSON, realView) {
								realView._RogerReloadRouters();
								router.ctrl(respJSON, realView);
							}
						)
					}
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
			if(!$.cookie("roger")) {
				return null;
			}
			return JSON.parse($.cookie("roger"));
		},
        rogerIsLogined: function(){
            return $.rogerGetLoginUser() && $.rogerGetLoginUser().UserID >0;
        },
		rogerShowLogin: function(){
			$(window._rogerLoginForm).modal('show');
		},
        rogerHideLogin: function(){
            $(window._rogerLoginForm).modal('hide');
            //$(loginFormID).modal({ show: false});
        },
        rogerLogout: function(){
            $.removeCookie("roger");
        },
		rogerLogin: function(loginFormID, reqURL) {
        	var user = $.rogerGetLoginUser();
        	if( !user || !user.UserID ) {
                $(loginFormID).rogerSubmit(reqURL, function (respJSON) {
                    if (respJSON[0] && respJSON[0].UserID > 0) {
                        //window.open(redirectURL,'_blank');
                        //window.location = '/dashboard.html?UserID='+respJSON[0].UserID;
                        $.removeCookie("roger");
                        $.cookie("roger", JSON.stringify(respJSON[0]), {expires: 10});
                        $.rogerRefresh();
                    }
                });
            }
			window._rogerLoginForm = loginFormID;
		},
		rogerRefresh: function(reqJSON) {
			$.rogerLocation($._rogerGetLocation(),reqJSON);
		},
		_rogerGetTarget: function(data, str){
			var a = str.split(',');
			var o = data[a[0]];
			var i = 1;
			while(o && i<a.length) {
				o = data[a[i++]];
			}
			if(i == a.length) {
				return o;
			}
			return null;
		},
		rogerCollectValue: function(data){
			var app = $.rogerGetURLJsonParams();
			var elems = app.find('[data-value]'), count = elems.length;
			elems.each(function(){
				var ev = $._data($(this), 'events');
				if(!ev || !ev.change) {
					var str = $(this).data('value');
					var pointer = jsonpointer.compile(str)
					$(this).on("change paste keyup", function () {
						var val = $(this).val();
						pointer.set(data, val)
					});
				}
			})
		},
		rogerCollectNew: function(data){
			var app = $.rogerGetURLJsonParams();
			var elems = app.find('[data-value]'), count = elems.length;
			elems.each(function(){
				var ev = $._data($(this), 'events');
				if(!ev || !ev.change) {
					var str = $(this).data('value');
					var pointer = jsonpointer.compile(str)
					$(this).on("change paste keyup", function () {
						var val = $(this).val();
						pointer.set(data, val)
					});
				}
			})
		},
		rogerCollectChange: function(data){
			var app = $.rogerGetURLJsonParams();
			var elems = app.find('[data-value]'), count = elems.length;
			elems.each(function(){
				var ev = $._data($(this), 'events');
				if(!ev || !ev.change) {
					var str = $(this).data('value');
					var pointer = jsonpointer.compile(str)
					$(this).on("change paste keyup", function () {
						var val = $(this).val();
						pointer.set(data, val)
					});
				}
			})
		},
		rogerCollectDelete: function(data){
			var app = $.rogerGetURLJsonParams();
			var elems = app.find('[data-value]'), count = elems.length;
			elems.each(function(){
				var ev = $._data($(this), 'events');
				if(!ev || !ev.change) {
					var str = $(this).data('value');
					var pointer = jsonpointer.compile(str)
					$(this).on("change paste keyup", function () {
						var val = $(this).val();
						pointer.set(data, val)
					});
				}
			})
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
			$.rogerSetAppContainer( $(this) );
			$('html')._RogerReloadRouters();
			$.rogerRefresh();//$.rogerLocation($._rogerGetLocation());//'#/'+$.rogerWindowURLParamsString());
		},
		rogerOnceClick: function (callback) {
			var ev = $._data($(this), 'events');
			if(!ev || !ev.click) {
				$(this).click(function (e) {
					e.preventDefault();
					callback(e);
				});
			}
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
		rogerLoadView: function(href, jsondata, callback ) {
			$._RogerLoadViewByJSON(srcView, $(this), jsondata, callback);
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
			
		}
	});
})( jQuery );