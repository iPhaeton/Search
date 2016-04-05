//The tree contains every letter from the text only once
//Every letter contains indecies of its every parent (every previous letter in the text) and every child (every next letter in the text)
function Tree (parentElem, style) {
	this.text = parentElem.textContent;

	this.parentElem = parentElem;

    //set style
    this.defStyle = style.default || "highlight-default";
	this.cmplxStyle = style.complex;
	
	//set the marks
	this.setMarks ();

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
    //this.previousFoundPositions = new Set (); //result of the previous search
};

//Search-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Search by a letter colocation
Tree.prototype.search = function (str) {
	//this.previousFoundPositions = new Set();
	
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
    if (!this[currentSymbol] || !this[currentSymbol].children[nextSymbol]) {
        this.found = "";
        return false;
    };
    for (var index of this[currentSymbol].children[nextSymbol]) {
        this.foundPositions.add (index);
    };

	//go from parent to child, if there is no next child, delete the corresponding property from result
    for (var i = 1; i < this.found.length - 1; i++) {
        currentSymbol = this.found.charAt(i),
        nextSymbol = this.found.charAt(i + 1);
        if (!this[currentSymbol] || !this[currentSymbol].children[nextSymbol]) {
            this.found = "";
            return false;
        };

        for (var index of this[currentSymbol].parents[previousSymbol]) {
            if (!this[currentSymbol].children[nextSymbol].has(index)) this.foundPositions.delete(index - i);
        };

        previousSymbol = currentSymbol;
    };

    return true;
};

Tree.prototype.sequentialSearch = function (symbol) {
    //this.previousFoundPositions = this.cloneResults(this.foundPositions);

    this.found += symbol;

    //no such symbol
    if (!this[symbol]) {
        this.found = "";
        return false;
    };

    //first entered symbol
    if (!this.foundPositions.size) {
        for (var index of this[symbol].indecies) {
            this.foundPositions.add(index);
        };
        return true;
    };

    //next symbols
    var previousSymbol = this.found.charAt(this.found.length - 2);
    if (!this[symbol].parents[previousSymbol]) {
        this.found = "";
        return false;
    } //no connection to the previous entered symbol

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

    //some idiotic malfunctioning of Chrome
    if (~navigator.userAgent.indexOf("Chrome")) {
        if (document.documentElement.clientWidth <
            Math.max(document.body.scrollWidth, document.documentElement.scrollWidth,
                document.body.offsetWidth, document.documentElement.offsetWidth,
                document.body.clientWidth, document.documentElement.clientWidth)) {
            var position = "static";
            var posDependentOffset = offset;
        }
        else {
            var position = "position: absolute";
            var posDependentOffset = 0;
        };
    }
    else {
        var position = "static";
        var posDependentOffset = offset;
    };
	
	//selection
	for (var startPoint of points) {
		innerHTML += this.text.slice (i, startPoint) + "<span class='" + this.defStyle + "' data-position='" + startPoint +
            "' style='" + position + "'>" + this.text.slice (startPoint, startPoint + offset) + "</span>";
		i = startPoint + posDependentOffset;
	};
	
	innerHTML += this.text.slice (startPoint + posDependentOffset);

	this.parentElem.innerHTML = innerHTML;
	//show complex style
    if (this.cmplxStyle) this.parentElem.innerHTML = this.text + this.showComplexStyle();

    /*var d = document.createElement("div");
    d.textContent = innerHTML;
    d.style.border = "1px solid red";
    document.body.appendChild(d);*/
};

//Add divs to show complex style
Tree.prototype.showComplexStyle = function () {
	var spans = this.parentElem.getElementsByClassName (this.defStyle);
		innerHTML = "",
		parentCoodrs = this.parentElem.getBoundingClientRect();
		
	//check borders
	spans[0].classList.add (this.cmplxStyle);
	var style = getComputedStyle(spans[0]),
		leftOffset = parseInt(style.paddingLeft) + parseInt(style.marginLeft) + parseInt(style.borderLeftWidth);
		topOffset = parseInt(style.paddingTop) + parseInt(style.marginTop) + parseInt(style.borderTopWidth);
	spans[0].classList.remove (this.cmplxStyle);
	
	for (var i = 0; i < spans.length; i++) {
		var coords = spans[i].getBoundingClientRect();
		innerHTML += "<div class='" + this.cmplxStyle + "' style='white-space:pre; position:absolute; top:" + (coords.top - parentCoodrs.top - topOffset) + "px; left:" + 
		(coords.left + window.pageXOffset - leftOffset) + "px'>" + spans[i].textContent + "</div>";
	};
	
	return innerHTML;
};

//Deselect all
Tree.prototype.deselectAll = function () {
	this.parentElem.innerHTML = this.text;
};

//Axillary-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Clear the results of the last search

//Copy results of a search in case of deletion of the last symbol
Tree.prototype.cloneResults = function (set) {
    var clone = new Set ();
    for (var i of set) {
        clone.add(i);
    };
    return clone;
};

Tree.prototype.measureSymbol = function () {
	var div = document.createElement ("div");
	div.style.position = "absolute";
	
	div.textContent = "i";
	this.parentElem.appendChild(div);
	var width1 = div.offsetWidth;
	
	div.textContent = "W";
	var width2 = div.offsetWidth;
    var height = Math.max(div.offsetHeight + 1, this.parentElem.style.lineHeight)
	this.parentElem.removeChild(div);
	
	return {width: (width1 + width2) / 2, height: height};
};

Tree.prototype.setMarks = function () {
	var symbolMeasurements = this.measureSymbol (),
        screenWidth = document.documentElement.clientWidth,
        screenHeight = document.documentElement.clientHeight,
        columnsOnScreen = 2 * Math.round(screenWidth/symbolMeasurements.width),
        linesOnScreen = 2 * Math.round(screenHeight/symbolMeasurements.height),
        scrollWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth,
                               document.body.offsetWidth, document.documentElement.offsetWidth,
                               document.body.clientWidth, document.documentElement.clientWidth),
        leftTopSymbol = Math.round(window.pageYOffset/symbolMeasurements.height) *
                        Math.round(scrollWidth/symbolMeasurements.width) +
                        Math.round(window.pageXOffset/symbolMeasurements.width);

    alert(leftTopSymbol);
};