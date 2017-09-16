(function(){

    var $doms = {},
        _isInit = false,
        _dataList = null,
        _dataDic = {},
        _itemLister = null,
        _loadedDom;

    var self = window.InnerPage.Publication =
    {
        name: 'Publication',

        init: function(onReady)
        {
            $doms.container = $("#publication");

            $.extend($doms,
                {
                    content: $doms.container.find(".content"),
                    itemContainer: $doms.container.find(".item-container"),
                    itemSample: $doms.container.find(".item"),
                    innerPageContainer: InnerPage.$container.find("#publication-inner-page")
                });

            //$doms.btnBack = $doms.innerPageContainer.find(".btn-back").on(_CLICK_, function()
            //{
            //    Hash.to("/Publication");
            //});

            $doms.innerPageContainer.css('display', 'block').detach();

            $doms.itemSample.detach();

            PublicationContent.init($doms.innerPageContainer);

            loadListData(onReady);

            return self;
        },

        validateContent: function(hashName)
        {
            var id = hashName.slice(1, hashName.length);

            if(_dataDic[id]) return id;

            return false;
        },

        loadContent: function(contentId, cb)
        {
            //console.log('content id: ' + contentId);

            PublicationContent.toContent(contentId, function()
            {
                    cb.call(null, $doms.innerPageContainer);
            });
        },

        clearContent: function()
        {
            if(_loadedDom)
            {
                $(_loadedDom).detach();
                _loadedDom = null;
            }

            $doms.innerPageContainer.detach();
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

    function loadListData(onReady)
    {
        var sendObj =
        {
            page_index: 0,
            page_size: 999
        };

        ApiProxy.callApi('publication', sendObj, false, function(response)
        {
            if(response.error)
            {
                alert(response.error);
            }
            else
            {
                _dataList = response.data_list;

                _dataDic = createDataDic(_dataList);

                _itemLister = new ItemLister(response.data_list, $doms.content, $doms.itemSample, onItemClick, function($newItem, obj)
                {
                    var $thumb = $newItem.find(".thumb");

                    $thumb.css('background-image', 'url('+obj.thumb_desktop+')').on(_CLICK_, function()
                    {
                        onItemClick.call(null, this._dataObj);
                    });

                    $thumb[0]._dataObj = obj;

                    $newItem.find(".date").text(obj.date);
                    $newItem.find(".title").text(obj.title);
                    $newItem.find(".sub-title").text(obj.description);
                });
            }

            _isInit = true;
            onReady.call();
        });

        function onItemClick(dataObj)
        {
            ga("send", "event", "/Index", "/Publication/click", dataObj.id);

            if(dataObj.hash)
            {
                Hash.to(dataObj.hash);
            }
        }

    }


    function createDataDic(dataList)
    {
        var keyword = 'type',
            classHash = '/Publication/';

        var dic = {},
            obj,
            type,
            i;

        for(i=0;i<dataList.length;i++)
        {
            obj = dataList[i];

            type = obj[keyword];

            if(type)
            {
                obj.hash = classHash + type;
                dic[type] = obj;
            }
        }

        return dic;
    }

}());
