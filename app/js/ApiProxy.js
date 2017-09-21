/**
 * Created by sav on 2016/7/22.
 */
(function(){

    var _fakeData = window._FAKE_DATA_;

    var _apiExtension = "",
        _apiPath = "./api/",
        _method = "POST",
        _dataType = "json";

    window.ApiProxy =
    {
        callApi: function(apiName, params, fakeDataName, cb, method)
        {
            var apiUrl = _apiPath + apiName + _apiExtension;

            if(!method) method = _method;

            if(fakeDataName !== false)
            {
                if(!fakeDataName || fakeDataName === true) fakeDataName = apiName;
            }

            if(_fakeData && (Main.settings.useFakeData || fakeDataName))
            {
                //console.log(fakeDataName);
                if(Main.settings.useFakeData && fakeDataName === false) fakeDataName = apiName;
                //if(fakeDataName === true) fakeDataName = apiName;

                var response = _fakeData[fakeDataName];

                TweenMax.delayedCall(.1, function()
                {
                    complete(response);
                });
            }
            else
            {
                //apiUrl = "http://admin.apac.jktarots.com:9454/api/banner?type=jsonp";
                if(_dataType === "jsonp") apiUrl += "?type=jsonp";

                //console.log(apiUrl);

                $.ajax
                ({
                    url: apiUrl,
                    crossDomain: true,
                    type: method,
                    data: params,
                    dataType: _dataType
                })
                .done(complete)
                .fail(function ()
                {
                    //alert("無法取得伺服器回應");
                    complete({error:"API: ["+apiName+"] 無法取得伺服器回應"});
                });
            }

            function complete(response)
            {
                if(cb) cb.call(null, response);
            }
        },

        getApiPath: function()
        {
            return _apiPath;
        },

        setApiPath: function(path)
        {
            _apiPath = path;
        },

        getMethod: function()
        {
            return _method;
        },

        sendClickEvent: function(apiName)
        {
            var apiUrl = _apiPath + apiName;

            $.ajax
            ({
                url: apiUrl,
                type: "POST"
            })
                .done(function()
                {
                    console.log("done");
                })
                .fail(function ()
                {
                    console.log("send click event: ["+apiName+"] fail");
                });
        }
    };

}());