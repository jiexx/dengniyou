var demo = angular.module("demo", ["RongWebIMWidget"]);

demo.config(function ($logProvider) {
    // $logProvider.debugEnabled(false);
})
var Base64 = {

// private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

// public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

// private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

// private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}
function getURLParameter(name) {
    var url = decodeURIComponent(decodeURIComponent(location.search));
    return ((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}
demo.controller("main", ["$scope", "WebIMWidget", "$http", '$location', function ($scope, WebIMWidget,
                                                                     $http, $location) {

      var uid = getURLParameter('uid'),
          uname = getURLParameter('uname') ,
          picurl = getURLParameter('picurl') ,
          tid=getURLParameter('tid'),
          no=getURLParameter('no'),
          token=Base64.decode(getURLParameter('token'));

     /* $http({
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
        }*/
    var height = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    var width = "innerWidth" in window ? window.innerWidth : document.documentElement.offsetWdith;

        WebIMWidget.init({
            appkey: no,
            token: token,
            style: {
                positionFixed: true,
                width:600,
                height:500,
                bottom: (height/2 - 250),
                left: (width/2 - 400),
            },
            displayConversationList: true,
            conversationListPosition: WebIMWidget.EnumConversationListPosition.right,
            //hiddenConversations: [{type: WebIMWidget.EnumConversationType.PRIVATE, id: 'bb'}],
            onSuccess: function (id) {
                /*WebIMWidget.setUserInfoProvider(function (targetId, obj) {
                    obj.onSuccess({id: uid, name: uname, portraitUri: picurl});
                });*/
                WebIMWidget.providerdata.currentUserInfo = {userId:uid, name:uname, portraitUri:picurl };
                //console.log(1,WebIMWidget.providerdata.currentUserInfo);
                WebIMWidget.setConversation(WebIMWidget.EnumConversationType.PRIVATE, tid, '对话中');
                WebIMWidget.show();
            },
            onError: function (error) {
                console.log("error:" + error);
            }
        });
    WebIMWidget.onReceivedMessage = function(message) {
        //console.log(message);
        //console.log(2,WebIMWidget.providerdata.currentUserInfo);
        if(message.content.user) {
            WebIMWidget.setUserInfoProvider(function (targetId, obj) {
                obj.onSuccess({id: message.senderUserId, name: message.content.user.name, portraitUri: message.content.user.portraitUri});
            });
        }
        if(!WebIMWidget.providerdata.currentUserInfo.userId) {
            WebIMWidget.providerdata.currentUserInfo = {userId:uid, name:uname, portraitUri:picurl };
        }else {
            WebIMWidget.providerdata.currentUserInfo.uid = uid;
            WebIMWidget.providerdata.currentUserInfo.name = uname;
            WebIMWidget.providerdata.currentUserInfo.portraitUri = picurl;
        }

    };
   /* }).error(function (data, status, headers, config) {
        $scope.status = status;
    });*/
    WebIMWidget.onClose = function () {
        console.log("已关闭");
    }



}]);

//http://www.rongcloud.cn/docs/web.html#聊天插件
