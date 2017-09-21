(function(){

    var $doms = {},
        _isInit = false,
        _dataList = null,
        _dataDic = {},

        _loadingXHR,
        _innerPageContentId,
        _loadedInnerPageDom,
        _onInnerPageLoaded;

    var self = window.InnerPage.Initiatives =
    {
        name: 'Initiatives',

        init: function(onReady)
        {
            $doms.container = $("#news");

            $.extend($doms,
                {
                    innerPageContainer: InnerPage.$container.find("#initiatives-inner-page")
                });

            $doms.btnBack = $doms.innerPageContainer.find(".btn-back").on(_CLICK_, function()
            {
                ga("send", "event", "/Initiatives/InnerPage", "click", "BackToList");
                Hash.to("/Home");
            });

            $doms.innerPageContainer.css('display', 'block').detach();

            ApiProxy.callApi('initiative', {}, false, function(response)
            {

                if(response.error)
                {
                    alert(response.error);
                }
                else
                {
                    _dataList = response.data_list;
                    _dataDic = createDataDic(_dataList);
                    Menu.setupDropMenu(_dataList);
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

                $doms.innerPageContainer.find(".image-top").detach();
                $doms.innerPageContainer.find(".image-bottom").detach();

                var vp = Main.viewport,
                    dataObj = _dataDic[_innerPageContentId],
                    contentUrl = vp.index === 0? dataObj.content_url_mobile: dataObj.content_url_desktop;

                var dom = _loadedInnerPageDom = document.createElement('div');
                dom.className = 'inner-page-content';
                $doms.innerPageContainer.prepend(dom);

                _loadingXHR = $.ajax({
                    url: contentUrl,
                    type: ApiProxy.getMethod()
                }).done(function(data)
                {
                    $(dom).html(data);

                    var count = 0,
                        imgHeight = 0,
                        img;

                    if(vp.index === 1)
                    {
                        if(dataObj.image_header)
                        {
                            count ++;
                            img = new Image;
                            img.onload = imageLoaded;
                            img.src = dataObj.image_header;
                            img.className = 'image-top';

                            $doms.innerPageContainer.prepend(img);
                        }

                        if(dataObj.image_footer)
                        {
                            count ++;
                            img = new Image;
                            img.onload = imageLoaded;
                            img.src = dataObj.image_footer;
                            img.className = 'image-bottom';

                            $doms.innerPageContainer.prepend(img);
                        }

                        //console.log(dataObj.image_header);
                        //console.log(dataObj.image_footer);

                        if(count === 0) allDone();
                    }
                    else
                    {
                        allDone();
                    }

                    function imageLoaded()
                    {
                        count --;
                        imgHeight += this.height;

                        if(count === 0)
                        {
                            allDone(imgHeight);
                        }
                    }

                    function allDone(minHeight)
                    {
                        if(minHeight)
                        {
                            $doms.innerPageContainer.css("min-height", minHeight + "px");
                        }
                        else
                        {
                            $doms.innerPageContainer.css("min-height", "");
                        }


                        InnerPage.updateContainerHeight();

                        if(_onInnerPageLoaded)
                        {

                            _onInnerPageLoaded.call(null, $doms.innerPageContainer);
                            _onInnerPageLoaded = null;
                        }
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
                self.reloadInnerPageContent();
            }
        }
    };



    function createDataDic(dataList)
    {
        var keyword = 'title',
            classHash = '/Initiatives/';

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
