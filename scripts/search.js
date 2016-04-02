//The tree contains every letter from the text only once
//Every letter contains indecies of its every parent (every previous letter in the text) and every child (every next letter in the text)
function Tree (parentElem, styles) {
	this.text = parentElem.textContent;

	this.parentElem = parentElem;

    //set style
    if (styles) {
        this.simpleStyle = styles.simpleStyle || "default-highlight";
        this.complexStyle = styles.complexStyle;
    }
    else {
        this.simpleStyle = "default-highlight";
    };

    var current,
        previous,
        previousIndex;

	//get every letter from the text
    for (var i = 0; i < this.text.length; i++) {

        current = this.text.charAt(i);
		//if there is no such letter in the tree, create a new node for this letter and store its index
        if (this[current] === undefined) {
            this[current] = {
                indecies: new Set (),
                children: {},
                parents: {}
            };
            this[current].indecies.add (i); 
        }
		//if there is such letter in the tree, only store its index in the existing node
        else {
            this[current].indecies.add (i);
        };

		//if there is a parent, store its index
		//inside the parent store the index of the current letter among children
        if (previous) {
            if (!this[current].parents[previous]) this[current].parents[previous] = new Set ();
            if (!this[previous].children[current]) this[previous].children[current] = new Set ();

            this[current].parents[previous].add (i);
            this[previous].children[current].add (previousIndex);
        };
        previous = current;
        previousIndex = i;

    };
	
	this.found = ""; //text which was found and selected, initially empty
	this.foundPositions = new Set (); //positions of existing selections, initially empty
    this.previousFoundPositions = new Set (); //result of the previous search
};

//Search-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Search by a letter colocation
Tree.prototype.search = function (str) {
	if (str === this.found) return true;
	
	this.found = str;
	this.foundPositions.clear ();
	
    if (this.found.length === 1) {
		for (var index of this[this.found].indecies) {
			this.foundPositions.add (index);
		};
		return true;
	};

	//set result with all indecies of the first letter
    var currentSymbol = this.found.charAt(0),
        nextSymbol = this.found.charAt(1),
        previousSymbol = currentSymbol;
    if (!this[currentSymbol] || !this[currentSymbol].children[nextSymbol]) return false;
    for (var index of this[currentSymbol].children[nextSymbol]) {
        this.foundPositions.add (index);
    };

	//go from parent to child, if there is no next child, delete the corresponding property from result
    for (var i = 1; i < this.found.length - 1; i++) {
        currentSymbol = this.found.charAt(i),
        nextSymbol = this.found.charAt(i + 1);
        if (!this[currentSymbol] || !this[currentSymbol].children[nextSymbol]) return false;

        for (var index of this[currentSymbol].parents[previousSymbol]) {
            if (!this[currentSymbol].children[nextSymbol].has(index)) this.foundPositions.delete(index - i);
        };

        previousSymbol = currentSymbol;
    };

    return true;
};

Tree.prototype.sequentialSearch = function (symbol) {
    this.previousFoundPositions = this.cloneResults(this.foundPositions);

    this.found += symbol;

    //no such symbol
    if (!this[symbol]) return false;

    //first entered symbol
    if (!this.foundPositions.size) {
        for (var index of this[symbol].indecies) {
            this.foundPositions.add(index);
        };
        return true;
    };

    //next symbols
    var previousSymbol = this.found.charAt(this.found.length - 2);
    if (!this[symbol].parents[previousSymbol]) return false; //no connection to the previous entered symbol

    for (var index of this.foundPositions) {
        index += this.found.length - 1;
        if (!this[symbol].parents[previousSymbol].has(index)) this.foundPositions.delete (index - this.found.length + 1);
    };
    return true;
};

//Selection-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Selection of found matches after search
Tree.prototype.select = function (points) {
	var offset = this.found.length,
		innerHTML = "",
		i = 0;
		
	for (var startPoint of points) {
		innerHTML += this.text.slice (i, startPoint) + "<div class='" + this.simpleStyle + "' data-position='" + startPoint +
            "' style='display: inline'>" + this.text.slice (startPoint, startPoint + offset) + "</div>";
		i = startPoint + offset;
	};
	
	innerHTML += this.text.slice (startPoint + offset);

	this.parentElem.innerHTML = innerHTML;
    if (this.complexStyle) this.showSelection(this.foundPositions);
};

//Deselect all
Tree.prototype.deselectAll = function () {
	this.parentElem.innerHTML = this.text;
};

Tree.prototype.showSelection = function (points) {
    var offset = this.found.length,
        innerHTML = this.text,
        i = 0,
        j = 0;

    var highLights = this.parentElem.getElementsByClassName(this.simpleStyle);

    for (var startPoint of points) {
        innerHTML += this.text.slice (i, startPoint) + "<div class='" + this.complexStyle + "' data-position='" + startPoint + "'" +
            " style='display: inline; position: absolute; z-index: 100; top :" + highLights[j].offsetTop + "px; left: " + highLights[j].offsetLeft + "px;" +
            " width: " + highLights[j].offsetWidth + "px; height: " + highLights[j++].offsetHeight + "px" +
            "'>" + this.text.slice (startPoint, startPoint + offset) + "</div>";
        i = startPoint + offset;
    };

    innerHTML += this.text.slice (startPoint + offset);
    this.parentElem.innerHTML = innerHTML;
};

//Axillary-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Clear the results of the last search
Tree.prototype.clear = function () {
	this.deselectAll ();
	this.found = "";
	this.foundPositions.clear ();
};

//Copy results of a search in case of deletion of the last symbol
Tree.prototype.cloneResults = function (set) {
    var clone = new Set ();
    for (var i of set) {
        clone.add(i);
    };
    return clone;
};