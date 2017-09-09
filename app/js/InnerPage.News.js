(function(){

    var $doms = {},
        _isInit = false,
        _dataList = null,
        _dataDic = {},
        _itemLister = null,
        _loadedDom;

    var self = window.InnerPage.News =
    {
        name: 'Latest News',

        init: function(onReady)
        {
            $doms.container = $("#news");

            $.extend($doms,
            {
                content: $doms.container.find(".content"),
                itemContainer: $doms.container.find(".item-container"),
                itemSample: $doms.container.find(".item"),
                innerPageContainer: InnerPage.$container.find("#news-inner-page")
            });

            $doms.btnBack = $doms.innerPageContainer.find(".btn-back").on(_CLICK_, function()
            {
                Hash.to("/News");
            });

            $doms.innerPageContainer.css('display', 'block').detach();

            $doms.itemSample.detach();

            ApiProxy.callApi('news_release', {}, null, function(response)
            {

                if(response.error)
                {
                    alert(response.error);
                }
                else
                {
                    _dataList = response.data_list;

                    _dataDic = createDataDic(_dataList);

                    _itemLister = new ItemLister(response.data_list, $doms.content, $doms.itemSample, function(dataObj)
                    {
                        //console.log(dataObj.hash);
                        if(dataObj.link)
                        {

                        }
                        else if(dataObj.hash)
                        {
                            Hash.to(dataObj.hash);
                        }
                    });
                }

                _isInit = true;
                onReady.call();
            });

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
            var dataObj = _dataDic[contentId],
                contentUrl = dataObj.content_url_desktop;

            var dom = document.createElement('div');

            $(dom).load(contentUrl, function()
            {
                _loadedDom = dom;

                $doms.innerPageContainer.prepend(dom);
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



    function createDataDic(dataList)
    {
        var keyword = 'id',
            classHash = '/News/';

        var dic = {},
            obj,
            id,
            i;

        for(i=0;i<dataList.length;i++)
        {
            obj = dataList[i];

            id = obj[keyword];

            if(id)
            {
                obj.hash = classHash + id;
                dic[id] = obj;
            }
        }

        return dic;
    }

}());
