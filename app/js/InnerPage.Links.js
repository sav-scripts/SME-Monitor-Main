(function(){

    var $doms = {},
        _isInit = false,
        _dataList,
        _itemWidth = 0,
        _pageWidth = 0,
        _numPages,

        _pageIndex = -1,
        _pageSize = 3;

    var self = window.InnerPage.Links =
    {
        init: function(onReady)
        {
            $doms.container = $("#links");

            $.extend($doms,
            {
                arrowPrev: $doms.container.find(".arrow-prev"),
                arrowNext: $doms.container.find(".arrow-next"),
                itemContainer: $doms.container.find(".item-container"),
                itemWrapper: $doms.container.find(".item-wrapper"),
                itemSample: $doms.container.find(".item")
            });

            var $item = $doms.itemSample;
            _itemWidth = ($item.width() + parseInt($item.css('margin-left')) + parseInt($item.css('margin-right')));
            _pageWidth = _itemWidth * _pageSize;

            $doms.itemSample.detach();

            $doms.arrowPrev.on(_CLICK_, function()
            {
                toPage(_pageIndex-1);
            });

            $doms.arrowNext.on(_CLICK_, function()
            {
                toPage(_pageIndex+1);
            });

            ApiProxy.callApi('link', {}, false, function(response)
            {
                if(response.error)
                {
                    alert(response.error);
                }
                else
                {
                    _dataList = response.data_list;
                    _numPages = Math.ceil(_dataList.length / _pageSize);
                    createItems();
                    toPage(0);
                }

                _isInit = true;
                onReady.call();
            });
        }
    };

    function createItems()
    {
        var i,
            width = 0;

        for(i=0;i<_dataList.length;i++)
        {
            generateItem(_dataList[i]);
            width += _itemWidth;
        }

        $doms.itemWrapper.width(width);
    }

    function generateItem(obj)
    {
        var $item = $doms.itemSample.clone();

        $item.find(".thumb").css("background-image", "url("+obj.thumb+")").on(_CLICK_, function()
        {

            ga("send", "event", "/Index", "/Links/click", obj.id);

            if(obj.link)
            {
                ApiProxy.sendClickEvent("link/"+obj.id+"/c");
                window.open(obj.link, obj.target? obj.target: "_blank");
            }

        });
        $item.find(".title").text(obj.title);

        $doms.itemWrapper.append($item);
    }

    function toPage(newPageIndex)
    {
        if(newPageIndex === _pageIndex) return;
        if(newPageIndex >= _numPages) return;
        if(newPageIndex < 0) return;

        _pageIndex = newPageIndex;

        var targetLeft = -(_pageIndex * _pageWidth);

        TweenMax.killTweensOf($doms.itemWrapper);
        TweenMax.to($doms.itemWrapper,.5,{left:targetLeft, ease:Power1.easeOut});

        updateArrows();
    }

    function updateArrows()
    {
        $doms.arrowPrev.toggleClass('hide-mode', _pageIndex === 0);
        $doms.arrowNext.toggleClass('hide-mode', _pageIndex >= (_numPages-1));
    }



}());
