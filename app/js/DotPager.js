(function(){

    window.DotPager = DotPager;

    function DotPager($container, numItems, itemLister, $arrowPrev, $arrowNext)
    {
        var self = this;

        this._$container = $container;
        this._numItems = numItems;
        this._itemLister = itemLister;

        this._$arrowPrev = $arrowPrev;
        this._$arrowNext = $arrowNext;

        this._$arrowPrev.on(_CLICK_, function()
        {
            if(self._itemLister._isLocking) return;

            var newIndex = self._pageIndex - 1;
            if(newIndex < 0) return;

            self.setPageIndex(newIndex);
        });

        this._$arrowNext.on(_CLICK_, function()
        {
            if(self._itemLister._isLocking) return;

            var newIndex = self._pageIndex + 1;
            if(newIndex >= self._numPages) return;

            self.setPageIndex(newIndex);
        });
    }

    DotPager.prototype =
    {
        _$container: null,

        _$arrowPrev: null,
        _$arrowNext: null,

        _numItems: 0,

        _pageIndex: 0,
        _numPages: 0,
        _pageSize: 0,
        _cbOnChange: null,
        _dotList: null,

        _itemLister: null,

        reset: function(pageSize, cbOnChange)
        {
            var self = this;

            self._pageIndex = 0;
            self._pageSize = pageSize;
            self._numPages = Math.ceil(self._numItems / pageSize);
            self._cbOnChange = cbOnChange;

            self._$container.empty();

            self._dotList = [];

            var i,
                $dot;

            for(i=0;i<self._numPages;i++)
            {
                $dot = $(document.createElement('div'));
                $dot[0].className = "dot";
                $dot[0]._pageIndex = i;

                self._$container.append($dot);

                if(i === self._pageIndex)
                {
                    $dot.toggleClass("focus-mode", true);
                }

                $dot.on(_CLICK_, function()
                {
                    if(self._itemLister._isLocking) return;

                    self.setPageIndex(this._pageIndex);

                    //$(this).toggleClass("focus-mode", true);
                });
            }

            updateArrows.call(self);
        },

        setPageIndex: function(newPageIndex)
        {
            var self = this;

            self._pageIndex = newPageIndex;

            self._cbOnChange.call(null, self._pageIndex);

            var $dot = self._$container.find(".dot").toggleClass('focus-mode', false);

            $($dot[self._pageIndex]).toggleClass('focus-mode', true);



            updateArrows.call(self);
        }
    };

    function updateArrows()
    {
        var self = this;

        self._$arrowPrev.toggleClass("hide-mode", self._pageIndex === 0);
        self._$arrowNext.toggleClass("hide-mode", self._pageIndex === (self._numPages-1));
    }

}());
