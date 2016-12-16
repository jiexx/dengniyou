$(function () {
	$.ajaxSetup ({
		// Disable caching of AJAX responses
		cache: false
	});
	$.ajaxPrefilter(function( options, original_Options, jqXHR ) {
		options.async = true;
	});
	window.currLink = '';
	window.initLinks = function() {
		$("a").click(function (e) {
			e.preventDefault();
			window.currLink = $(this).attr("href");
			var $div = $("<div/>");
			$($div).load($(this).attr("href"), function () {
				$("#app").empty();
				$("#app").hide();
				$("#app").html("").append($div);
				$("#app").show();
				setTimeout(function() {
					$("#footer").load("footer.html"); 
				}, 2000);
			});
		});
	};
	initLinks();
	window.debug = function(a, b, c) {
		var x = 1;
	}
	window.reloadTarget = function (target) {
		if(target) {
			var $div = $("<div/>");
			$($div).load($(this).attr("href"), function () {
				target.empty();
				target.hide();
				target.html("").append($div);
				target.show();
			});
		}
	};
	window.initModal = function (file) {
		var $div = $("<div/>");
		$($div).load(file, function () {
			$("#modal").empty();
			$("#modal").hide();
			$("#modal").html("").append($div);
			$("#modal").show();
		});
	};
	window.fitImages = function () {
		var elems = $('img[data-src]');
		if(elems) {
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
	};
	window.getUrlParameter = function getUrlParameter(sParam) {
		var url = window.currLink.substring(window.currLink.indexOf("?")+1);
		var sPageURL = decodeURIComponent(url),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};
});
(function( jQuery, undefined ){
	JQuery.fn.extend({
		reloadTargetFromURLTmpl:function(target, URL, params, callback){
			if(target && URL) {
				var result = null;
				var $view = $("<div/>");
				$($view).load($(this[0]).attr("href"), function () {
					$.ajax({
						url: URL, type: 'post', dataType: 'json', async: false, data: params,
						success: function(data) {
							//console.log($("#gerHome"));
							//console.log($("#gerHome").tmpl( data ));
							target.empty();
							target.hide();
							var n = $view.tmpl(data);
							target.html("").append(n);
							target.show();
							callback();
						}
					});
				});
			}
		}
	});
})( jQuery );