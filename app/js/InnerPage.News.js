(function(){

    var $doms = {},
        _isInit = false,
        _dataList = null,
        _dataDic = {},
        _itemLister = null,

        _obj_1,
        _obj_2,

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
                ga("send", "event", "/News/InnerPage", "click", "BackToList");
                Hash.to("/News");
            });

            $doms.innerPageContainer.css('display', 'block').detach();

            $doms.itemSample.detach();

            var $footer = $("#footer");

            $footer.find(".link-announcement").on(_CLICK_, function()
            {
                var dataObj = _obj_1;

                if(dataObj)
                {
                    ga("send", "event", "/Index", "/Footer/Announcement/click");

                    if(dataObj.link)
                    {
                        window.open(dataObj.link, dataObj.target? dataObj.target: "_blank");
                    }
                    else if(dataObj.hash)
                    {
                        Hash.to(dataObj.hash);
                    }
                }
            });

            $footer.find(".link-privacy").on(_CLICK_, function()
            {
                var dataObj = _obj_2;

                if(dataObj)
                {
                    ga("send", "event", "/Index", "/Footer/Privacy/click");

                    if(dataObj.link)
                    {
                        window.open(dataObj.link, dataObj.target? dataObj.target: "_blank");
                    }
                    else if(dataObj.hash)
                    {
                        Hash.to(dataObj.hash);
                    }
                }
            });

            ApiProxy.callApi('news_release', {}, false, function(response)
            {

                if(response.error)
                {
                    alert(response.error);
                }
                else
                {
                    _dataList = response.data_list;

                    if(_dataList.length)
                    {
                        _obj_1 = _dataList.shift();
                        _obj_1.hash = "/News/Announcement";
                        _dataDic[_obj_1.id] = _obj_1;
                    }

                    if(_dataList.length)
                    {
                        _obj_2 = _dataList.shift();
                        _obj_2.hash = "/News/Privacy";
                        _dataDic[_obj_2.id] = _obj_2;
                    }

                    createDataDic(_dataList);

                    _itemLister = new ItemLister(response.data_list, $doms.content, $doms.itemSample, function(dataObj)
                    {

                        ga("send", "event", "/Index", "/News/click", dataObj.id);

                        if(dataObj.link)
                        {
                            window.open(dataObj.link, dataObj.target? dataObj.target: "_blank");
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
            if(hashName === "/Announcement" && _obj_1)
            {
                return _obj_1.id;
            }

            if(hashName === "/Privacy" && _obj_2)
            {
                return _obj_2.id;
            }



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
                    dataObj = _dataDic[_innerPageContentId];

                var contentUrl = vp.index === 0? dataObj.content_url_mobile: dataObj.content_url_desktop;



                var dom = _loadedInnerPageDom = document.createElement('div');
                dom.className = 'inner-page-content';

                $doms.innerPageContainer.prepend(dom);

                _loadingXHR = $.ajax({
                    url: contentUrl,
                    dataType: 'html',
                    type: ApiProxy.getMethod()
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

    function createDataDic(dataList)
    {
        var keyword = 'id',
            classHash = '/News/';

        var obj,
            id,
            i;

        for(i=0;i<dataList.length;i++)
        {
            obj = dataList[i];

            id = obj[keyword];

            if(id)
            {
                obj.hash = classHash + id;
                _dataDic[id] = obj;
            }
        }
    }

}());
