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

            MainPage.init();
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
    }

}());
