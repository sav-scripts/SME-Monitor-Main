(function(){

    "use strict";
    var self = window.Main =
    {
        testDomain: "apac.jktarots.com:9454",

        localSettings:
        {
        },

        settings:
        {
            isLocal: false,

            useFakeData: false,
            debug: false,

            isiOS: false,
            isLineBrowser: false
        },

        viewport:
        {
            width: 0,
            height: 0,
            ranges: [640],
            index: -1,
            changed: false
        },

        init: function()
        {
            //if( window.location.host == "local.savorks.com" || window.location.host == "socket.savorks.com" || window.location.host == self.testDomain)
            if( window.location.host == "local.savorks.com" || window.location.host == "socket.savorks.com")
            {
                $.extend(self.settings, self.localSettings);
                Main.settings.isLocal = true;

                if(Utility.urlParams.usefakedata == '1') Main.settings.useFakeData = true;
                //if(Utility.urlParams.debug == '1') Main.settings.debug = true;

                //Main.settings.useFakeData = true;
                //Main.settings.debug = true;
            }


            self.settings.isLineBrowser = Boolean(navigator.userAgent.match('Line'));

            self.settings.isiOS = Utility.isiOS();
            window._CLICK_ = (self.settings.isiOS)? "touchend": "click";

            Menu.init();

            $(window).on("resize", onResize);
            onResize();

            /*
            $.ajax(
                {
                    url:"http://apac.jktarots.com:9454/test_cors.php",
                    //url:"http://local.savorks.com/projects/sid/SME-Monitor/SME-Monitor-Main/app/test_cors.php",
                    type: "post"
            })
            .done(function(response)
            {
                console.log('done: ' + response);
            })
            .fail(function(response)
            {
               console.log('fail');
            });
            */

            MainPage.init();
        },

        downloadFiles: function(verb, url, data, target)
        {
            var form = document.createElement("form");
            form.action = url;
            form.method = verb;
            form.target = target || "_self";
            if (data) {
                for (var key in data) {


                    var array = data[key];

                    for(var k=0;k<array.length;k++)
                    {
                        var input = document.createElement("textarea");
                        input.name = key + "[]";
                        input.value = array[k];
                        form.appendChild(input);
                    }
                }
            }
            form.style.display = 'none';
            document.body.appendChild(form);
            form.submit();
            $(form).detach();
        }
    };

    function onResize()
    {
        var vp = self.viewport,
            oldIndex = vp.index;

        vp.width = $(window).width();
        vp.height = $(window).height();
        vp.index = vp.width <= vp.ranges[0]? 0: 1;

        vp.changed = oldIndex !== vp.index;

        Menu.resize();
        MainPage.resize();

        PictureViewer.resize();
    }

}());
