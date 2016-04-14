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
 
 
function SearchObject (styles) {
	
};