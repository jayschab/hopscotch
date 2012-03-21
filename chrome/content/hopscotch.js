/****************************************************
 * Hopscotch Page Jump Maker                        *
 *   Author: Jared Schaber                          *
 *   Last Modified: 26feb2011                       *
 *                                                  *
 * The hopscotch object contains all of the logic.  *
 ****************************************************/
var hopscotch = function () {
	var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	return {
        containingNode : undefined,
        
		init : function () {
			gBrowser.addEventListener("load", function () {
                var contextMenu = document.getElementById("contentAreaContextMenu");
                if (contextMenu)
                    contextMenu.addEventListener("popupshowing", hopscotch.showHideMenu, false);
                var menuItem = document.getElementById("hopscotch-make-link");
                if (menuItem) {
                    menuItem.addEventListener("DOMMenuItemActive",hopscotch.highlightId,false);
                    menuItem.addEventListener("DOMMenuItemInactive",hopscotch.unhighlightId,false);
                }
			}, false);
            
            hopscotch.loadjQuery(hopscotch);
		},
		
        highlightId : function() {
            if( !prefManager.getBoolPref("extensions.hopscotch.highlight") )
                return; //The user doesn't want us to highlight the node.
                
            var node = hopscotch.containingNode, 
                head = content.document.getElementsByTagName("head")[0],
				style = content.document.getElementById("hopscotch-style"),
            //jQuery code
                jQuery = hopscotch.jQuery,
                $ = function(selector,context){return new jQuery.fn.init(selector,context||window._content.document); };
            
            $.fn = $.prototype = jQuery.fn;
            hopscotch.env=window._content.document;

            //Add my stylesheet to the document
            if (!style) {
				style = content.document.createElement("link");
				style.id = "hopscotch-style";
				style.type = "text/css";
				style.rel = "stylesheet";
				style.href = "chrome://hopscotch/skin/skin.css";
				head.appendChild(style);
			}	
            
            //highlight it
            if(node) {
                node.addClass("hopscotch-selected",hopscotch.env);
            }
        },

        unhighlightId : function() {
            if( !prefManager.getBoolPref("extensions.hopscotch.highlight") )
                return; //The user doesn't want us to highlight the node.
                
            var node = hopscotch.containingNode,
            //jQuery code
                jQuery = hopscotch.jQuery,
                $ = function(selector,context){return new jQuery.fn.init(selector,context||window._content.document); };
            
            $.fn = $.prototype = jQuery.fn;
            hopscotch.env=window._content.document;
            
            //unhighlight it
            if(node) {
                node.removeClass("hopscotch-selected",hopscotch.env);
            }
        },        
        
        showHideMenu : function(event) {
            var show = document.getElementById("hopscotch-make-link"),
                node = document.popupNode,
                id = node.getAttribute("id"),
            //jQuery code
                jQuery = hopscotch.jQuery,
                $ = function(selector,context){return new jQuery.fn.init(selector,context||window._content.document); };
            
            $.fn = $.prototype = jQuery.fn;
            hopscotch.env=window._content.document;
            
            //default to not showing it on the menu
            show.hidden = true;
            
            //create jQuery object of popup node
            node = $(node,hopscotch.env);
            
            //If we are in a paragraph try to find an older sibling that is a header
            if( node.is('p') ) {
                //Find a descendant with an ID
                node = node.prevAll("h1,h2,h3,h4,h5,h6").first().find("[id]").first();
                if(node) id = node.attr("id");
            }
            else {            
                //walk up the DOM until we find an item with an "id" or hit the body
                node = node.closest("[id]",hopscotch.env);
                if(node) id = node.attr("id");
            }
            
            //if we found an item store it and enable the menu item
            if( id && (node.localName != "BODY") ) {
                hopscotch.containingNode = node;
                show.hidden = false;
            }

        },

        getlink : function () {
            var clipboard = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper),
                jumpID = encodeURIComponent(hopscotch.containingNode.attr("id"));
                preJumpURLRegex = /([^#]+)/;
                preJumpURL = preJumpURLRegex.exec(content.document.URL)[1];    
                
                
            var pageJumpURL = preJumpURL + '#' + jumpID;
             
            //put the link on the clipboard
            clipboard.copyString(pageJumpURL);
        },
        
        loadjQuery : function(context){
            var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
                        .getService(Components.interfaces.mozIJSSubScriptLoader);
            loader.loadSubScript("chrome://Hopscotch/content/jquery-1.5.1.min.js",context);

            var jQuery = window.jQuery.noConflict(true);
                if( typeof(jQuery.fn._init) == 'undefined') { jQuery.fn._init = jQuery.fn.init; }
            hopscotch.jQuery = jQuery;
        }
        
	};
}();

window.addEventListener("load", hopscotch.init, false);

