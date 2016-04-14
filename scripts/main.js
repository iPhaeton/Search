/**
 * Created by Phaeton on 26.03.2016.
 */ 
//document
document.addEventListener ("keydown", documentKeyDown);
document.addEventListener ("keypress", documentKeyPress);

//scroll
var scrollTimeOut;
var scrolled = false;
document.addEventListener ("scroll", documentScroll);

//search panel
var searchPanel = document.getElementById ("search-panel");
searchPanel.addEventListener("focus", searchPanelFocus, true);
searchPanel.addEventListener ("click", searchPanelClick);
searchPanel.addEventListener("change", searchPanelChange);

//input
var searchInput = document.getElementById ("search-input");
searchInput.addEventListener("input", searchInputInput);

//text
var p = document.querySelector("p");
var tree = new Tree(p, {default: "highlight", complex: "fancy-highlight"});

//indicator
var indicator = document.getElementById("indicator");

//check boxes
var sequentialCheck = document.getElementById("sequential");
var registerCheck = document.getElementsByTagName("register");

//navigation buttons
var previousButton = document.getElementById("previous-button");
var nextButton = document.getElementById("next-button");

//for debugging
var debuggingDiv;

//------------------------------------------------------------------------------------------------------
/*
10. Reload on Enter
*/

/*
Errors:
1. parentElem contains not only text
2. comlexStyle = "default-highlight"
3. parentElem.whiteSpace !== "pre" || "pre-wrap"
 */

/*
To do:
1. Next and previous (Enter and buttons)
 */
 
/*
About style tables: http://professorweb.ru/my/javascript/js_theory/level2/2_4.php
*/
 
 
function Search (styles) {
    this.styles = {};

    this.styles.panelStyle = this.setStyle(styles.panelStyle)


    /*var styleSheets = document.styleSheets;

	for (var i = 0; i < styleSheets.length; i++) {
        for (var j = 0; j < styleSheets[i].cssRules.length; j++) {
            if (styleSheets[i].cssRules[j].selectorText = "#blue-div") {
                var cssText = styleSheets[i].cssRules[j].cssText;
                cssText = cssText.slice (cssText.indexOf("{") + 1, -1);

                var blueDiv = document.createElement("div");
                blueDiv.style.cssText = cssText;
                document.body.appendChild(blueDiv);
                return;
            };
        };
    };*/
};

Search.prototype.setStyle = function (style) {
    if (style) {
        this.styles.panelStyle = getStyleFromCSS(styles.panelStyle) || styles.panelStyle;
    }
    else {

    };
};

function getStyleFromCSS (selector) {
    for (var i = 0; i < document.styleSheets.length; i++) {
        for (var j = 0; j < document.styleSheets[i].cssRules.length; j++) {
            if (styleSheets[i].cssRules[j].selectorText = "#blue-div") {
                var cssText = styleSheets[i].cssRules[j].cssText;
                return cssText.slice (cssText.indexOf("{") + 1, -1);
            };
        };
    };
};

Search();