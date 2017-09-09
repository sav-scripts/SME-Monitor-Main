(function(){

    var $doms = {},
        _isInit = false,
        _dataList = null,
        _dataDic = {},
        _loadedDom;

    var self = window.InnerPage.Initiatives =
    {
        name: 'Initiatives',

        init: function(onReady)
        {
            $doms.container = $("#news");

            $.extend($doms,
                {
                    innerPageContainer: InnerPage.$container.find("#initiatives-inner-page")
                });

            $doms.btnBack = $doms.innerPageContainer.find(".btn-back").on(_CLICK_, function()
            {
                Hash.to("/Home");
            });

            $doms.innerPageContainer.css('display', 'block').detach();

            ApiProxy.callApi('initiatives', {}, null, function(response)
            {

                if(response.error)
                {
                    alert(response.error);
                }
                else
                {
                    _dataList = response.data_list;
                    _dataDic = createDataDic(_dataList);
                    Menu.setupDropMenu(_dataList);
                }

                _isInit = true;
                onReady.call();
            });

            return self;
        },

        validateContent: function(hashName)
        {
            var id = hashName.slice(1, hashName.length);

            if(_dataDic[id]) return id;

            return false;
        },

        loadContent: function(contentId, cb)
        {
            var dataObj = _dataDic[contentId],
                contentUrl = dataObj.content_url_desktop;

            var dom = document.createElement('div');

            $(dom).load(contentUrl, function()
            {
                _loadedDom = dom;

                $doms.innerPageContainer.prepend(dom);
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



    function createDataDic(dataList)
    {
        var keyword = 'id',
            classHash = '/Initiatives/';

        var dic = {},
            obj,
            id,
            i;

        for(i=0;i<dataList.length;i++)
        {
            obj = dataList[i];

            id = obj[keyword];

            if(id)
            {
                obj.hash = classHash + id;
                dic[id] = obj;
            }
        }

        return dic;
    }

}());
