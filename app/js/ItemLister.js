(function(){

    window.ItemLister = ItemLister;


    function ItemLister(dataList, $container, $itemSample, cbOnThumbClick, cbApplyData, pageSize)
    {
        var self = this;

        self._dataList = dataList;

        self._$container = $container;
        self._$itemSample = $itemSample;

        self._cbOnThumbClick = cbOnThumbClick;
        self._cbApplyData = cbApplyData;

        self._$itemContainer = $container.find(".item-container");
        self._$spacer = self._$itemContainer.find(".spacer");
        //self._$pageDotContainer = $container.find(".page-dot-container");

        if(pageSize) self._pageSize = pageSize;

        createItems.call(self);

        self._dotPager = new DotPager
        (
            self._$container.find(".page-dot-container"),
            self._dataList.length,
            self,
            self._$container.find(".arrow-prev"),
            self._$container.find(".arrow-next")
        );
        self.resize();
    }

    ItemLister.prototype =
    {
        _dataList: null,

        _$container: null,
        _$itemSample: null,

        _$itemContainer: null,
        _$spacer: null,
        _$pageDotContainer: null,

        _itemList: null,

        _cbOnThumbClick: null,
        _cbApplyData: null,

        _dotPager: undefined,

        _pageIndex: -1,
        _pageSize:
        {
            0: 1,
            1: 3
        },

        _isLocking: false,

        resize: function()
        {
            var self = this;

            var i,
                data,
                $item,
                vp = Main.viewport;

            for(i=0;i<self._dataList.length;i++)
            {
                data = self._dataList[i];
                $item = self._itemList[i];

                var imgUrl = vp.index === 0? data.thumb_mobile: data.thumb_desktop;

                $item.find(".thumb").css('background-image', 'url('+imgUrl+')');
            }

            var pageSize = self._pageSize[Main.viewport.index];

            self._dotPager.reset(pageSize, function(newPageIndex)
            {
                toPage.call(self, newPageIndex);
            });

            toPage.call(self, 0, true);
        }
    };

    function createItems()
    {
        var self = this;

        self._itemList = [];

        var i,
            obj,
            $newItem;

        for(i=0;i<self._dataList.length;i++)
        {
            obj = self._dataList[i];

            $newItem = self._$itemSample.clone();

            setupItem(self, $newItem, obj);

            self._itemList.push($newItem);
        }
    }

    function setupItem(self, $newItem, obj)
    {
        if(self._cbApplyData)
        {
            self._cbApplyData.call(null, $newItem, obj);
        }
        else
        {

            $newItem.find(".thumb").css('background-image', 'url('+obj.thumb_desktop+')').on(_CLICK_, function()
            {
                self._cbOnThumbClick.call(null, obj);
            });

            $newItem.find(".date").text(obj.date);
            $newItem.find(".title").text(obj.title);
            $newItem.find(".sub-title").text(obj.sub_title);
        }
    }

    function toPage(newPageIndex, forceExecute)
    {
        var self = this;

        if(!forceExecute && self._pageIndex === newPageIndex) return;
        self._pageIndex = newPageIndex;

        var $oldItems = self._$itemContainer.find(".item");

        self._isLocking = true;

        var tl = new TimelineMax;

        $oldItems.each(function(index, dom)
        {
            //tl.to(dom,.4,{marginTop:-50, autoAlpha:0, onCompleteParams:[dom], onComplete: function(d)
            tl.to(dom,.4,{autoAlpha:0, onCompleteParams:[dom], onComplete: function(d)
            {
            }}, index *.2);
        });

        tl.add(function()
        {
            $oldItems.detach();
        });

        var pageIndex = self._pageIndex,
            pageSize = self._dotPager._pageSize;

        var i,
            startIndex = pageIndex * pageSize,
            endIndex = startIndex + pageSize,
            $item,
            delay;

        if(endIndex > self._itemList.length) endIndex = self._itemList.length;


        //console.log('start index = ' + startIndex);
        //console.log('end index = ' + endIndex);

        //console.log(self._$itemContainer[0].innerHTML);

        //console.log(self._itemList);


        for(i=startIndex;i<endIndex;i++)
        {
            $item = self._itemList[i];
            delay = startIndex == i? "+=.1": "-=.3";

            //tl.set($item, {autoAlpha:0, marginTop: 50}, 0);
            tl.set($item, {autoAlpha:0}, 0);
            tl.to($item,.4, {autoAlpha:1, onStartParams: [$item], onStart: function($d)
            {
                self._$itemContainer.append($d);
                self._$itemContainer.append(self._$spacer);

            }}, delay);
        }

        tl.add(function()
        {
            self._isLocking = false;
        });




    }

}());
