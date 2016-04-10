//The tree contains every letter from the text only once
//Every letter contains indecies of its every parent (every previous letter in the text) and every child (every next letter in the text)
function Tree (parentElem, style) {
	this.text = parentElem.textContent;
	this.parentElem = parentElem;

    this.markLines();
    this.lines.measureLines();

    //set style
    this.defStyle = style.default || "highlight-default";
	this.cmplxStyle = style.complex;

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
    this.foundPositions = new SearchResults (); //positions of existing selections, initially empty
};

//Search-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Search by a letter colocation
Tree.prototype.search = function (str) {
	var timeStart = performance.now();

	if (str === this.found) return true;

	this.found = str;
    this.lines.clearResults();

	var j = 0;
    if (this.found.length === 1) {
		this.lines.setResults(this[this.found].indecies);
		//alert(performance.now() - timeStart);
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
	this.lines.setResults(this[currentSymbol].children[nextSymbol]);

	//go from parent to child, if there is no next child, delete the corresponding property from result
    for (var i = 1; i < this.found.length - 1; i++) {
        currentSymbol = this.found.charAt(i),
        nextSymbol = this.found.charAt(i + 1);
        if (!this[currentSymbol] || !this[currentSymbol].children[nextSymbol]) {
            this.found = "";
            return false;
        };

		var gen = this.lines.deleteResult();
		gen.next();
        for (var index of this[currentSymbol].parents[previousSymbol]) {
            if (!this[currentSymbol].children[nextSymbol].has(index))
				gen.next(index - i);
        };

        previousSymbol = currentSymbol;
    };

	//alert(performance.now() - timeStart);
    return true;
};

//Selection-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Selection of found matches after search
Tree.prototype.select = function () {
	var offset = this.found.length,
		innerHTML = "",
		i = 0,
		selected = false;

	//selection
	for (var j = 0; j < this.lines.size; j++) {
		//check, if the line is on screen
		if (this.lines[j].computedTop < window.pageYOffset - 0.5*document.documentElement.clientHeight) continue;

		for (var startPoint in this.lines[j].foundPositions) {
			if (!this.lines[j].foundPositions.hasOwnProperty(startPoint)) continue;
			else startPoint = +startPoint;

			//check, if the symbol is visible
			if ((startPoint - this.lines[j].index) * this.lines.symbolMeasurements.width < window.pageXOffset - document.documentElement.clientWidth) continue;

			innerHTML += this.text.slice (i, startPoint) + "<span class='" + this.defStyle + "' data-position='" + startPoint +
					"' style='white-space: pre'>" + this.text.slice (startPoint, startPoint + offset) + "</span>";
			i = startPoint + offset;
			selected = true;

			//check, if the symbol is visible
			if ((startPoint - this.lines[j].index) * this.lines.symbolMeasurements.width > window.pageXOffset + 3*document.documentElement.clientWidth) break; //3 screens, because a symbol width is very approximate
		};

		//check, if the line is on screen
		if (this.lines[j].computedTop > window.pageYOffset + 1.5*document.documentElement.clientHeight) break;
	};

	//if found text is not on the screen
	if  (!selected) {
		this.deselectAll ();
		return;
	};

	innerHTML += this.text.slice (i);

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
Tree.prototype.markLines = function () {
    this.lines = new Lines(this);
    this.lines.add (0);

    for (var i = 0; i < this.text.length; i++) {
        if (this.text[i] === "\n") {
            this.lines.add(i + 1);
        };
    };
};