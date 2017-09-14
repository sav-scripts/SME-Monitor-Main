(function(){

    var $doms = {},
        _isInit = false,
        _dataList = null,
        _loadedDom;

    var self = window.InnerPage.Download =
    {
        name: 'Download',

        init: function(onReady)
        {
            $.extend($doms,
                {
                    innerPageContainer: InnerPage.$container.find("#download-inner-page")
                });

            $doms.innerPageContainer.css('display', 'block').detach();


            DownloadContent.init($doms.innerPageContainer);


            _isInit = true;
            onReady.call();

            return self;
        },

        validateContent: function(hashName)
        {
            return hashName === '/List'? "All": false;
        },

        loadContent: function(contentId, cb)
        {
            DownloadContent.toContent(contentId, function()
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
        }
    };

}());
