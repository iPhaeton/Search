/**
 * Created by Phaeton on 26.03.2016.
 */
 
//The tree contains every letter from the text only once
//Every letter contains indecies of its every parent (every previous letter in the text) and every child (every next letter in the text)
function Tree (text) {

    var current,
        previous,
        previousIndex;

    for (var i = 0; i < text.length; i++) {

        current = text.charAt(i);
        //if there is no such letter in the tree, create a new node for this letter and store its index
        if (this[current] === undefined) {
            this[current] = {
                indecies:{},
                children:{},
                parents:{}
            };
            this[current].indecies[i] = null;
        }
        //if there is such letter in the tree, only store its index in the existing node
        else {
            this[current].indecies[i] = null;
        };

        //if there is a parent, store its index
		//inside the parent store the index of the current letter among children
        if (previous) {
            if (!this[current].parents[previous]) this[current].parents[previous] = {};
            if (!this[previous].children[current]) this[previous].children[current] = {};

            this[current].parents[previous][i] = null;
            this[previous].children[current][previousIndex] = null;
        };
        previous = current;
        previousIndex = i;

    };

};

Tree.prototype.search = function (str) {
    if (str.length === 1) return this[str].indecies;

    var result = {};

    //set result with all indecies of the first letter
    var currentSymbol = str.charAt(0),
        nextSymbol = str.charAt(1),
        previousSymbol = currentSymbol;
    if (!this[currentSymbol] || !this[currentSymbol].children[nextSymbol]) return null;
    for (var index in this[currentSymbol].children[nextSymbol]) {
        result[index] = null;
    };
    
    //go from parent to child, if there is no next child, delete the corresponding property from result
    for (var i = 1; i < str.length - 1; i++) {
        currentSymbol = str.charAt(i),
        nextSymbol = str.charAt(i + 1);
        if (!this[currentSymbol] || !this[currentSymbol].children[nextSymbol]) return null;

        for (var index in this[currentSymbol].parents[previousSymbol]) {
            if (this[currentSymbol].children[nextSymbol][index] === undefined) delete result[index - i];
        };

        previousSymbol = currentSymbol;
    };

    return result;
};

var p = document.querySelector("p");
var tree = new Tree(p.textContent);
var matches = tree.search("ear");
