/**
 * Created by sav on 2016/7/22.
 */
(function(){

    var _fakeData = window._FAKE_DATA_;

    var _apiExtension = "",
        _apiPath = "../api/";

    window.ApiProxy =
    {
        callApi: function(apiName, params, fakeDataName, cb)
        {
            var apiUrl = _apiPath + apiName + _apiExtension,
                method = "POST";

            if(fakeDataName !== false)
            {
                if(!fakeDataName || fakeDataName === true) fakeDataName = apiName;
            }

            if(_fakeData && Main.settings.useFakeData && fakeDataName)
            {
                //if(fakeDataName === true) fakeDataName = apiName;

                var response = _fakeData[fakeDataName];

                TweenMax.delayedCall(.1, function()
                {
                    complete(response);
                });
            }
            else
            {
                $.ajax
                ({
                    url: apiUrl,
                    type: method,
                    data: params,
                    dataType: "json"
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
        }
    };

}());