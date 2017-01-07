var demo = angular.module("demo", ["RongWebIMWidget"]);

demo.config(function ($logProvider) {
    // $logProvider.debugEnabled(false);
})
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}
demo.controller("main", ["$scope", "WebIMWidget", "$http", '$location', function ($scope, WebIMWidget,
                                                                     $http, $location) {

    var key = '4z3hlwrv4zzyt', //请填写
        once = '1658717659', stamp =  '1483791557';// ''+Math.floor(new Date().getTime() / 1000);
    var Signature = '8d23cb813948c1ff901391630ddc66bd2433bd38';//Sha1.hash(key+once+stamp);
    var uid = getURLParameter('uid'), uname = getURLParameter('uname') , picurl = getURLParameter('picurl') , tid=getURLParameter('tid');

    $http({
        url: 'http://api.cn.ronghub.com/user/getToken.json',
        method: "POST",
        data: {userId:uid,name:uname,portraitUri:picurl},
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'App-Key': key,
            'Nonce': once,
            'Timestamp':stamp,
            'Signature': Signature
        },
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
    }).success(function (data, status, headers, config) {
        if(data.code != 200) {
            return;
        }
        WebIMWidget.init({
            appkey: key,
            token: data.token,
            style: {
                width: 600,
                positionFixed: true,
                bottom: 20,
            },
            displayConversationList: true,
            conversationListPosition: WebIMWidget.EnumConversationListPosition.right,
            //hiddenConversations: [{type: WebIMWidget.EnumConversationType.PRIVATE, id: 'bb'}],
            onSuccess: function (id) {
                WebIMWidget.setUserInfoProvider(function (targetId, obj) {
                    obj.onSuccess({id: uid, name: uname, portraitUri: picurl});
                });
                WebIMWidget.setConversation(WebIMWidget.EnumConversationType.PRIVATE, tid, '和'+uname+'对话中');
                WebIMWidget.show();
            },
            onError: function (error) {
                console.log("error:" + error);
            }
        });
    }).error(function (data, status, headers, config) {
        $scope.status = status;
    });





    WebIMWidget.onClose = function () {
        console.log("已关闭");
    }



}]);

//http://www.rongcloud.cn/docs/web.html#聊天插件
