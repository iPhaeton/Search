/**
 * Created by Phaeton on 26.03.2016.
 */
 
document.addEventListener ("keydown", documentKeyDown);
document.addEventListener ("keypress", documentKeyPress);
document.addEventListener ("click", documentClick);

//scroll
var scrollTimeOut;
var scrolled = false;
document.addEventListener ("scroll", documentScroll);

var searchPanel = document.getElementById ("search-panel");
searchPanel.addEventListener("focus", searchPanelFocus, true);

var searchInput = document.getElementById ("search-input");
searchInput.addEventListener("input", searchInputInput);

var p = document.querySelector("p");
var tree = new Tree(p, {default: "highlight", complex: "fancy-highlight"});

//------------------------------------------------------------------------------------------------------
/*
5. Selection on different lines?
9. Spaces
*/

/*
Errors:
1. parentElem contains not only text
2. comlexStyle = "default-highlight"
 */