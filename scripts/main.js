/**
 * Created by Phaeton on 26.03.2016.
 */

document.addEventListener ("keydown", documentKeyDown);
document.addEventListener ("keypress", documentKeyPress);
document.addEventListener ("click", documentClick);

var searchPanel = document.getElementById ("search-panel");
searchPanel.addEventListener ("keydown", searchPanelKeyDown);

var searchInput = document.getElementById ("search-input");
searchInput.addEventListener ("keypress", searchInputKeyPress);
searchInput.addEventListener("keydown", searchInputKeyDown);

var p = document.querySelector("p");
var tree = new Tree(p, "background-color: rgb(150, 255, 100)");

//-------------------------------------------------------------------------------------------------
var button = document.getElementById("button");
button.onclick = function () {
    /*var j = 0;

    for (var i = 0; i < 2000; i++) {
        var div = document.createElement("div");
        div.style.width = "5px";
        div.style.height = "5px";
        div.style.display = "inline-block";
        div.style.backgroundColor = "rgb(0,0," + j++ + ")";
        document.body.appendChild(div);

        if (j === 255) j = 0;
    };*/

    var p = document.querySelector("p");
    var text = p.textContent;

    for (var i = 0; i < text.length; i++) {
        var div = document.createElement("div");
        div.textContent = p.textContent[i];
        div.style.backgroundColor = "rgb(150, 255, 100)";
        div.style.display = "inline-block";
        document.body.appendChild(div);
    };
    document.body.removeChild(p);
};

//---------------------------------------------------------------------------------------------
/*
1. Typing in the middle
2. Insertion

1. During creation of a tree measure width of every symbol
2. divide symbols in lines
3. During selection count distance to the left of a line
 */