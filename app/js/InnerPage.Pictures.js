(function(){

    var $doms = {},
        _isInit = false,
        _dataList = null,
        _itemLister = null,
        _dataDic,
        _downloadUrl,
        _innerPageItemList;

    var self = window.InnerPage.Pictures =
    {
        name: 'Pictures',

        init: function(onReady)
        {
            $doms.container = $("#pictures");

            $.extend($doms,
                {
                    content: $doms.container.find(".content"),
                    itemContainer: $doms.container.find(".item-container"),
                    itemSample: $doms.container.find(".item"),
                    innerPageContainer: InnerPage.$container.find("#pictures-inner-page")
                });

            $doms.btnBack = $doms.innerPageContainer.find(".btn-back").on(_CLICK_, function()
            {
                Hash.to("/Pictures");
            });

            $doms.btnBack = $doms.innerPageContainer.find(".btn-download").on(_CLICK_, function()
            {
                if(_downloadUrl)
                {
                    window.open(_downloadUrl, "_blank");
                }
            });

            $doms.albumDetail = $doms.innerPageContainer.find(".album-detail");

            $doms.innerPageContainer.css('display', 'block').detach();

            $doms.itemSample.detach();


            $doms.innerPageItemContainer = $doms.innerPageContainer.find(".item-container");
            $doms.innerPageItemSample = $doms.innerPageItemContainer.find(".item").detach();
            $doms.innerPageSpacer = $doms.innerPageItemContainer.find(".spacer").detach();


            ApiProxy.callApi('album', {}, null, function(response)
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


                    //_itemLister = new ItemLister(response.data_list, $doms.content, $doms.itemSample, function(dataObj)
                    //{
                    //    Hash.to("/Pictures/All");
                    //});
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

            ApiProxy.callApi('pictures', {album_id:contentId}, null, function(response)
            {
                var albumData = _dataDic[contentId];
                $doms.albumDetail.find(".date").text(albumData.date);
                $doms.albumDetail.find(".title").text(albumData.title);
                $doms.albumDetail.find(".sub-title").text(albumData.sub_title);

                _downloadUrl = response.download_url;

                buildInnerPage(response.data_list);

                cb.call(null, $doms.innerPageContainer);
            });
        },

        clearContent: function()
        {
            _innerPageItemList = null;
            $doms.innerPageItemContainer.empty();
            $doms.innerPageContainer.detach();
        },

        resize: function()
        {
            if(!_isInit) return;

            var vp = Main.viewport;
            if(vp.changed)
            {
                _itemLister.resize();
                reloadInnerPageThumbs();
            }
        }
    };

    function createDataDic(dataList)
    {
        var keyword = 'id',
            classHash = '/Pictures/';

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

    function buildInnerPage(pictureList)
    {
        var i;

        _innerPageItemList = [];

        for(i=0;i<pictureList.length;i++)
        {
            generateInnerPageItem(pictureList[i]);
        }

        reloadInnerPageThumbs();

        $doms.innerPageItemContainer.append($doms.innerPageSpacer);

    }

    function generateInnerPageItem(obj)
    {
        var $item = $doms.innerPageItemSample.clone();
        $item.find(".title").text(obj.filename);
        $item._data = obj;

        _innerPageItemList.push($item);

        $doms.innerPageItemContainer.append($item);
    }

    function reloadInnerPageThumbs()
    {
        if(_innerPageItemList)
        {
            var i,
                $item,
                thumbUrl;

            for(i=0;i<_innerPageItemList.length;i++)
            {
                $item = _innerPageItemList[i];

                thumbUrl = Main.viewport.index === 0? $item._data.thumb_mobile: $item._data.thumb_desktop;
                $item.find(".thumb").css("background-image", "url("+thumbUrl+")");
            }
        }
    }

}());
