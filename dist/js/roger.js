$(function () {
	$.ajaxSetup ({
		// Disable caching of AJAX responses
		cache: false
	});
	$("a").click(function (e) {
		e.preventDefault();
		var $div = $("<div/>");
		$($div).load($(this).attr("href"), function () {
			$("#app").hide();
			$("#app").html("").append($div);
			$("#app").show();
		});
	});
});