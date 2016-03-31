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
	if (findTarget (event.target, "search-panel")) return;
	
	tree.deselectAll ();
};

//search on pressing Enter
function searchPanelKeyDown (event) {
	if (event.keyCode === 13) {
		//clear results
		tree.clear ();
		
		//new search
		var searchInput = document.getElementById ("search-input");
		if (tree.search (searchInput.value)) tree.select ();
	};
};

//sequential search by every letter
function searchInputKeyPress (event) {
	var symbol = getChar (event);
	
	if (symbol === null) return;
	
	if (tree.sequentialSearch (symbol)) tree.sequentialDeselect ();
	else tree.deselectAll ();
	
	if (!this.value.length) tree.select ();

	//alert(tree.foundPositions.size);
};

//on change of the string
function searchInputKeyDown (event) {

	if (event.keyCode === 8 || event.keyCode === 46) {
		setTimeout(function () {
			var searchInput = document.getElementById ("search-input");
			
			if (!searchInput.value) tree.deselectAll (); //empty search string
			
			//carry out a new search, then select results, that weren't selected
			if(tree.search(searchInput.value)) 
				tree.sequentialSelect ();
		}, 0);
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