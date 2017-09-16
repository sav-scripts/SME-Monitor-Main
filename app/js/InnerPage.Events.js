(function(){

    var $doms = {},
        _isInit = false,
        _dataList = null,
        _itemLister = null;

    var self = window.InnerPage.Events =
    {
        init: function(onReady)
        {
            $doms.container = $("#events");

            $.extend($doms,
            {
                content: $doms.container.find(".content"),
                itemContainer: $doms.container.find(".item-container"),
                itemSample: $doms.container.find(".item")
            });

            $doms.itemSample.detach();

            ApiProxy.callApi('event', {}, false, function(response)
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
                        ga("send", "event", "/Index", "/Events/click", dataObj.id);

                        if(dataObj.link)
                        {
                            window.open(dataObj.link, dataObj.target? dataObj.target: "_blank");
                        }
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
