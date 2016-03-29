//The tree contains every letter from the text only once
//Every letter contains indecies of its every parent (every previous letter in the text) and every child (every next letter in the text)
function Tree (parentElem) {
	var text = parentElem.textContent;

	this.parentElem = parentElem;

    var current,
        previous,
        previousIndex;

	//get every letter from the text
    for (var i = 0; i < text.length; i++) {

        current = text.charAt(i);
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
	
};

//Search by a letter colocation
Tree.prototype.search = function (str) {
    if (str.length === 1) return {points: this[str].indecies, offset: str.length};

    var result = new Set ();

	//set result with all indecies of the first letter
    var currentSymbol = str.charAt(0),
        nextSymbol = str.charAt(1),
        previousSymbol = currentSymbol;
    if (!this[currentSymbol] || !this[currentSymbol].children[nextSymbol]) return null;
    for (var index of this[currentSymbol].children[nextSymbol]) {
        result.add (index);
    };

	//go from parent to child, if there is no next child, delete the corresponding property from result
    for (var i = 1; i < str.length - 1; i++) {
        currentSymbol = str.charAt(i),
        nextSymbol = str.charAt(i + 1);
        if (!this[currentSymbol] || !this[currentSymbol].children[nextSymbol]) return null;

        for (var index of this[currentSymbol].parents[previousSymbol]) {
            if (!this[currentSymbol].children[nextSymbol].has(index)) result.delete(index - i);
        };

        previousSymbol = currentSymbol;
    };

    return {points: result, offset: str.length};
};

//Selection of found matches after search
Tree.prototype.select = function (startPoints, selectionStyle) {
	var points = startPoints.points,
		offset = startPoints.offset,
		previousStartPoint = 0;

	var j = 0; //when a span is added to a text node, text is being divided, so I need to cout the amount of nodes
		
	for (var startPoint of points) {
		var range = document.createRange ();
		
		if (!j) {
			var start = startPoint - previousStartPoint;
			var end = startPoint - previousStartPoint + offset;
		}
		else {
			var start = startPoint - previousStartPoint - offset;
			var end = startPoint - previousStartPoint;
		}
		
		range.setStart (this.parentElem.childNodes[j], start);
		range.setEnd (this.parentElem.childNodes[j], end);
		
		var highLight = document.createElement ("span");
		highLight.classList.add ("highlight");
		highLight.style.cssText = selectionStyle;
		
		range.surroundContents (highLight);
		
		j += 2;
		previousStartPoint = startPoint;
	};
};

Tree.prototype.deselect = function () {
	//to keep text content of parent element in one node,
	//I delete all nodes from the element and replace them
	//with one text node which contains whole text,
	//just as it was before selection
	var content = "";
	var nodes = this.parentElem.childNodes;
	for (var i = 0; i < nodes.length; i++) {
		content += nodes[i].textContent;
		this.parentElem.removeChild (nodes[i--]);
	};
	this.parentElem.textContent = content;
};