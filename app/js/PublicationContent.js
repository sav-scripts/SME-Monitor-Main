(function(){

    var $doms = {},
        _typeArray = 
            [
                "Monitor",
                "Collections",
                "Journals"
            ],
        _isDataLoaded = false,
        _pageSize = 10,
        _currentType = null,
        _loadedData =
        {
            'Monitor': null,
            'Collections': null,
            'Journals': null
        },
        _pageSelector;

    var self = window.PublicationContent =
    {
        init: function($container)
        {
            $doms.container = $container;
            $doms.tableContainer = $doms.container.find(".table-container");
            $doms.contentTable = $doms.tableContainer.find(".content-table");
            $doms.itemSample = $doms.container.find(".sample").detach();


            $doms.tabs = $doms.tableContainer.find(".type-tabs").find(".tab");

            $doms.tabs.each(function(index, dom)
            {
                var $dom = $(dom),
                    anchor = dom.getAttribute('anchor');

                $dom.on(_CLICK_, function()
                {
                    self.changeContent(anchor);
                });
            });

            _pageSelector = new PageSelector($doms.container.find(".page-selector"), function(newPageIndex)
            {
                //console.log("new page index: " + newPageIndex);

                self.changeContent(_currentType, newPageIndex);
            });

            $doms.btnBack = $doms.container.find(".btn-back").on(_CLICK_, function()
            {
                Hash.to("/Publication");
            });

            $doms.btnDownload = $doms.container.find(".btn-download").on(_CLICK_, function()
            {
            });

        },

        toContent: function(contentType, cb)
        {
            if(!_isDataLoaded)
            {
                self.loadAllData(apply);
            }
            else
            {
                apply();
            }

            function apply()
            {
                self.changeContent(contentType, 0);
                cb.call();
                //self.changeTab(contentType);
                //cb.call();
            }
        },

        changeContent: function(contentType, pageIndex)
        {
            var isTypeChanged = contentType !== _currentType;

            _currentType = contentType;

            var obj = _loadedData[_currentType];

            updateTab();

            if(isTypeChanged)
            {
                if(pageIndex === undefined)
                {
                    pageIndex = obj.pageIndex;
                }

                _pageSelector.reset(obj.numPages, obj.pageIndex);
            }
            else
            {
                var oldPageIndex = obj.pageIndex;

                if(pageIndex === oldPageIndex)
                {
                    console.log('same index: ' + pageIndex);
                    return;
                }
            }

            //console.log('changing to: ' + _currentType + ", page: " + pageIndex);

            obj.pageIndex = pageIndex;

            var dataList = obj.dataList;
            generateTable(dataList, pageIndex, _pageSize);

            InnerPage.updateSize();
        },

        loadAllData: function(cb)
        {
            var i = 0;

            loadOne();

            function loadOne()
            {
                var contentType = _typeArray[i];
                ApiProxy.callApi("publication", {search_type: contentType, page_index: 0, page_size: 9999}, "publication." + contentType, function(response)
                {
                    if(response.error)
                    {
                        alert(response.error);
                    }
                    else
                    {

                        var list = response.data_list,
                            numPages = Math.ceil(list.length / _pageSize);

                        _loadedData[contentType] =
                        {
                            pageIndex: 0,
                            numPages: numPages,
                            dataList: list
                        };

                        i++;
                        if(i<_typeArray.length)
                        {
                            loadOne();
                        }
                        else
                        {
                            _isDataLoaded = true;
                            cb.call();
                        }
                    }
                });
            }
        }
    };

    function updateTab()
    {
        $doms.tabs.toggleClass("active-mode", false);
        var $focusedTab = $doms.tableContainer.find(".tab-" + _currentType);
        
        $focusedTab.toggleClass("active-mode", true);
        
        
        var i;
        for(i=0;i<_typeArray.length;i++)
        {
            var t = _typeArray[i];
            $doms.contentTable.toggleClass('type-' + t, false);
        }

        $doms.contentTable.toggleClass('type-' + _currentType, true);
    }

    function clearTable()
    {
        $doms.contentTable.find(".sample").detach();
    }

    function generateTable(dataList, pageIndex, pageSize)
    {
        clearTable();

        var i;

        var startIndex = pageIndex * pageSize,
            endIndex = startIndex + pageSize;

        if(startIndex < 0) startIndex = 0;
        if(endIndex > dataList.length) endIndex = dataList.length;

        for(i=startIndex;i<endIndex;i++)
        {
            _generateRow(dataList[i]);
        }
    }

    function _generateRow(obj)
    {
        var $row = $doms.itemSample.clone(),
            $select = $row.find(".checkbox");

        var checkboxId = 'publication-checkbox-' + obj.id;
        $select.find("input")[0].id = checkboxId;
        $select.find("label")[0].setAttribute('for', checkboxId);

        var $download = $row.find(".col-download");
        $download.find(".filesize").text(obj.file_size);

        var $thumb = $row.find(".thumb");
        $thumb.css("background-image", "url("+obj.thumb_small_desktop+")");

        $row.find(".col-date").text(obj.date);
        $row.find(".col-title").text(obj.title);
        $row.find(".col-description").text(obj.description);


        $doms.contentTable.append($row);
    }

}());
