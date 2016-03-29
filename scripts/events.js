//document
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

function documentClick (event) {
	tree.deselect ();
};

//search on pressing Enter
function searchPanelKeyDown (event) {
	if (event.keyCode === 13) {
		tree.deselect ();
		var searchInput = document.getElementById ("search-input");
		var matches = tree.search (searchInput.value);
		tree.select (matches, "background-color: rgb(150, 255, 100)");
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
    if (event.keyCode < 32) return null; // спец. символ
    return String.fromCharCode(event.keyCode)
  };

  if (event.which != 0 && event.charCode != 0) { // все кроме IE
    if (event.which < 32) return null; // спец. символ
    return String.fromCharCode(event.which); // остальные
  };

  return null; // спец. символ
};