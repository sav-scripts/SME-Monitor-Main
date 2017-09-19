(function(){

    var $doms = {},
        _isDataLoaded = false,
        _typeArray =
            [
                "All"
            ],
        _pageSize = 10,
        _currentType = null,
        _loadedData =
        {
            'All': null
        },
        _pageSelector;

    var self = window.DownloadContent =
    {
        init: function($container)
        {
            $doms.container = $container;
            $doms.tableContainer = $doms.container.find(".table-container");
            $doms.contentTable = $doms.tableContainer.find(".content-table");
            $doms.itemSample = $doms.container.find(".sample").detach();

            _pageSelector = new PageSelector($doms.container.find(".page-selector"), function(newPageIndex)
            {
                self.changeContent(_currentType, newPageIndex);
            });

            $doms.btnBack = $doms.container.find(".btn-back").on(_CLICK_, function()
            {
                ga("send", "event", "/Download/List", "click", "BackToList");
                Hash.to("/Home");
            });

            $doms.btnDownload = $doms.container.find(".btn-download").on(_CLICK_, function()
            {
                ga("send", "event", "/Download/List", "click", "Download");

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
                        var url = ApiProxy.getApiPath() + "download/batch";
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
                    //console.log('same index: ' + pageIndex);
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
                ApiProxy.callApi("download", {page_index: 0, page_size: 9999}, false, function(response)
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

        var checkboxId = 'download-checkbox-' + obj.id,
            $selectInput = $select.find("input");
        $selectInput[0].id = checkboxId;
        $select.find("label")[0].setAttribute('for', checkboxId);

        if(obj.checked === undefined)
        {
            obj.checked = false;
        }

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

        $row.find(".col-date").text(obj.date);
        $row.find(".col-title").text(obj.title);


        $doms.contentTable.append($row);

        return $row;
    }

}());
