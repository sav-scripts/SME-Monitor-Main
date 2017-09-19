(function(){

    var $doms = {},
        _isInit = false,
        _timerDuration = 4.5,
        _timer,
        _currentIndex = 0,
        _currentItem,
        _isLocking = false,
        _queuedIndex = null,
        _isLooping = true,
        _dataList;

    var self = window.InnerPage.Banners =
    {
        init: function(onReady)
        {
            $doms.container = $("#banner");



            $.extend($doms,
                {
                    content: $doms.container.find(".content")
                });

            ApiProxy.callApi('banner', {}, false, function(response)
            {
                if(response.error)
                {
                    alert(response.error);
                }
                else
                {
                    _dataList = response.data_list;

                    setupDotPagger();

                    _timer = new TimelineMax({paused: true});

                    _timer.add(function()
                    {
                        var newIndex = _currentIndex + 1;
                        if(newIndex >= _dataList.length)
                        {
                            newIndex = 0;
                        }
                        
                        toBanner(newIndex);


                    }, _timerDuration);


                    toBanner(_currentIndex);
                }

                _isInit = true;
                onReady.call();
            });

        },

        startLoop: function()
        {
            _isLooping = true;
        },

        stopLoop: function()
        {
            _isLooping = false;
        },

        resize: function()
        {
            if(!_isInit) return;

            var i,
                vp = Main.viewport,
                obj;

            for(i=0;i<_dataList.length;i++)
            {
                obj = _dataList[i];
                if(obj.item)
                {
                    obj.item.src = vp.index === 0? obj.image_m: obj.image;
                }
            }
        }
    };

    function requestItem(index, onReady)
    {
        var vp = Main.viewport;

        var obj = _dataList[index],
            imageUrl = vp.index == 0? obj.image_m: obj.image;

        if(obj.item)
        {
            onReady.call(null, obj.item);
        }
        else
        {

            var img = new Image;
            img.onload = function()
            {
                img.onload = null;

                img.className = "banner-item";

                if(obj.background)
                {
                    $(img).css('background-color', obj.background);
                }

                obj.item = img;
                onReady.call(null, obj.item);
            };

            img.src = imageUrl;

            $(img).on(_CLICK_, function()
            {
                ga("send", "event", "/Index", "/Banner/click", obj.id);

                if(obj.url)
                {
                    window.open(obj.url, obj.target? obj.target: "_blank");
                }
            });
        }



    }

    function toBanner(itemIndex)
    {
        if(!_isLooping)
        {
            _timer.restart();
            return;
        }

        _timer.pause();

        var oldIndex = _currentIndex,
            direction = 100;

        _currentIndex = itemIndex;

        if(_currentIndex < oldIndex) direction = -100;

        $doms.dotPagger._update();

        _isLocking = true;

        requestItem(itemIndex, function(newItem)
        {
            var oldItem = _currentItem;
            _currentItem = newItem;

            $doms.content.append(_currentItem);

            var tl = new TimelineMax;

            if(oldItem)
            {
                tl.set(_currentItem, {left:direction + '%'});
                tl.to(oldItem,.7,{left:(-direction) + '%', ease:Power1.easeInOut});
                tl.to(_currentItem,.7,{left:'0', ease:Power1.easeInOut}, 0);
                tl.add(function()
                {
                    $(oldItem).detach();
                });
            }
            else
            {
                tl.set(_currentItem, {autoAlpha:0});
                tl.to(_currentItem,.6,{autoAlpha:1, ease:Power1.easeIn});
            }

            tl.add(function()
            {
                _isLocking = false;

                if(_queuedIndex !== null)
                {
                    toBanner(_queuedIndex);
                    _queuedIndex = null;
                }
                else
                {
                    if(_dataList.length > 1)
                    {
                        _timer.restart();
                    }
                }
            });
        });
    }

    function setupDotPagger()
    {
        var $container = $doms.dotPagger = $doms.container.find(".page-dot-container"),
            $dotContainer = $container.find(".dot-container"),
            $arrowPrev = $container.find(".arrow-prev"),
            $arrowNext = $container.find(".arrow-next");

        $container.css('visibility', 'visible');
        $dotContainer.empty();

        $container._update = update;

        var i;

        for(i=0;i<_dataList.length;i++)
        {
            setupOne(i);
        }

        update();

        $arrowPrev.on(_CLICK_, function()
        {
            changeIndex(_currentIndex - 1);
        });

        $arrowNext.on(_CLICK_, function()
        {
            changeIndex(_currentIndex + 1);
        });

        function setupOne(index)
        {
            var $dot;

            $dot = $(document.createElement('div'));
            $dot.toggleClass('dot', true);

            $dotContainer.append($dot);

            $dot.on(_CLICK_, function()
            {
                changeIndex(index);
            });
        }

        function update()
        {
            $dotContainer.find('.dot').each(function(index, dom)
            {
                $(dom).toggleClass('focus-mode', index === _currentIndex);
            });
        }

        function changeIndex(newIndex)
        {
            if(newIndex < 0) newIndex = _dataList.length-1;
            if(newIndex >= _dataList.length) newIndex = 0;
            if(newIndex === _currentIndex) return;

            if(_isLocking)
            {
                _queuedIndex = newIndex;
            }
            else
            {
                toBanner(newIndex);
            }
        }

    }

}());
