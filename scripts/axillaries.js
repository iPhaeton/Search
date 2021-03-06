/**
 * Created by Phaeton on 09.04.2016.
 */
//Arraylike object
function Arr () {
    Object.defineProperty(this, "size", {enumrable: false, writable: true, value: 0});
};

Arr.prototype.add = function (item) {
    this[this.size] = item;
    this.size++;
};

Arr.prototype.delete = function (index) {
    delete this[index];
    this.size--;
};

//Lines of text---------------------------------------------------------------------------------------------------------------------
function Lines (tree) {
    Arr.apply (this, arguments);
    Object.defineProperty(this, "tree", {enumrable: false, value: tree});
    Object.defineProperty(this, "quantity", {enumrable: false, value: 0, writable: true}); //amount of found matches
};

Lines.prototype = Object.create(Arr.prototype);
Lines.prototype.constructor = Lines;

Lines.prototype.add = function (item) {
    this[this.size] = new Line (item, this.size, this);
    this.size++;
};

Lines.prototype.measureLines = function () {
    //axillary div
    var style = getComputedStyle(this.tree.parentElem);

    var div = document.createElement("div");

    //copy styles
    div.style.fontFamily = style.fontFamily;
    div.style.fontSize = style.fontSize;
    div.style.fontStretch = style.fontStretch;
    div.style.fontStyle = style.fontStyle;
    div.style.fontWeight = style.fontWeight;
    div.style.whiteSpace = style.whiteSpace;

    //set styles
    div.style.display = "inline-block";

    this.tree.parentElem.appendChild(div);

    //finding position of every line
    var top = 0;

    for (var i = 0; i < this.size; i++){
        if (i < this.size - 1) div.textContent = this.tree.text.slice(this[i].index, this[i+1].index);
        else div.textContent = this.tree.text.slice(this[i].index);

        this[i].computedTop = top;
        top += div.offsetHeight;
    };

    //measure symbol
    div.textContent = "i";
    var width1 = div.offsetWidth;
    div.textContent = "W";
    var width2 = div.offsetWidth;

    this.symbolMeasurements = {width: (width1 + width2)/2, height: Math.max(div.offsetHeight, this.tree.parentElem.style.lineHeight)};
    this.tree.parentElem.removeChild(div);

    //alert(this.symbolMeasurements.width + "; " + this.symbolMeasurements.height);
};

Lines.prototype.clearResults = function () {
    for (var i = 0; i < this.size; i++) {
        this[i].foundPositions = new SearchResults (this);
    };
    this.quantity = 0;
};

Lines.prototype.setResults = function (points) {
    var j = 0;

    for (var index of points) {
        while (j < this.size) {
            if (this[j + 1]) var nextIndex = this[j + 1].index;
            else var nextIndex = this.tree.text.length;

            //write down the found index to the appropriate line
            if (index < nextIndex) {
                this[j].foundPositions.add (index);
                this.quantity++;
                break;
            }
            else j++;
        };
    };
};

Lines.prototype.deleteResult = function* () {
    var j = 0;

    var nextToDelete = yield;

    while (j < this.size) {
        if (this[j + 1]) var nextIndex = this[j + 1].index;
        else var nextIndex = this.tree.text.length;

        if (nextToDelete < nextIndex) {
            if (this[j].foundPositions.has(nextToDelete)) {
                this[j].foundPositions.delete(nextToDelete);
                this.quantity--;
            };
            nextToDelete = yield;
        }
        else j++;
    };
};

//Line-----------------------------------------------------------------------------------------------------------------------------
function Line (item, selfIndex, parent) {
	this.index = item;
	this.selfIndex = selfIndex;
	this.parent = parent;
	this.foundPositions = new SearchResults ();
};

//returns first match in line
Line.prototype.getFirstPositionInLine = function () {
    for (var startPosition in this.foundPositions) {
        if (!this.foundPositions.hasOwnProperty(startPosition)) continue;
        return +startPosition;
    };
};

//returns last match in line
Line.prototype.getLastPositionInLine = function () {
	return this.foundPositions.lastPosition;
};

//returns the next to the index position
Line.prototype.getNextPosition = function (index) {
	if (this.foundPositions[index].next) return {selection: this.foundPositions[index].next, line: this.selfIndex};
	else {		
		for (var i = this.selfIndex + 1; i < this.parent.size; i++) {
			var toReturn = this.parent[i].getFirstPositionInLine ();
			if (toReturn) return {selection: toReturn, line: i};
		};
	};
	
	return false;
};

//returns the previous to the index position
Line.prototype.getPreviousPosition = function (index) {
    if (this.foundPositions[index].prev !== null) return {selection: this.foundPositions[index].prev, line: this.selfIndex};
    else {
        for (var i = this.selfIndex - 1; i >= 0; i--) {
            var toReturn = this.parent[i].getLastPositionInLine();
            if (toReturn) return {selection: toReturn, line: i};
        };
    };
};

//Search results-------------------------------------------------------------------------------------------------------------------
function SearchResults () {
    Object.defineProperty(this, "size", {enumrable: false, writable: true, value: 0});
    Object.defineProperty(this, "_previous", {enumrable: false, writable: true, value: undefined});
	Object.defineProperty(this, "lastPosition", {enumrable: false, writable: true, value: null});
	Object.defineProperty(this, "_parent", {enumrable: false, value: parent});
};

SearchResults.prototype.add = function (item) {
    if (this._previous !== undefined) {
        this[item] = {prev: this._previous, next: null};
        this[this._previous].next = item;
    }
    else this[item] = {prev: null, next: null};

    this._previous = item;
    this.size++;
	this.lastPosition = item;
}

SearchResults.prototype.delete = function (item) {
    if (this[item].prev) {
		if (this.lastPosition === item) this.lastPosition = this[item].prev; //redifine the last match of the line
		
		this[this[item].prev].next = this[item].next; //redefine the link of the previous match
	}
	else {
		if (this.lastPosition === item) this.lastPosition = null; //redifine the last match of the line
	};
	
    if (this[item].next) this[this[item].next].prev = this[item].prev; //redefine the link of the next match

    delete this[item];
    this.size--;
};

SearchResults.prototype.has = function (item) {
    if (this[item]) return true;
    else return false;
};