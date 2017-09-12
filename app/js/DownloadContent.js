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
                Hash.to("/Home");
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
                ApiProxy.callApi("download", {page_index: 0, page_size: 9999}, true, function(response)
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

        $row.find(".col-date").text(obj.date);
        $row.find(".col-title").text(obj.title);


        $doms.contentTable.append($row);
    }

}());
