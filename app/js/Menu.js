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
                baseLine: $doms.container.find(".baseline")
            });

            $doms.buttonContainer.find(".menu-button").on(_CLICK_, function()
            {
                if(_isLocking) return;

                //self.setFocusToDom(this);
                var anchor = this.getAttribute('anchor');
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

            //$doms.baseLine.css({
            //    left: buttonBound.left - containerBound.left,
            //    width: buttonBound.width
            //});

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
            var $container = $doms.dropMenu = $doms.container.find(".drop-menu");

            var dom = _buttonDic["/Initiatives"];

            var buttonBound = dom.getBoundingClientRect(),
                containerBound = $doms.menuPart[0].getBoundingClientRect(),
                left = buttonBound.left - containerBound.left + buttonBound.width * .5;

            $container.css('left', left);

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
                    self.switchDropMenu(false);
                    Hash.to("/Initiatives/" + obj.id);
                });

                $container.append($btn);
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
                $(window).bind('mouseup', onWindowMousedown);
                $doms.dropMenu._tl.play();
            }
            else
            {
                $(window).unbind('mouseup', onWindowMousedown);
                $doms.dropMenu._tl.reverse();
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

}());