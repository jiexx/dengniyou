function scale(src_w, src_h, dst_w, dst_h) {
	var sw = parseFloat(src_w);
	var sh = parseFloat(src_h);
	var dw = parseFloat(dst_w);
	var dh = parseFloat(dst_h);
	var k = dst_h > dst_w ? src_h / dst_h : src_w / dst_w ;
	return  dst_h > dst_w ? (dst_h < src_h ? {w:dst_w, h:dst_h}:{w:dst_w * k, h:dst_h * k}) : (dst_w < src_w ? {w:dst_w, h:dst_h}:{w:dst_w * k, h:dst_h * k});
}
angular.module('myphoto', [])
	.directive('rogerPhoto', [function() {
		return {
			scope: {
				id: '@',
				rogerData: '=',
				rogerWidth: '=',
				rogerHeight: '=',
				rogerOptions: '@',
				rogerFinish: '&'
			},
			template: '<div><canvas id="photo" style="position:relative;width:100%;height:100%" /><input type="file" style="position:absolute;opacity:0;top:0;bottom:0;left:0;right:0;width:100%" onchange="angular.element(this).scope().upload(this.files)"/></div>',
			replace: true,
			link: function($scope, elem, attr, ctrl) {
				$scope.upload = function (files) {
					//Take the first selected file
					if (!files[0] || !files[0].type)
						return;
					if (files[0].type.indexOf('image') > -1) {
						var reader = new FileReader();
						reader.onloadend = function (evt) {
							var img = new Image();
							img.src = evt.target.result;
							var avatar = document.getElementById("photo");
							var w = $scope.rogerWidth ? $scope.rogerWidth : 300;
							var h = $scope.rogerHeight ? $scope.rogerHeight : 150;
							var ctx = avatar.getContext("2d");
							ctx.fillStyle="#ffffff";
							ctx.fillRect(0, 0, avatar.width, avatar.height);
							img.onload = function() {
								var k = scale(w, h, img.width, img.height);
								avatar.width = k.w;
								avatar.height = k.h;
								ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, avatar.width, avatar.height);
								$scope.rogerFinish({raw:avatar.toDataURL("image/jpeg"),data:$scope.rogerData});
								ctx.clearRect(0, 0, avatar.width, avatar.height);
							}
							//scope.$apply();
						}
						reader.readAsDataURL(files[0]);
					} else {
						$scope.rogerData = null;
						$scope.$apply();
					}
					
				};
				//var p = $('div', elem).attr('ng-model', 'rogerData');
				//$compile(p)($scope.$parent);
			}
		};
	}]);
angular.module('myphotos', [])
	.directive('rogerPhotos', [function() {
		return {
			scope: {
				id: '@',
				rogerData: '=',
				rogerWidth: '=',
				rogerHeight: '=',
				rogerOptions: '@',
				rogerFinish: '&'
			},
			template: '<div><canvas id="photo" style="position:relative;width:100%;height:100%" /><input type="file" style="position:absolute;opacity:0;top:0;bottom:0;left:0;right:0;width:100%" onchange="angular.element(this).scope().upload(this.files)" multiple="multiple"/></div>',
			replace: true,
			link: function($scope, elem, attr, ctrl) {
				$scope.upload = function (files) {
					//Take the first selected file
					if (!files[0] || !files[0].type)
						return;
					for(var i in files) {
					  if (files[i] && files[i].type && files[i].type.indexOf('image') > -1) {
					  	var reader = new FileReader();
					  	reader.onloadend = function (evt) {
					  		var img = new Image();
					  		img.src = evt.target.result;
					  		var avatar = document.getElementById("photo");
					  		var w = $scope.rogerWidth ? $scope.rogerWidth : 300;
					  		var h = $scope.rogerHeight ? $scope.rogerHeight : 150;
					  		var ctx = avatar.getContext("2d");
					  		ctx.fillStyle="#ffffff";
					  		ctx.fillRect(0, 0, avatar.width, avatar.height);
					  		img.onload = function() {
					  			var k = scale(w, h, img.width, img.height);
					  			avatar.width = k.w;
					  			avatar.height = k.h;
					  			ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, avatar.width, avatar.height);
					  			$scope.rogerFinish({raw:avatar.toDataURL("image/jpeg"),data:$scope.rogerData});
					  			ctx.clearRect(0, 0, avatar.width, avatar.height);
					  		}
					  		//scope.$apply();
					  	}
					  	reader.readAsDataURL(files[i]);
					  } else {
					  	$scope.rogerData = null;
					  	$scope.$apply();
					  }
					}
				};
				//var p = $('div', elem).attr('ng-model', 'rogerData');
				//$compile(p)($scope.$parent);
			}
		};
	}]);
