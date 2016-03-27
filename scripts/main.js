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


var p = document.querySelector("p");
var tree = new Tree(p.textContent);

