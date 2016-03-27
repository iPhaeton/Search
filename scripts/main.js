/**
 * Created by Phaeton on 26.03.2016.
 */

function Tree (text) {

    var current,
        previous,
        previousIndex;

    for (var i = 0; i < text.length; i++) {

        current = text.charAt(i);
        if (this[current] === undefined) {
            this[current] = {
                indecies:{},
                children:{},
                parents:{}
            };
            this[current].indecies[i] = null;
        }
        else {
            this[current].indecies[i] = null;
        };

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

    var currentSymbol = str.charAt(0),
        nextSymbol = str.charAt(1),
        previousSymbol = currentSymbol;
    if (!this[currentSymbol] || !this[currentSymbol].children[nextSymbol]) return null;
    for (var index in this[currentSymbol].children[nextSymbol]) {
        result[index] = null;
    };

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