angular.module('mytxphotos', [])
	.directive('rogerTxphotos', ['$timeout',function($timeout) {
		return {
			scope: {
				id: '@',
				rogerData: '=',
				rogerWidth: '=',
				rogerHeight: '=',
				rogerOptions: '@',
				rogerOnfinish: '&',
				rogerControl: '=',
			},
			template: function(element, attrs) {  //attrs.formId attrs.label <form-input  label="Password" form-id="password"
				var htmlText = '<div><canvas id="photo" style="position:relative;width:100%;height:100%"/><div style="position:relative;width:100%;height:100%"/>'
								+'<div style='+attrs.rogerButtonstyle+'"><input type="file" id="fileUpload" style="width:100%;height:100%" onchange="angular.element(this).scope().upload(this.files)" multiple="multiple" /></div>'
								'</div>';
				return htmlText;
			},
			replace: true,
			link: function($scope, elem, attrs, ctrl) {
				$scope.internalControl = $scope.rogerControl || {};
				$scope.internalControl.trigger = function() {
					//$timeout(function() {
						//document.querySelector('#fileUpload').click();
						//angular.element(document.querySelector('#fileUpload')).triggerHandler("click");
					//});
					//angular.element(document.querySelector('#fileUpload')).triggerHandler("click");
				}
				$scope.upload = function (files) {
					//Take the first selected file
					if (!files[0] || !files[0].type)
						return;
					for(var i in files) {
					  if (files[i] && files[i].type && files[i].type.indexOf('image') > -1) {
					  	var reader = new FileReader();
					  	reader.onloadend = function (evt) {
					  		var img = new Image();
					  		img.src = evt.target.result;
					  		var avatar = document.getElementById("photo");
					  		var w = $scope.rogerWidth ? $scope.rogerWidth : 300;
					  		var h = $scope.rogerHeight ? $scope.rogerHeight : 150;
					  		var ctx = avatar.getContext("2d");
					  		ctx.fillStyle="#ffffff";
					  		ctx.fillRect(0, 0, avatar.width, avatar.height);
					  		img.onload = function() {
					  			var k = scale(w, h, img.width, img.height);
					  			avatar.width = k.w;
					  			avatar.height = k.h;
					  			ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, avatar.width, avatar.height);
								$scope.rogerOnfinish({raw:avatar.toDataURL("image/jpeg"),data:$scope.rogerData});
					  			ctx.clearRect(0, 0, avatar.width, avatar.height);
					  		}
					  		//scope.$apply();
					  	}
					  	reader.readAsDataURL(files[i]);
					  }// else {
					  	//$scope.rogerData = null;
					  //	$scope.$apply();
					 // }
					}
				};
				//var p = $('div', elem).attr('ng-model', 'rogerData');
				//$compile(p)($scope.$parent);
			}
		};
	}]);
	
angular.module('mycart', [])
	.directive('rogerAddToCart', function() {
		function link($scope, elem, attrs, ctrl) {
			elem.on('click', function(event){
				var cartBox = document.getElementById(attrs.rogerCart).getBoundingClientRect();
				var cartElem = angular.element(document.getElementById(attrs.rogerCart));
				var offsetTopCart = cartBox.top;
				var offsetLeftCart = cartBox.left;
				var widthCart = cartBox.width;
				var heightCart = cartBox.height;
				var imgBox = document.getElementById(attrs.rogerImage).getBoundingClientRect();
				var offsetLeft = imgBox.left;
				var offsetTop = imgBox.top;
				var imgSrc = angular.element(document.getElementById(attrs.rogerImage)).prop("currentSrc");
				var parentElem = angular.element(document.getElementById(attrs.rogerImage).parentNode);
				console.log(offsetLeft + ' ' + offsetTop + ' ' + (offsetTopCart+heightCart/2)+ ' heightCart:' + heightCart+ ' offsetTopCart:'+ offsetTopCart + ' offsetLeftCart:' + offsetLeftCart);
				var imgClone = angular.element('<img src="' + imgSrc + '"/>');
				imgClone.css({
					'height': '150px',
					'position': 'fixed',
					'top': offsetTop + 'px',
					'left': offsetLeft + 'px',
					'opacity': 0.5,
					'z-index':99999
				});
				imgClone.addClass('itemaddedanimate');
				parentElem.append(imgClone);
				setTimeout(function () {
					imgClone.css({
						'height': '75px',
						'position': 'fixed',
						'top': (offsetTopCart+heightCart/2)+'px',
						'left': (offsetLeftCart+widthCart/2)+'px',
						'opacity': 0.5,
						'z-index':99999
					});
				}, 500);
				setTimeout(function () {
					imgClone.css({
						'height': 0,
						'opacity': 0.5
					});
					cartElem.addClass('shakeit');
				}, 1000);
				setTimeout(function () {
					cartElem.removeClass('shakeit');
					imgClone.remove();
				}, 1500);
			});
		};
		return {
			restrict: 'E',
			link: link,
			transclude: true,
			replace: true,
			scope: {},
			template: '<button style="filter:Alpha(opacity=0); background:#000000;-moz-opacity:0;opacity:0;" ng-transclude></button>'
		};
	});