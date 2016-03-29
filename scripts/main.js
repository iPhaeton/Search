/**
 * Created by Phaeton on 26.03.2016.
 */

document.addEventListener ("keydown", documentKeyDown);
document.addEventListener ("keypress", documentKeyPress);
document.addEventListener ("click", documentClick);

var searchPanel = document.getElementById ("search-panel");
searchPanel.addEventListener ("keydown", searchPanelKeyDown);

var searchInput = document.getElementById ("search-input");
//searchInput.addEventListener ("keypress", searchInputKeyPress);

var p = document.querySelector("p");
var tree = new Tree(p);
