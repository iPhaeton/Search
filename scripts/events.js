//Invoke search panel
Search.prototype.keyDown = function (self) {
	return function (event) {
		if ((event.ctrlKey && event.keyCode === 70) || (event.keyCode === 27 && !searchPanel.hidden)) { //Crtl+F; Esc
			self.showSearchPanel ();
			event.preventDefault ();
			return;
		};

		/*if (event.keyCode === 13 && document.activeElement === searchInput) { //Enter
		 nextButton.dataset.clicked = "true";
		 sequentialCheck.checked = true;
		 tree.select();
		 event.preventDefault ();
		 return;
		 };*/
	};
};

//Prevent search by default
Search.prototype.keyPress = function (event) {
	var char = getChar(event);
	if (event.ctrlKey && (char === "f" || char === "F")) {
		event.preventDefault ();
	};
};

//Search and select
Search.prototype.searchInputInput = function (self) {
	return function (event) {
		if (this.value.length) {
			for (var tree of self.textElements) {
				self.found = tree.search (this.value);
				if (self.found) tree.select ();
				else tree.deselectAll();
			};
		}
		else {
			for (var tree of self.textElements) {
				tree.deselectAll ();
			};
		};

		//showQuantity();
	};
};

//selection of only visible text
Search.prototype.scroll = function (self) {
	return function () {
		if (!self.searchPanel.hidden && self.searchInput.value) self.scrolled = true;
	};
};

Search.prototype.setTimerOnScroll = function (self) {
	return function () {
		if (self.scrolled) {
			self.scrollTimeOut = setTimeout (self.executeOnScroll(self), 0);
		}
	};
};

Search.prototype.executeOnScroll = function (self) {
	return function () {
		if (!self.found) return;
		for (var tree of self.textElements) {
			tree.select ();
			self.scrolled = false;
		};
	};
};

//deselect all
function searchPanelClick (event) {
	//close
	if (findTarget (event.target, "close-button")) {
		showSearchPanel ();
		return;
	}

	//navigation buttons
	var target = findTarget(event.target, "previous-button") || findTarget(event.target, "next-button");
	if (target /*&& sequentialCheck.checked*/) {
		target.dataset.clicked = "true";
		sequentialCheck.checked = true;
		tree.select();
		return
	};
	
	if (findTarget (event.target, "search-panel")) return;
};

//select of search panel invoke
function searchPanelFocus (event) {
	if (findTarget(event.target, "close-button") || findTarget(event.target, "search-button")) return; //new search isn't needed if a click was on the close button

	if (!findTarget(event.target, "search-input")) searchInput.focus();
	
	if (tree.found && searchInput.value)
		tree.select("focus");
	else if (!tree.found && searchInput.value) {
		tree.search (searchInput.value);
		tree.select("focus");
	};
};

function searchPanelChange (event) {
	if (findTarget(event.target, "sequential") && searchInput.value) tree.select();
};

//---------------------------------------------------------------------------------------------------------------------------------------
Search.prototype.showSearchPanel = function () {
	//show search panel
	if (this.searchPanel.hidden) {
		this.searchPanel.hidden = "";
	
		//to the beginning of the document insert a div of panel height to scroll the document down
		this.fakePanel = document.createElement("div");
		this.fakePanel.style.height = this.searchPanel.offsetHeight + "px";
		this.fakePanel.style.display = "block";
		this.parentElem.insertBefore (this.fakePanel, this.parentElem.firstChild);
		
		//focus on the input
		this.searchInput.focus();
	}
	//hide search panel
	else {
		this.searchPanel.hidden = "true";
		
		//remove the fake div
		this.parentElem.removeChild (this.fakePanel);
		//tree.deselectAll();
	};
};

function getChar(event) {
  if (event.which == null) { // IE
    if (event.keyCode < 32) return null; // ����. ������
    return String.fromCharCode(event.keyCode)
  };

  if (event.which != 0 && event.charCode != 0) { // ��� ����� IE
    if (event.which < 32) return null; // ����. ������
    return String.fromCharCode(event.which); // ���������
  };

  return null; // ����. ������
};

function findTarget (target, marker) { //arguments - initial target and wanted target's class or id
	while (target) {
		if (target.classList.contains (marker) || target.id === marker) return target;
		target = target.parentElement;
	};
};

//Show amount of found matches
function showQuantity () {
    if (searchInput.value) indicator.textContent = tree.lines.quantity;
    else indicator.textContent = "";
};