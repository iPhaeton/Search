/**
 * Created by Phaeton on 26.03.2016.
 */



var p = document.querySelector("p");
var tree = new Tree(p.textContent, p);
var matches = tree.search("ear");
tree.select (matches);


