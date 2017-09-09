(function(){

    var _isInit = false,
        _isListening = false,
        _cbOnHashChange,
        _lastExecutedHash = null,
        _ignoreNextHashChange = false;

    var self = window.Hash =
    {
        init: function(cbOnHashChange)
        {
            if(_isInit)
            {
                throw new Error("is initialized already");
            }
            _isInit = true;

            self.bind(cbOnHashChange);
            activeListener();

            return self;
        },

        bind: function(cbOnHashChange)
        {
            _cbOnHashChange = cbOnHashChange;

            return self;
        },

        startListening: function()
        {
            if(_isListening) return;
            _isListening = true;

            if(_lastExecutedHash)
            {
                var currentHash = self.getHash();
                if(currentHash !== _lastExecutedHash)
                {;
                    executeHash(currentHash);
                }
            }

            return self;
        },

        stopListening: function()
        {
            if(!_isListening) return;
            _isListening = false;

            return self;
        },

        analysis: function(hashName)
        {
            var hashArray = [],
                indexArray = [],
                index,
                startSearchIndex = 0,
                attempts = 0;

            while(attempts < 200)
            {
                attempts++;
                index = hashName.indexOf("/", startSearchIndex);
                if(index === -1) break;

                indexArray.push(index);
                startSearchIndex = index+1;
            }

            var i,
                startIndex,
                endIndex;

            for(i=0;i<indexArray.length;i++)
            {
                startIndex = indexArray[i];
                endIndex = indexArray[i+1];

                if(endIndex === undefined) endIndex = hashName.length;

                hashArray.push(hashName.slice(startIndex, endIndex));
            }

            //console.log(hashArray);

            return hashArray;

        },

        to: function(newHash, skipListeningOnce)
        {
            if(self.getHash() === newHash) return;

            if(skipListeningOnce) _ignoreNextHashChange = true;
            window.location.hash = "#" + newHash;
        },

        update: function()
        {
            if(_isListening)
            {
                if(_ignoreNextHashChange)
                {
                    //console.log("one hash change ignored");
                    _ignoreNextHashChange = false;
                }
                else
                {
                    executeHash(self.getHash());
                }
            }
        },

        getHash: function()
        {
            return window.location.hash.replace("#", "");
        }


    };

    function executeHash(hashName)
    {
        _lastExecutedHash = hashName;
        _cbOnHashChange.call(null, _lastExecutedHash);
    }

    function activeListener()
    {
        if ("onhashchange" in window) { // event supported?

            window.onhashchange = function () {
                self.update();
            }
        }
        else { // event not supported:
            var storedHash = window.location.hash;
            window.setInterval(function () {
                if (window.location.hash != storedHash) {
                    storedHash = window.location.hash;
                    self.update();
                }
            }, 100);
        }
    }

}());
