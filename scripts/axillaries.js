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
};

Lines.prototype = Object.create(Arr.prototype);
Lines.prototype.constructor = Lines;

Lines.prototype.add = function (item) {
    this[this.size] = {index: item, foundPositions: new SearchResults ()};
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

    alert(this.symbolMeasurements.width + "; " + this.symbolMeasurements.height);
};

Lines.prototype.clearResults = function () {
    for (var i = 0; i < this.size; i++) {
        this[i].foundPositions = new SearchResults ();
    };
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
            if (this[j].foundPositions.has(nextToDelete)) this[j].foundPositions.delete(nextToDelete);
            nextToDelete = yield;
        }
        else j++;
    };
};

//Search results-------------------------------------------------------------------------------------------------------------------
function SearchResults () {
    Object.defineProperty(this, "size", {enumrable: false, writable: true, value: 0});
    Object.defineProperty(this, "_previous", {enumrable: false, writable: true, value: undefined});
};

SearchResults.prototype.add = function (item) {
    if (this._previous) {
        this[item] = {prev: this._previous, next: null};
        this[this._previous].next = item;
    }
    else this[item] = {prev: null, next: null};

    this._previous = item;
    this.size++;
}

SearchResults.prototype.delete = function (item) {
    if (this[item].prev) this[this[item].prev].next = this[item].next;
    if (this[item].next) this[this[item].next].prev = this[item].prev;

    delete this[item];
    this.size--;
};

SearchResults.prototype.has = function (item) {
    if (this[item]) return true;
    else return false;
};