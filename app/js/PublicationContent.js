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
                    //self.changeContent(anchor);

                    Hash.to("/Publication/" + anchor);
                });
            });

            $doms.mobileTypeSelect = $doms.container.find('.type-select').on('change', function()
            {

                var dom = $doms.mobileTypeSelect[0];

                var value = dom.options[dom.selectedIndex].value;
                if(value)
                {
                    Hash.to("/Publication/" + value);
                }

                //console.log('value = ' + value);
            });

            $doms.mobileTypeSelect[0].selectedIndex = 0;

            _pageSelector = new PageSelector($doms.container.find(".page-selector"), function(newPageIndex)
            {
                //console.log("new page index: " + newPageIndex);

                self.changeContent(_currentType, newPageIndex);
            });

            $doms.btnBack = $doms.container.find(".btn-back").on(_CLICK_, function()
            {
                ga("send", "event", "/Publication/InnerPage", "click", "BackToList");
                Hash.to("/Publication");
            });

            $doms.btnDownload = $doms.container.find(".btn-download").on(_CLICK_, function()
            {
                ga("send", "event", "/Publication/InnerPage", "click", "Download");
                if(_loadedData[_currentType])
                {
                    var dataList = _loadedData[_currentType].dataList,
                        i,
                        id,
                        obj,
                        checkedIdDic = {},
                        checkedArray = [];

                    for(i=0;i<dataList.length;i++)
                    {
                        obj = dataList[i];

                        if(obj.checked)
                        {
                            id = obj.id;
                            if(!checkedIdDic[id])
                            {
                                checkedIdDic[id] = true;
                                checkedArray.push(id);
                            }
                        }
                    }

                    if(checkedArray.length > 0)
                    {
                        var url = ApiProxy.getApiPath() + "publication/batch";
                        Main.downloadFiles("POST", url, {'file_list':checkedArray}, "_self");
                    }
                    else
                    {
                        alert("Please select files");
                    }
                }
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

            //console.log(obj.index);

            $doms.mobileTypeSelect[0].selectedIndex = obj.index;

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
                //ApiProxy.callApi("publication", {search_type: contentType, page_index: 0, page_size: 9999}, "publication." + contentType, function(response)
                ApiProxy.callApi("publication", {search_type: contentType, page_index: 0, page_size: 9999}, false, function(response)
                {
                    if(response.error)
                    {
                        alert(response.error);
                    }
                    else
                    {

                        var list = response.data_list,
                            numPages = Math.ceil(list.length / _pageSize);

                        i++;

                        _loadedData[contentType] =
                        {
                            pageIndex: 0,
                            numPages: numPages,
                            dataList: list,
                            index: i
                        };
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

        var tl = new TimelineMax,
            delay = 0;

        for(i=startIndex;i<endIndex;i++)
        {
            var $row = _generateRow(dataList[i]);

            tl.set($row, {autoAlpha: 0}, 0);
            tl.to($row,.4, {autoAlpha:1}, delay);

            delay += .05;

        }
    }

    function _generateRow(obj)
    {
        var $row = $doms.itemSample.clone(),
            $select = $row.find(".checkbox");

        var checkboxId = 'publication-checkbox-' + obj.id,
            $selectInput = $select.find("input");
        $selectInput[0].id = checkboxId;
        $select.find("label")[0].setAttribute('for', checkboxId);

        if(obj.checked === undefined)
        {
            obj.checked = false;
        }

        $selectInput[0].checked = obj.checked;

        $selectInput.on('change', function(event)
        {
            obj.checked = event.target.checked;
        });

        var $download = $row.find(".col-download").find("a");
        $download.find(".filesize").text(obj.file_size);

        $download.attr('href', obj.file_url);
        $download.attr('download', obj.file_url);

        //$download.on('click', function()
        //{
        //    console.log(obj.file_url);
        //});

        var $thumb = $row.find(".thumb");
        $thumb.css("background-image", "url("+obj.thumb_small_desktop+")");

        $row.find(".col-date").text(obj.date);
        $row.find(".col-name").text(obj.title);
        $row.find(".col-description").text(obj.description);


        $doms.contentTable.append($row);

        return $row;
    }

}());
