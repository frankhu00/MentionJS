Mention JS Plugin Documentation:
Last edited 12/30/2016

Description: 
Allows input area to auto-suggest when input started with a delimiter (default @).

How to use it:
Instantiate Object with parameters{ dom, searchBy, data }

var param = {
    dom : ".htmlTextareaClassIdentifier",
    data : [{'name' : 'Example', 'profile' : 'MentionJS'},{'name' : 'Hello', 'profile' : 'World!'}]
    searchBy : ['name','profile']
}

var mention = new Mention(param);
mention.init(options, cssOptions); //enables plugin
mention.disable(); //disables plugin

Instance Parameters :

    dom :
        DOM element which the plugin should be used on. If the element is referred through its class name, begin with a '.' in front ot its class name. If it is referred via ID, begin with a '#'. The default method is through its name attribute, which does not need to begin with any character.

    data :
        An array of json data that contains relevant data to complete auto-suggest

    searchBy :
        An array containing field names of data. The plugin will search all matching patterns within these fields. Note: the first element defined in searchBy will be used for auto text completion (default onClick handler). 

Initialization Options ( init(options,CSSoptions) ) :

options - Options include 'delimiter','caseSensitive','dropdownLimit', and 'event'.

        delimiter     - [string] The character used to signal the start of mention. Must be the first character
                        inputted.
                        default: '@'

        caseSensitive - [boolean] If true, pattern matching will be case sensitive.
                        default: false

        dropdownLimit - [int] This sets the number of maximum results displayed via built-in html dropdown
                        list. If set to -1, the number of results will not be limited.
                        default: -1

        event         - [string] This sets the event that determines when the plugin is to run.
                        default: 'keyup'
                            
cssOptions - This sets the classes for each of the built-in html dropdown generator. This is intended for css styling of the elements through classes. The defaults are empty strings. These include the following:

        container   - A div element inserted to contain the selected input element and the generated ul element. This
                      element will have an ID of 'mentionDropdownContainer_'+DOMselector.

        dataHolder  - A div element that is used to hold the text content of JSON data. The text content will be a list of all the value with fields specified by searchBy. Default with a built-in onclick function that auto-completes the input to the value with the field being the first element of searchBy array. Can change the onclick function via mention.onClick(function(data){ ... }).

        ul          - The main dropdown list element. This element will have an ID of 'mnentionDropdown_'+DOMselector.

        li          - li element that contains the dataHolder element.
            
HTML structure overview:
<div id="mentionDropdownContainer_selected_input_element" class="cssOptions.container">
    <input name="selected_input_element">
    <ul id="mentionDropdown_selected_input_element" class="cssOptions.ul">
        <li class="cssOptions.li">
            <div class="cssOptions.dataHolder">
                /** JSON data listed here **/
                data[searchBy[0]]
                data[searchBy[1]]
            </div>
        </li>
    </ul>
</div>
        
Methods:
Available methods are: init(), listen(), onClick(), closeHTML(), setOptions(), setCSS(), getResults(), getOptions(), and getCSS().

    init(options, cssOptions) - function used to enable the plugin.

    listen(callback) - function used to perform a callback after each event fire. The event firing condition is
                       determined by the 'event' option.
                       
    onClick(func)    - function used to defined custom onclick event. This method takes a function with a single parameter representing the selected JSON data
    
    closeHTML()      - function used to close the HTML dropdown list. Used in conjunction with onClick().

    setOptions()     - function used to set options.

    setCSS()         - function used to set cssOptions.

    getResults()     - returns an array of matching user objects.

    getOptions()     - returns the current plugin option configuration.

    getCSS()         - returns the current plugin css option configuration.
    

For example usage, please refer to MentionJSTestPage.html