var demo = angular.module("demo", ["RongWebIMWidget"]);

demo.config(function ($logProvider) {
    // $logProvider.debugEnabled(false);
})

demo.controller("main", ["$scope", "WebIMWidget", "$http", '$location', function ($scope, WebIMWidget,
                                                                     $http) {

    var key = 'uwd1c0sxdlx2', //请填写
        once = '1024', stamp = ''+new Date().getTime();
    var Signature = Sha1.hash(key+once+stamp);
    var uid = $location.search().uid, uname = $location.search().uname, picurl = $location.search().picurl;

    $http({
        url: 'http://api.cn.ronghub.com/user/getToken.json',
        method: "POST",
        data: {userId:'',name:'',portraitUri:''},
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'App-Key': key,
            'Nonce': once,
            'Timestamp':stamp,
            'Signature': Signature
        }
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
                WebIMWidget.setConversation(WebIMWidget.EnumConversationType.PRIVATE, uid, '和'+uname+'对话中');
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
