(function(){

    var $doms = {},
        _isInit = false,
        _dataList = null,
        _dataDic = {},
        _itemLister = null,

        _loadingXHR,
        _innerPageContentId,
        _loadedInnerPageDom,
        _onInnerPageLoaded;

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
        
        reloadInnerPageContent: function()
        {
            if(_innerPageContentId)
            {
                //console.log("loading content id: " + _innerPageContentId);

                if(_loadedInnerPageDom)
                {
                    $(_loadedInnerPageDom).detach();
                }

                if(_loadingXHR)
                {
                    _loadingXHR.abort();
                }

                var vp = Main.viewport,
                    dataObj = _dataDic[_innerPageContentId],
                    contentUrl = vp.index === 0? dataObj.content_url_mobile: dataObj.content_url_desktop;

                var dom = _loadedInnerPageDom = document.createElement('div');
                $doms.innerPageContainer.prepend(dom);

                _loadingXHR = $.ajax({
                    url: contentUrl
                }).done(function(data)
                {
                    $(dom).html(data);

                    InnerPage.updateContainerHeight();

                    if(_onInnerPageLoaded)
                    {

                        _onInnerPageLoaded.call(null, $doms.innerPageContainer);
                        _onInnerPageLoaded = null;
                    }

                }).fail(function()
                {
                    alert('load content fail for['+self.name+'], id: ' + _innerPageContentId);
                });
            }
        },

        loadContent: function(contentId, cb)
        {

            _innerPageContentId = contentId;
            _onInnerPageLoaded = cb;
            
            self.reloadInnerPageContent();
        },

        clearContent: function()
        {
            _innerPageContentId = null;


            if(_loadedInnerPageDom)
            {
                $(_loadedInnerPageDom).detach();
                _loadedInnerPageDom = null;
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
                self.reloadInnerPageContent();
            }
        }
    };

    function resetInnerPageContent(contentId)
    {

    }

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
