(function(){

    var $doms = {},
        _isOpen = false,
        _image,
        _tl;

    var self = window.PictureViewer =
    {
        init: function()
        {
            $doms.container = $("#picture-viewer");

            $.extend($doms,
            {
                cover: $doms.container.find(".cover"),
                btnClose: $doms.container.find(".btn-close"),
                imageContainer: $doms.container.find(".image-container"),
                loadingIcon: $doms.container.find(".loading-icon")
            });

            $doms.btnClose.on(_CLICK_, function()
            {
                self.close();
            });
        },

        showPicture: function(imageUrl)
        {
            if(_isOpen) return;
            _isOpen = true;

            $doms.container.css('display', 'block');
            $doms.loadingIcon.toggleClass("hide-mode", false);

            $doms.imageContainer.empty();

            if(_tl) _tl.kill();

            _tl = new TimelineMax;
            _tl.set($doms.container, {autoAlpha:0});
            _tl.to($doms.container,.4,{autoAlpha:1});

            var img = new Image;
            img.onload = function()
            {
                _image = img;
                _image.rawWidth = _image.width;
                _image.rawHeight = _image.height;
                self.resize();
                $doms.loadingIcon.toggleClass("hide-mode", true);
                $doms.imageContainer.append(img);

                TweenMax.from(img,.7,{autoAlpha:0, marginTop: 300, ease:Back.easeOut});
            };

            img.src = imageUrl;
        },

        close: function()
        {
            if(!_isOpen) return;
            _isOpen = false;

            if(_tl)
            {
                _tl.kill();
            }

            _tl = new TimelineMax;
            _tl.to($doms.container,.4,{autoAlpha: 0});
            _tl.add(function()
            {
                _image = null;
                $doms.container.css('display', 'none');
            });
        },

        resize: function()
        {
            //if(!_isOpen) return;
            if(!_image) return;



            var vp = Main.viewport,
                bleed = vp.index === 0? 50: 100,
                bound = Helper.getSize_contain(vp.width - bleed, vp.height - bleed, _image.rawWidth, _image.rawHeight);

            if(bound.ratio > 1)
            {
                bound.width = _image.rawWidth;
                bound.height = _image.rawHeight;
            }

            $(_image).css(
            {
                "left": -bound.width *.5,
                "top": -bound.height *.5,
                "width": bound.width,
                "height": bound.height
            });
        }
    };

}());
