/**
 * Created by Phaeton on 26.03.2016.
 */

document.addEventListener ("keydown", documentKeyDown);
document.addEventListener ("keypress", documentKeyPress);
document.addEventListener ("click", documentClick);

var p = document.querySelector("p");
var tree = new Tree(p);
var matches = tree.search("d");
tree.select (matches);