/**
 * Created by Phaeton on 26.03.2016.
 */


//searchPanel.addEventListener("change", searchPanelChange);

//indicator
var indicator = document.getElementById("indicator");

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

var searchObject = new Search(document.body);