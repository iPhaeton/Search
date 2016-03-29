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
Tree.prototype.select = function (startPoints) {
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
		highLight.style.backgroundColor = "blue";
		highLight.classList.add ("highlight");
		
		range.surroundContents (highLight);
		
		j += 2;
		previousStartPoint = startPoint;
	};
};

Tree.prototype.deselect = function () {
	//cancel all the selections
	var highLights = this.parentElem.getElementsByClassName ("highlight");
	for (var i = 0; i < highLights.length; i++) {
		var elem = this.parentElem.firstChild;
		this.parentElem.insertBefore (highLights[i].firstChild, highLights[i]);
		this.parentElem.removeChild (highLights[i--]);
	};
	
	//and join the text back together
	var textNodes = this.parentElem.childNodes;
	for (i = 1; i < textNodes.length; i++) {
		this.parentElem.firstChild.data += textNodes[i].data;
		this.parentElem.removeChild (textNodes[i--]);
	};
};