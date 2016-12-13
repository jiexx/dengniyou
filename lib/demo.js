
var app = angular.module('roger', [
  'ngRoute',
  'mobile-angular-ui',
  'mobile-angular-ui.gestures',
  "ngCookies",
  'myphoto',
  'myphotos',
]);

app.run(function($transform) {
  window.$transform = $transform;
});


app.config(function($routeProvider) {
  $routeProvider.when('/',            {templateUrl: 'home.html', 		controller : 'home', reloadOnSearch: false});
});
app.factory('DATA', function ($http) {
    return {
		HOST3 : "http://10.101.1.36:8080",
        HOST2 : "http://123.59.144.44",//http://123.59.144.44",//"http://10.101.1.165:8096",
        IMG_HOST : "http://123.59.144.47/",//"http://10.101.1.165:8097/"
		HOST : "http://10.101.1.219:8088",//"http://123.59.144.169:8088",//
        USER_ID: 0,
		USER: null,
        _self : null,
        getSelf : function() {
            if( this._self == null ) {

            }
            return this._self;
        },
    }
});

function setUserID(userID) {
    console.log('userID = ' + userID);
    angular.element(document.body).injector().get('DATA').USER_ID = userID;
};

app.controller('appCtrl', function ($scope, $rootScope, $location, $cookieStore, $http, DATA) {
	$scope.reload = function(){
		location.reload(); 
	};
	var uid = $cookieStore.get("uid");
	if(uid && uid != 99999) {
		ajaxPost($http, DATA, '/login', {userid:uid, name:'', pwd:'' }, function(resp){
			if(resp && resp.length > 0) {
				$cookieStore.put("uid", resp[0].id);
				var auth = parseAuthstr(resp);
				$scope.AUTH = auth[0].privileges;
				$scope.keys = Object.keys($scope.AUTH);
				//$location.path('/cover');//.search({guideID: id});
			}
		});
	}else if(uid == 99999) {
		if(!sudo) {
			$http.get('../lib/sidebarcfg.js').success (function(CFG){
				sudo = CFG;
				$scope.AUTH = sudo;
				$scope.keys = Object.keys($scope.AUTH);
			});
		}else {
			$scope.AUTH = sudo;
			$scope.keys = Object.keys($scope.AUTH);
		}
	}else {
		$location.path('/');
	}
});
function authorize($cookieStore, $location) {
	if(!$cookieStore.get("uid"))
		$location.path('/');
}
function ajaxPost($http, DATA, qry, d, callback) {
	$http({
			method : 'POST',
			url : DATA.HOST + qry,
			data : d
		}).success(function (resp, status, headers, config) {
			callback(resp);
		}).error(function (data, status, headers, config) {
			console.log(""+data);
		}); 
};
app.controller('schedule', function ($scope, $rootScope, $location, $cookieStore, $http, $timeout, DATA) {
	$scope.columns = [
        {"name": "fa-user", "title": "Come up with a POC for new Project"},
        {"name": "fa-film", "title": "Explore new IDE for Development"},
        {"name": "fa-star", "title": "Develop ui for tracker module"},
        {"name": "fa-heart", "title": "Test user module"}
      ];

});
app.controller('story', function ($scope, $rootScope, $location, $cookieStore, $http, $timeout, DATA) {
	$scope.items = [];
	$scope.uploadImage = {};
	$scope.newTitle = function() {
		$scope.items.push({title:'add',url:null,description:null});
	};
	$scope.doneImage = function(raw) {
		$scope.items.push({title:null,url:raw,description:null});
		$scope.$apply();
	};
	$scope.newDescription = function() {
		$scope.items.push({title:null,url:null,description:'add'});
	};
	$scope.commit = function() {
		console.log(JSON.stringify($scope.items));
	};
});