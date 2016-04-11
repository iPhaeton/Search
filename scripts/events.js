//invoke search panel
function documentKeyDown (event) {
	if ((event.ctrlKey && event.keyCode === 70) || (event.keyCode === 27 && !searchPanel.hidden)) {
		showSearchPanel ();
		event.preventDefault ();
	};
};

//Prevent search by default
function documentKeyPress (event) {
	var char = getChar(event);
	if (event.ctrlKey && (char === "f" || char === "F")) {
		event.preventDefault ();
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
	if (target) {
		target.dataset.clicked = "true";
		tree.select();
		return
	};
	
	if (findTarget (event.target, "search-panel")) return;
};

//select of search panel invoke
function searchPanelFocus (event) {
	if (findTarget(event.target, "close-button")) return;

	var searchInput = document.getElementById("search-input");
	searchInput.focus();

	if (tree.found && searchInput.value)
		tree.select();
	else if (!tree.found && searchInput.value) {
		tree.search (searchInput.value);
		tree.select();
	};
};

//search and select
function searchInputInput (event) {
	if (this.value.slice(0, -1) === tree.found && this.value.length > 1) {
		//if (tree.foundPositions.size) {
			if (tree.search (this.value)) tree.select ();
			else tree.deselectAll();
		//};
	}
	else if (this.value.length === 0) {
		tree.deselectAll ();
	}
	else {
		if (tree.search (this.value)) tree.select ();
		else tree.deselectAll();
	};

    showQuantity();
};

function searchPanelChange (event) {
	if (findTarget(event.target, "sequential") && searchInput.value) tree.select();
};

//selection of only visible text
function documentScroll () {
	if (!searchPanel.hidden && searchInput.value) scrolled = true;
};

setInterval (function () {
	if (scrolled) {
		scrollTimeOut = setTimeout (function () {
			if (tree.found) tree.select ();
			scrolled = false;
		}, 0);
	}
}, 200);

//---------------------------------------------------------------------------------------------------------------------------------------
function showSearchPanel () {
	var searchPanel = document.getElementById ("search-panel");
	
	//show search panel
	if (searchPanel.hidden) {
		searchPanel.hidden = "";
	
		//to the beginning of the document insert a div of panel height to scroll the document down
		var fakePanel = document.createElement("div");
		fakePanel.id = "fake-panel"
		fakePanel.style.height = searchPanel.offsetHeight + "px";
		fakePanel.style.display = "block";
		document.body.insertBefore (fakePanel, document.body.firstChild);
		
		//focus on the input
		var searchInput = document.getElementById ("search-input");
		searchInput.focus();
	}
	//hide search panel
	else {
		searchPanel.hidden = "true";
		
		//remove the fake div
		var fakePanel = document.getElementById ("fake-panel");
		document.body.removeChild (fakePanel);
		tree.deselectAll();
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