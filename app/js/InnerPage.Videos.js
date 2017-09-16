(function(){

    var $doms = {},
        _isInit = false,
        _dataList = null,
        _itemLister = null;

    var self = window.InnerPage.Videos =
    {
        init: function(onReady)
        {
            $doms.container = $("#videos");

            $.extend($doms,
                {
                    content: $doms.container.find(".content"),
                    itemContainer: $doms.container.find(".item-container"),
                    itemSample: $doms.container.find(".item")
                });

            $doms.itemSample.detach();

            ApiProxy.callApi('video', {}, false, function(response)
            {
                if(response.error)
                {
                    alert(response.error);
                }
                else
                {
                    _dataList = response.data_list;

                    _itemLister = new ItemLister(response.data_list, $doms.content, $doms.itemSample, function(dataObj)
                    {

                        ga("send", "event", "/Index", "/Videos/click", dataObj.id);

                        if(dataObj.link)
                        {
                            ApiProxy.sendClickEvent("video/"+dataObj.id+"/c");
                            window.open(dataObj.link, dataObj.target? dataObj.target: "_blank");
                        }
                    }, null,
                    {
                        '0': 1,
                        '1': 4
                    });
                }

                _isInit = true;
                onReady.call();
            });

            return self;
        },

        validateContent: function()
        {
            return false;
        },

        resize: function()
        {
            if(!_isInit) return;

            var vp = Main.viewport;
            if(vp.changed)
            {
                _itemLister.resize();
            }
        }
    };

}());
