(function(){

    var _isInit = false,
        $doms = {},
        _settings =
        {
            topPartHeight_0: 100,
            topPartHeight_1: 72,
            headerHeight_0: 99,
            headerHeight_1: 99,
            menuHeight_0: 32,
            menuHeight_1: 32,
            topPartHeight: 0,
            headerHeight: 0,
            menuHeight: 0
        },
        _sectionDic = {},
        _isInnerPageMode = false,
        _hashDic;

    var self = window.MainPage =
    {
        init: function()
        {
            $doms =
            {
                header: $("#header"),
                news: $("#news"),
                events: $("#events"),
                publication: $("#publication"),
                pictures: $("#pictures"),
                videos: $("#videos"),
                sections: $(".section"),
                innerPage: $("#inner-page")
            };

            _hashDic =
            {
                "/Home": {section:true},
                "/News": {section:true},
                "/Events": {section:true},
                "/Publication": {section:true},
                "/Pictures": {section:true},
                "/Videos": {section:true}
            };



            $doms.sections.each(function(index, dom)
            {
                dom._anchor = dom.getAttribute("anchor");
                _sectionDic[dom._anchor] = dom;
            });


            _isInit = true;
            self.resize();

            ScrollListener.init().bind(onScrolling);


            Hash.init(function(hashName)
            {
                var hashArray = Hash.analysis(hashName);
                self.handleHash(hashArray);
            });



            InnerPage.init(function()
            {
                Menu.unlock();
                Hash.startListening().update();
                ScrollListener.active();
            });
        },

        handleHash: function(hashArray)
        {
            if(hashArray.length == 0)
            {
                hashArray = ["/Home"];
            }

            if(hashArray.length == 1)
            {
                var hashName = hashArray[0],
                obj = _hashDic[hashName];

                if(obj)
                {
                    if(_isInnerPageMode)
                    {
                        InnerPage.close(hashName);
                    }
                    else
                    {
                        self.toSection(hashName);
                    }
                }
            }
            else if(hashArray.length >= 2)
            {
                InnerPage.handleHash(hashArray);
            }
        },

        toHash: function(anchor)
        {
            if(!_isInnerPageMode)
            {
                self.toSection(anchor);
            }
            else
            {
                Hash.to(anchor);
            }
        },

        toSection: function(anchor, cb)
        {
            var dom = _sectionDic[anchor];
            if(dom)
            {
                var targetTop = $(dom).offset().top - _settings.menuHeight;

                //console.log(target);
                ScrollListener.scrollTo(targetTop, cb);

            }
        },

        close: function(cb)
        {
            if(_isInnerPageMode)
            {
                cb.call();
            }
            else
            {

                _isInnerPageMode = true;
                InnerPage.Banners.stopLoop();

                //$doms.sections.toggleClass('close-mode', true);

                var tl = new TimelineMax;

                tl.to($doms.sections,.5, {autoAlpha:0});

                tl.add(function()
                {
                    ScrollListener.scrollTo(0, function()
                    {
                        cb.call();
                    });
                }, 0);
            }
        },

        closeSections: function()
        {
            $doms.sections.toggleClass('close-mode', true);
        },

        openSections: function()
        {
            $doms.sections.toggleClass('close-mode', false);
        },

        open: function(targetSection, cb)
        {
            self.toSection(targetSection, function()
            {
                Menu.setFocusTo(targetSection);

                var tl = new TimelineMax;
                tl.to($doms.sections,.5, {autoAlpha:1});
                tl.add(function()
                {
                    _isInnerPageMode = false;
                    InnerPage.Banners.startLoop();
                    if(cb) cb.call();
                });
            });
        },

        resize: function()
        {
            if(!_isInit) return;

            var vp = Main.viewport;
            _settings.topPartHeight = _settings["topPartHeight_" + vp.index];
            _settings.headerHeight = _settings["headerHeight_" + vp.index];
            _settings.menuHeight = _settings["menuHeight_" + vp.index];

            InnerPage.News.resize();
        }
    };

    function onScrolling(bound)
    {
        $doms.header.toggleClass("pin-mode", bound.top >= _settings.topPartHeight);

        if(!_isInnerPageMode)
        {
            var i,
                dom,
                result,
                anchor;

            for(i=0;i<$doms.sections.length;i++)
            {
                dom = $doms.sections[i];
                result = ScrollListener.testDom(dom, _settings.topPartHeight);

                if(result.contentInside)
                {
                    anchor = dom._anchor;
                    break;
                }
            }

            if(!anchor)
            {
                anchor = $doms.sections[$doms.sections.length-1]._anchor;
            }

            //console.log(anchor);
            Menu.setFocusTo(anchor);
            //Hash.to(anchor, true);

        }

    }

}());