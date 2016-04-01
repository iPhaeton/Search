/**
 * Created by Phaeton on 26.03.2016.
 */

document.addEventListener ("keydown", documentKeyDown);
document.addEventListener ("keypress", documentKeyPress);
document.addEventListener ("click", documentClick);

var searchPanel = document.getElementById ("search-panel");
searchPanel.addEventListener("focus", searchPanelFocus, true);

var searchInput = document.getElementById ("search-input");
searchInput.addEventListener("input", searchInputInput);

var p = document.querySelector("p");
var tree = new Tree(p);

//------------------------------------------------------------------------------------------------------
/*
4. Long strings
5. Selection on different lines?
6. Very long texts?
7. Focus in Mozilla
*/