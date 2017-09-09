(function(){

    var $doms = {},
        _isInit = false,
        _timerDuration = 4.5,
        _timer,
        _currentIndex = 0,
        _currentItem,
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

            ApiProxy.callApi('banners', {}, true, function(response)
            {
                if(response.error)
                {
                    alert(response.error);
                }
                else
                {
                    _dataList = response.data_list;

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
        }
    };

    function requestItem(index, onReady)
    {
        var obj = _dataList[index],
            imageUrl = obj.image;

        if(obj.item)
        {
            onReady.call(null, obj.item);
        }
        else
        {
            var img = new Image;
            img.onload = function()
            {
                img.className = "banner-item";
                obj.item = img;
                onReady.call(null, obj.item);
            };

            img.src = imageUrl;

            $(img).on(_CLICK_, function()
            {
                if(obj.link)
                {
                    window.open(obj.link, "_blank");
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

        _currentIndex = itemIndex;

        //console.log('playing: ' + _currentIndex);

        requestItem(itemIndex, function(newItem)
        {
            var oldItem = _currentItem;
            _currentItem = newItem;

            $doms.content.append(_currentItem);

            var tl = new TimelineMax;

            if(oldItem)
            {
                tl.set(_currentItem, {left:'100%'});
                tl.to(oldItem,.7,{left:'-100%', ease:Power1.easeInOut});
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
                if(_dataList.length > 1)
                {
                    _timer.restart();
                }
            });
        });
    }

}());