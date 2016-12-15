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
			console.log(currLink);
			var $div = $("<div/>");
			$($div).load($(this).attr("href"), function () {
				$("#app").empty();
				$("#app").hide();
				$("#app").html("").append($div);
				$("#app").show();
			});
		});
	};
	initLinks();
	console.log($("a"));
	window.initModal = function (file) {
		var $div = $("<div/>");
		$($div).load(file, function () {
			$("#modal").empty();
			$("#modal").hide();
			$("#modal").html("").append($div);
			$("#modal").show();
		});
	};
	window.getUrlParameter = function getUrlParameter(sParam) {
		console.log('---->'+currLink);
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