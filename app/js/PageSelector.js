(function(){

    var PAGE_MORE_DIFF = 10;

    window.PageSelector = PageSelector;

    function PageSelector($container, cbOnChange)
    {
        var self = this;

        self._$container = $container;
        self._cbOnChange = cbOnChange;

        var $doms = self._$doms = {};

        $doms.arrowPrev = $container.find(".arrow-prev").on(_CLICK_, function()
        {
            self.toPage(self._pageIndex - 1);
        });

        $doms.arrowNext = $container.find(".arrow-next").on(_CLICK_, function()
        {
            self.toPage(self._pageIndex + 1);
        });

        $doms.arrowMorePrev = $container.find(".arrow-more-prev").on(_CLICK_, function()
        {
            self.toPage(self._pageIndex - PAGE_MORE_DIFF);
        });

        $doms.arrowMoreNext = $container.find(".arrow-more-next").on(_CLICK_, function()
        {
            self.toPage(self._pageIndex + PAGE_MORE_DIFF);
        });

        $doms.pageIndex = $container.find(".page-input").on("change", function()
        {
            var v = parseInt($(this).val());
            if(isNaN(v)) v = 1;
            v -= 1;
            console.log('on change: ' + v);

            self.toPage(v);
        });

        $doms.numPages = $container.find(".num-pages");


    }

    PageSelector.prototype =
    {
        _$container: undefined,
        _cbOnChange: undefined,

        _$doms: undefined,

        _pageIndex: 0,
        _numPages: 0,

        reset: function(numPages, pageIndex)
        {
            var self = this;
            self._numPages = numPages;
            self._pageIndex = pageIndex;

            self._$doms.pageIndex.val(self._pageIndex + 1);
            self._$doms.numPages.text(self._numPages);

            updateArrows.call(self);
        },

        toPage: function(pageIndex, forceExecute)
        {

            var self = this;
            var oldPageIndex = self._pageIndex;

            if(pageIndex < 0) pageIndex = 0;
            if(pageIndex >= self._numPages) pageIndex = self._numPages - 1;



            self._pageIndex = pageIndex;
            self._$doms.pageIndex.val(self._pageIndex + 1);

            if(!forceExecute)
            {
                if(oldPageIndex === pageIndex) return;
            }

            updateArrows.call(self);


            if(self._cbOnChange)
            {
                self._cbOnChange.call(null, self._pageIndex);
            }
        }
    };

    function updateArrows()
    {
        var self = this,
            $doms = self._$doms,
            numPages = self._numPages,
            pageIndex = self._pageIndex;

        $doms.arrowPrev.toggleClass("fade-mode", pageIndex <= 0);
        $doms.arrowMorePrev.toggleClass("fade-mode", pageIndex <= 0);

        $doms.arrowNext.toggleClass("fade-mode", pageIndex >= (numPages-1));
        $doms.arrowMoreNext.toggleClass("fade-mode", pageIndex >= (numPages-1));

    }

}());
