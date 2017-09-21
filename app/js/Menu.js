/**
 * Created by sav on 2017/8/29.
 */
(function(){

    var $doms = {},
        _isLocking = true,
        _buttonDic = {};

    var self = window.Menu =
    {
        init: function()
        {
            $doms.container = $("#header");

            $.extend($doms,
            {
                topPart: $doms.container.find(".top-part"),
                menuPart: $doms.container.find(".menu-part"),
                buttonContainer: $doms.container.find(".button-container"),
                baseLine: $doms.container.find(".baseline"),
                mobileMenuPart: $doms.container.find(".menu-part")
            });

            $doms.logo = $doms.topPart.find(".logo").on(_CLICK_, function()
            {
                Hash.to("/Home");
            });

            setupPcMenu();
            setupMobileMenu();
        },

        setFocusTo: function (anchor)
        {
            self.setFocusToDom(_buttonDic[anchor]);

            //TweenMax.to($doms.buttonUnderLine,.5, {left: left, width: width, ease:Power3.easeOut});
        },

        setFocusToDom: function(dom)
        {
            var buttonBound = dom.getBoundingClientRect(),
                containerBound = $doms.menuPart[0].getBoundingClientRect(),
                left = buttonBound.left - containerBound.left,
                width = buttonBound.width;

            TweenMax.to($doms.baseLine,.5, {left: left, width: width, ease:Power3.easeOut});
        },

        lock: function()
        {
            _isLocking = true;
        },

        unlock: function()
        {
            _isLocking = false;
        },

        setupDropMenu: function(dataList)
        {
            setupPcMode();
            setupMobileMode();

            function setupPcMode()
            {

                var $container = $doms.dropMenu = $doms.container.find(".drop-menu");

                $doms.dropMenu._updateTriggerLeft = updateTriggerLeft;

                updateTriggerLeft();

                function updateTriggerLeft()
                {
                    var dom = _buttonDic["/Initiatives"];

                    var buttonBound = dom.getBoundingClientRect(),
                        containerBound = $doms.menuPart[0].getBoundingClientRect(),
                        left = buttonBound.left - containerBound.left + buttonBound.width * .5;

                    $container.css('left', left);
                }

                var i;
                for(i=0;i<dataList.length;i++)
                {
                    setupOne(dataList[i]);
                }

                var menuHeight = $container._height = $container.height() + 2;
                $container._isOpen = false;

                $container.css('overflow', 'hidden');
                TweenMax.set($container, {autoAlpha:0});

                var tl = $container._tl = new TimelineMax({paused:false});
                tl.add(function()
                {
                    TweenMax.set($container, {autoAlpha:0});
                });
                tl.set($container, {autoAlpha:1, height:0},.01);
                tl.to($container,.35,{height:menuHeight});

                tl.pause();



                function setupOne(obj)
                {
                    var $btn = $(document.createElement('div'));
                    $btn[0].className = 'button';
                    $btn.text(obj.title);

                    $btn.on(_CLICK_, function()
                    {
                        ga("send", "event", "Menu", "/Initiatives/Menu/click", obj.id);
                        self.switchDropMenu(false);


                        if(obj.link)
                        {
                            window.open(obj.link, obj.target? obj.target: "_blank");
                        }
                        else
                        {
                            Hash.to("/Initiatives/" + obj.title);
                        }

                    });

                    $container.append($btn);
                }
            }

            function setupMobileMode()
            {
                var $container = $doms.mobileDropMenu = $doms.container.find(".mobile-drop-menu");

                var i;
                for(i=0;i<dataList.length;i++)
                {
                    setupOne(dataList[i]);
                }

                $container.toggleClass('hide-mode', true);

                var __isOpen = false,
                    __tl,
                    __dropMenuHeight = null;

                var $trigger = $doms.mobileButtons["/Initiatives"];

                $trigger.on(_CLICK_, function()
                {

                    switchOpen(!__isOpen);
                });

                self.switchMobileDropMenu = switchOpen;

                function switchOpen(b)
                {
                    if(__isOpen === b) return;
                    __isOpen = b;

                    $trigger.toggleClass("sp", __isOpen);

                    getDropMenuHeight();


                    if(__isOpen)
                    {
                        __tl.play();
                    }
                    else
                    {
                        __tl.reverse();
                    }
                }


                function getDropMenuHeight()
                {
                    if(__dropMenuHeight === null)
                    {
                        $container.toggleClass('hide-mode', false);
                        __dropMenuHeight = $container.height();

                        $container.css("overflow", "hidden");

                        TweenMax.set($container, {height: 0});

                        __tl = new TimelineMax;
                        __tl.set($container, {height: 0});
                        __tl.to($container,.4, {height: __dropMenuHeight});
                        __tl.pause();
                    }
                }

                function setupOne(obj)
                {
                    var $btn = $(document.createElement('div'));
                    $btn[0].className = 'item';
                    $btn.text(obj.title);

                    $btn.on(_CLICK_, function()
                    {
                        ga("send", "event", "Menu", "/Initiatives/Menu/click", obj.id);
                        self.switchDropMenu(false);
                        self.switchMobileOpen(false);

                        if(obj.link)
                        {
                            window.open(obj.link, obj.target? obj.target: "_blank");
                        }
                        else
                        {
                            Hash.to("/Initiatives/" + obj.title);
                        }
                    });

                    $container.append($btn);
                }
            }
        },

        switchDropMenu: function(setToOpen)
        {
            if(setToOpen === undefined)
            {
                setToOpen = !$doms.dropMenu._isOpen;
            }

            if(setToOpen === $doms.dropMenu._isOpen) return;

            var isOpen = $doms.dropMenu._isOpen = setToOpen;

            if(isOpen)
            {
                $(window).bind('mouseup touchend', onWindowMousedown);
                $doms.dropMenu._tl.play();
            }
            else
            {
                $(window).unbind('mouseup touchend', onWindowMousedown);
                $doms.dropMenu._tl.reverse();
            }

        },

        switchMobileOpen: undefined,
        switchMobileDropMenu: undefined,

        resize: function()
        {
            if($doms.dropMenu && Main.viewport.changed && Main.viewport.index === 1)
            {
                $doms.dropMenu._updateTriggerLeft();
            }
        }
    };

    function onWindowMousedown(event)
    {
        if(event.target.className === 'menu-button' && event.target.getAttribute('anchor') === "/Initiatives") return;

        if(!$.contains($doms.dropMenu[0], event.target))
        {
            self.switchDropMenu(false);
        }
    }

    function setupPcMenu()
    {
        $doms.topPart.find(".fb-icon").on(_CLICK_, function()
        {
            ga("send", "event", "Menu", "click", "/FacebookPage");
        });

        $doms.topPart.find(".youtube-icon").on(_CLICK_, function()
        {
            ga("send", "event", "Menu", "click", "/YouTubeChannel");
        });

        $doms.topPart.find(".email-icon").on(_CLICK_, function()
        {
            ga("send", "event", "Menu", "click", "/ContactUs");
        });


        $doms.buttonContainer.find(".menu-button").on(_CLICK_, function()
        {
            if(_isLocking) return;



            var anchor = this.getAttribute('anchor');

            ga("send", "event", "Menu", "click", anchor);

            if(anchor === "/Download")
            {
                Hash.to("/Download/List");

            }
            else if(anchor === "/Initiatives")
            {
                //console.log('handle Initiatives menu');
                //Hash.to("/Initiatives/001");

                self.switchDropMenu();
            }
            else
            {
                //MainPage.toHash(anchor);
                Hash.to(anchor);
                MainPage.toSection(anchor);
            }



        }).each(function(index, dom)
        {
            var anchor = dom.getAttribute('anchor');
            _buttonDic[anchor] = dom;
            //console.log(dom.attribute['anchor']);
        });
    }

    function setupMobileMenu()
    {
        var _isMobileOpen = false;

        $doms.mobileMenuPart = $doms.container.find(".mobile-menu-part");
        $doms.mobileMenuIcon = $doms.container.find(".mobile-menu-icon");

        //$doms.mobileMenuPart.on('touchstart touchmove', function(event)
        //{
        //    event.stopPropagation();
        //    event.preventDefault();
        //});

        $doms.mobileMenuIcon.on('touchstart mousedown', function(event)
        {
            event.preventDefault();
            event.stopPropagation();

            switchOpen(!_isMobileOpen);
        });

        self.switchMobileOpen = switchOpen;

        function switchOpen(isMobileOpen)
        {
            if(_isMobileOpen === isMobileOpen) return;
            _isMobileOpen = isMobileOpen;


            if(_isMobileOpen)
            {
                $doms.mobileMenuPart[0].scrollTop = 0;
            }
            else
            {
                if(self.switchMobileDropMenu)
                {
                    self.switchMobileDropMenu(false);
                }
            }

            update();
        }

        $doms.mobileButtons = {};

        var $buttons = $doms.mobileMenuPart.find(".mobile-menu-button");

        $buttons.each(function()
        {
            var $dom = $(this),
                anchor = $dom.attr('anchor');

            if(anchor)
            {
                $doms.mobileButtons[anchor] = $dom;
            }
        });

        $buttons.on('click', function()
        {
            if(_isLocking) return;

            //self.setFocusToDom(this);
            var anchor = this.getAttribute('anchor');

            ga("send", "event", "Menu", "click", anchor);

            if(anchor === "/Download")
            {
                self.switchMobileOpen(false);
                Hash.to("/Download/List");

            }
            else if(anchor === "/Initiatives")
            {
            }
            else if(anchor === "/ContactUs")
            {
            }
            else
            {
                self.switchMobileOpen(false);
                Hash.to(anchor);
                MainPage.toSection(anchor);
            }
        });

        function update()
        {
            $doms.mobileMenuIcon.toggleClass("close-mode", _isMobileOpen);
            $doms.mobileMenuPart.toggleClass("open-mode", _isMobileOpen);
        }
    }

}());