//Mention.js
//Frank Hu @ 12/30/2016

function Mention(parameters) {
    
    var searchBy = parameters.searchBy;
    var inputSelector = parameters.dom;
    var data = parameters.data;
    
    var opt = {
        delimiter       : '@',
        caseSensitive   : false,
        dropdownLimit   : -1,
        event           : 'keyup'
    };
    
    var cssClass = {
        dataHolder      : '',
        ul              : '',
        li              : ''
    };
    
    //nodes: actual HTML DOM element gotten via inputSelector string
    var nodes;
    var results = [];
    var inputObj = {searchValue : '', prevInput : ''};
    
    //Custom callback function when event is fired
    var callbackFn = function(element) {};
    
    //Default onClick function
    var onClickCallback = function(element) {
        nodes.value = inputObj.prevInput + ' ' + opt.delimiter + element[searchBy[0]];
        _removeHTML();
        nodes.focus();
    };
    
    //Stores onClick function. Modified via onClick(function(data){...});
    var onClickFn = function(element) {
        onClickCallback(element);
    };
    
    function _init(options,cssOptions){
        //Setup defaults if empty options are given
        for(var key in opt) {
            if(typeof(options) !== 'undefined') {
                if(!options.hasOwnProperty(key)) {
                    continue;
                }
                opt[key] = options[key];
            }
        }
        
        //Setup CSS Style Class
        for(var key in cssClass) {
            if(typeof(cssOptions) !== 'undefined') {
                if(!cssClass.hasOwnProperty(key)) {
                    continue;
                }
                cssClass[key] = cssOptions[key];
            }
        }

        //Determines if input element is refered by class, id, or name
        if(inputSelector.startsWith('.')){
            nodes = document.getElementsByClassName(inputSelector.slice(1));
            nodes = nodes[0];
        }
        else if(inputSelector.startsWith('#')){
            nodes = document.getElementById(inputSelector.slice(1));
        }
        else {
            nodes = document.getElementsByName(inputSelector);
            nodes = nodes[0];
        }
        
        //Initializes regex parse
        nodes.addEventListener(opt.event,_autoComplete);
    }

    function _autoComplete() {
        results = [];

        inputObj = _refineInput();
        //auto-complete only works for the last word that starts with a delimiter
        if(typeof(inputObj.searchValue) != 'undefined' && inputObj.searchValue.startsWith(opt.delimiter)) {
            var regex = _setRegex(inputObj.searchValue.slice(1));
            data.forEach(function(dataObj,i){    
                searchBy.forEach(function(searchKey,j){
                   if(regex.test(dataObj[searchKey])) {
                        if(results.indexOf(dataObj) == -1) {
                            results.push(dataObj);
                        }
                    } 
                });
            });

            _displayResults();
        }
        else {
            _removeHTML();
        }

    }

    function _refineInput() {
        var inputValue = nodes.value;
        var inputArr = [];
        var refineValue, refineInput;
        inputArr = inputValue.split(' ');
        if(inputArr[inputArr.length - 1].startsWith(opt.delimiter) && inputArr[inputArr.length - 1] != opt.delimiter) {
            refineValue = inputArr.pop();
            refineInput = inputArr.join(' ');
            return {searchValue : refineValue, prevInput : refineInput};
        }
        else {
            return {searchValue : refineValue, prevInput : inputValue};
        } 
    };

    //Generates dropdown list
    function _displayResults() {
        //Remove previous dropdown
        _removeHTML();
        if(document.getElementById('mentionDropdownContainer_'+inputSelector) == null) {
            var parent = nodes.parentNode;
            var containerDiv = document.createElement('div');
            parent.replaceChild(containerDiv,nodes);
            containerDiv.appendChild(nodes);
            containerDiv.setAttribute('id','mentionDropdownContainer_'+inputSelector);
        }
        else {
            var containerDiv = document.getElementById('mentionDropdownContainer_'+inputSelector);
        }

        var ul = document.createElement('ul');
        var docFrag = document.createDocumentFragment();
        ul.setAttribute('id','mentionDropdown_'+inputSelector);

        results.forEach(function(dataObj,index){
            if(opt.dropdownLimit < 0 || index < opt.dropdownLimit) {

                var htmlObj = {
                    'dataHolder'  : document.createElement('div'),
                    'li'             : document.createElement('li')
                };

                htmlObj.dataHolder.setAttribute('class', cssClass.dataHolder);
                htmlObj.dataHolder.setAttribute('name', 'mentiondataHolder');
                htmlObj.dataHolder.setAttribute('style','white-space: pre;');
                htmlObj.dataHolder.textContent = _computeTextContent(dataObj);
                htmlObj.dataHolder.onclick = function() {
                    onClickFn(dataObj);
                };

                //Add dataHolder to li
                htmlObj.li.appendChild(htmlObj.dataHolder);
                htmlObj.li.setAttribute('class',cssClass.li);
                docFrag.appendChild(htmlObj.li);
            }
        });
        ul.appendChild(docFrag);
        ul.setAttribute('class',cssClass.ul);
        containerDiv.appendChild(ul);
        nodes.focus();
        
        _listen();
    };

    function _removeHTML() {
        var parent = document.getElementById('mentionDropdownContainer_'+inputSelector);
        var child = document.getElementById('mentionDropdown_'+inputSelector);
        if(child != null) {
            parent.removeChild(child);
        }
    }
    
    function _computeTextContent(dataObj) {
        var rawString = "";
        
        searchBy.forEach(function(key) {
            rawString += dataObj[key] + "\r\n";
        });
        return rawString;
    }

    function _listen(){
      callbackFn();  
    };

    function _setRegex(inputValue){
        var regex;
        if(!opt.caseSensitive) {
            return regex = new RegExp('('+inputValue+')','i');
        }
        else {
            return regex = new RegExp('('+inputValue+')');
        }
    };

    function _setOptions(options) {
        for(var key in options) {
            if(opt.hasOwnProperty(key)) {
                opt[key] = options[key];
            }
        }
    };

    function _setCSS(cssObj) {
        for(var key in cssObj) {
            if(cssClass.hasOwnProperty(key)) {
                cssClass[key] = cssObj[key];
            }
        }
    };


    // Public Functions
    
    
    function init(options,cssOptions){
        _init(options,cssOptions);
    }

    function listen(callback) {
        callbackFn = callback;
    }

    function getResults(){
        return results;
    }

    function getOptions(){
        return opt;
    }

    function getCSS(){
        return cssClass;
    }

    function setOnClickFn(clickFunc) {
        onClickCallback = clickFunc;
    }

    function setOptions(options) {
        _setOptions(options);
    }

    function setCssClass(cssObj) {
        _setCSS(cssObj);
    }

    function removeHTML() {
        _removeHTML();
    }
    
    //Removes event listener from DOM element
    //Re-enable by running init() again
    function disable() {
        nodes.removeEventListener(opt.event, _autoComplete);
    }

    return {
        init            : init,
        listen          : listen,
        onClick         : setOnClickFn,
        setOptions      : setOptions,
        setCSS          : setCssClass,
        getResults      : getResults,
        getOptions      : getOptions,
        getCSS          : getCSS,
        closeHTML       : removeHTML,
        disable          : disable
    }
};