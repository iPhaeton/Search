//invoke search panel
function documentKeyDown (event) {
	if (event.ctrlKey && event.keyCode === 70) {
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
function documentClick (event) {
	if (findTarget (event.target, "close-button")) {
		showSearchPanel ();
		return;
	}
	
	if (findTarget (event.target, "search-panel")) return;
	
	tree.deselectAll ();
};

//select of search panel invoke
function searchPanelFocus (event) {
	if (findTarget(event.target, "close-button")) return;

	var searchInput = document.getElementById("search-input");
	if (tree.found && searchInput.value) tree.select(tree.foundPositions);
	else if (!tree.found && searchInput.value) {
		tree.search (searchInput.value);
		tree.select(tree.foundPositions);
	}
};

//search and select
function searchInputInput (event) {
	if (this.value.slice(0, -1) === tree.found && this.value.length > 1) {
		if (tree.sequentialSearch (this.value.slice(-1))) tree.select (tree.foundPositions);
		else tree.deselectAll();
	}
	else if (this.value.length === 0) {
		tree.deselectAll ();
	}
	else {
		if (tree.search (this.value)) tree.select (tree.foundPositions);
		else tree.deselectAll();
	};
};

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

function findTarget (target, marker) {
	while (target) {
		if (target.classList.contains (marker) || target.id === marker) return target;
		target = target.parentElement;
	};
};