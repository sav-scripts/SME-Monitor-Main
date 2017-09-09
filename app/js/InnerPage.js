(function(){

    var _hashDic,
        _pageClass,
        _isOpening,
        $doms = {};

    var self = window.InnerPage =
    {
        $container: null,

        init: function(onReady)
        {
            $doms.container = self.$container = $("#inner-page");

            $.extend($doms,
            {
                loadingIcon: $doms.container.find(".loading-icon"),
                head: $doms.container.find(".inner-page-head"),
                content: $doms.container.find(".content")
            });

            $doms.headTitle = $doms.head.find(".title");

            _hashDic =
            {
                "/News": self.News,
                "/Events": self.Events,
                "/Publication": self.Publication,
                "/Pictures": self.Pictures,
                "/Videos": self.Videos,
                "/Initiatives": self.Initiatives,
                "/Download": self.Download
            };

            initializeContents();

            function initializeContents()
            {
                var array =
                    [
                        self.Banners,
                        self.News,
                        self.Events,
                        self.Publication,
                        self.Pictures,
                        self.Videos,
                        self.Links,
                        self.Initiatives,
                        self.Download
                    ];

                var count = array.length,
                    i;

                for(i=0;i<array.length;i++)
                {
                    array[i].init(oneComplete);
                }

                function oneComplete()
                {
                    count--;
                    if(count === 0)
                    {
                        onReady.call();
                    }
                }
            }
        },

        handleHash: function(hashArray)
        {
            var classHash = hashArray[0],
                contentHash = hashArray[1],
                pageClass = _hashDic[classHash];


            //console.log(_pageClass);

            if(pageClass)
            {
                var contentId = pageClass.validateContent(contentHash);
                if(contentId)
                {
                    if(_isOpening)
                    {
                        self.switchPage(classHash, pageClass, contentId);
                    }
                    else
                    {
                        self.open(classHash, pageClass, contentId);
                    }

                }
            }
        },

        open: function(classHash, pageClass, contentId)
        {
            if(_isOpening) return;
            _isOpening = true;

            Hash.stopListening();

            _pageClass = pageClass;

            //console.log(_pageClass.name);
            $doms.headTitle.text(_pageClass.name);


            //$doms.container.toggleClass('hide-mode', false);

            MainPage.close(function()
            {
                Menu.setFocusTo(classHash);

                var tl0 = new TimelineMax;
                tl0.set($doms.container, {autoAlpha:1, height:0, paddingTop: 0});
                tl0.to($doms.container,.4, {height: 386, paddingTop:109});

                tl0.add(function()
                {

                    $doms.loadingIcon.toggleClass('hide-mode', false);

                    pageClass.loadContent(contentId, function($contentDom)
                    {
                        //console.log('load done');

                        $doms.loadingIcon.toggleClass('hide-mode', true);




                        $doms.content.prepend($contentDom);

                        var contentHeight = $doms.content.height(),
                            newHeight = $doms.head.height() + contentHeight;
                        //newHeight = $doms.head.height() + contentHeight + _bottomBleed[Main.viewport.index];

                        //console.log("new height = " + newHeight);

                        //$doms.container.css('height', newHeight + 'px');

                        MainPage.closeSections();


                        TweenMax.killTweensOf($doms.container);

                        var tl = new TimelineMax;
                        tl.set($doms.content, {autoAlpha:0});
                        tl.to($doms.container,.4,{height: newHeight},.5);
                        tl.to($doms.content,.4, {autoAlpha:1},.5);

                        tl.add(function()
                        {
                            Hash.startListening();
                        });
                    });
                });


            });
        },

        updateSize: function()
        {
            var contentHeight = $doms.content.height(),
                newHeight = $doms.head.height() + contentHeight;


            TweenMax.to($doms.container,.4,{height: newHeight});
        },

        close: function(targetMainPageSection)
        {
            if(!_isOpening) return;
            _isOpening = false;

            Hash.stopListening();

            //$doms.container.css('height', '');

            MainPage.openSections();

            TweenMax.killTweensOf($doms.container);

            var tl0 = new TimelineMax;
            tl0.to($doms.container,.5, {height: 0, paddingTop:0});
            tl0.set($doms.container, {autoAlpha:0});
            tl0.add(function()
            {
                if(_pageClass)
                {
                    _pageClass.clearContent();
                    _pageClass = null;
                }

                MainPage.open(targetMainPageSection, function()
                {
                    Hash.startListening();
                });

            });
        },

        switchPage: function(classHash, pageClass, contentId)
        {
            Hash.stopListening();

            var tl0 = new TimelineMax;
            tl0.to($doms.container,.5, {height: 0, paddingTop:0});
            tl0.set($doms.container, {autoAlpha:0});
            tl0.add(function()
            {
                if(_pageClass)
                {
                    _pageClass.clearContent();
                    _pageClass = null;
                }

                //MainPage.open(targetMainPageSection, function()
                //{
                //    Hash.startListening();
                //});
                _isOpening = false;
                self.open(classHash, pageClass, contentId);

            });
        }
    };

}());
