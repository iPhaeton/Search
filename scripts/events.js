//Invoke search panel
Search.prototype.keyDown = function (self) {
	return function (event) {
		if ((event.ctrlKey && event.keyCode === 70) || (event.keyCode === 27 && !self.searchPanel.hidden)) { //Crtl+F; Esc
			self.showSearchPanel ();
			event.preventDefault ();
			return;
		};

		if (event.keyCode === 13 && document.activeElement === self.searchInput) { //Enter
			event.preventDefault (event);
			self.nextButton.dataset.clicked = "true";
			self.sequentialCheck.checked = true;
			(self.searchPanelClick(self))(event);//tree.select();
			return;
		};
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
		self.checkVisibility = true;

		if (this.value.length) {
			//search
			for (var i = 0; i < self.textElements.length; i++) {
				self.found = self.textElements[i].search (this.value);
			};
			//selection
			for (var i = 0; i < self.textElements.length; i++) {
				if (self.checkVisibility && !self.textElements[i].isVisible()) continue;

				if (self.found) {
					if (self.textElements[i].select()) {
						self.selectedTreeIndex = i;
                        self.checkVisibility = true;
						break;
					}
                    else {
                        self.checkVisibility = false;
                    };
				}
				else {
					self.selectedTreeIndex = undefined;
					self.textElements[i].deselectAll();
				};
			};
		}
		else {
			for (var i = 0; i < self.textElements.length; i++) {
				self.textElements[i].deselectAll ();
			};
			self.selectedTreeIndex = undefined;
		};

		self.showQuantity();
	};
};

//Selection of only visible text
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
		for (var i = 0; i < self.textElements.length; i++) {
			if (self.textElements[i].select()) {
				self.selectedTreeIndex = i;
				break;
			};
		};
		self.scrolled = false;
	};
};

//Navigiton buttons
Search.prototype.searchPanelClick = function (self) {
	return function (event) {
		self.checkVisibility = true;

		//close
		if (findTarget(event.target, self.closeButton)) {
			self.showSearchPanel();
			return;
		};

		//navigation buttons
		if (event.keyCode === 13) var target = self.nextButton;
		else var target = findTarget(event.target, self.previousButton) || findTarget(event.target, self.nextButton);
		if (target) {
			target.dataset.clicked = "true";
			self.sequentialCheck.checked = true;

			//selection of the next or previous during sequential selection
			if (self.selectedTreeIndex !== undefined) {
				if (!self.textElements[self.selectedTreeIndex].select()){
					if (target === self.previousButton) {
						var end = -1,
							increment = -1,
							startFromTheEnd = true;
					}
					else {
						var end = self.textElements.length + 1,
							increment = 1,
							startFromTheEnd = false; //tells the tree, that that selection should be executed counting from the last found position
					};

					var i = self.selectedTreeIndex + increment;
					while (i !== end) {
						if (self.textElements[i].select("click", startFromTheEnd)) {
							self.textElements[self.selectedTreeIndex].deselectAll();
							self.selectedTreeIndex = i;
							break;
						};
						i += increment;
					};
				};
			}
			//single selection during sequential selection
			else {
				for (var i = 0; i < self.textElements.length; i++) {
					if (self.checkVisibility && !self.textElements[i].isVisible()) continue;

					if (self.textElements[i].select()) {
						self.selectedTreeIndex = i;
						for (var j = i + 1; j < self.textElements.length; j++) {
							self.textElements[j].deselectAll();
						};
						self.checkVisibility = true;
						break;
					}
					else {
						self.checkVisibility = false;
					};
				};
			};

			return;
		};

		if (findTarget(event.target, self.searchPanel)) return;
	};
};

//select of search panel invoke
Search.prototype.searchPanelFocus = function (self) {
	return function (event) {
		//new search isn't required if a click was on the close or navigation button
		if (findTarget(event.target, self.closeButton) || findTarget(event.target, self.previousButton) || findTarget(event.target, self.nextButton)) return;

		if (!findTarget(event.target, self.searchInput)) self.searchInput.focus();

		if (self.found && self.searchInput.value) {
			if (self.sequentialCheck.checked) {
				self.textElements[self.selectedTreeIndex].select("focus");
			}
			else {
				for (var i = 0; i < self.textElements.length; i++) {
					self.textElements[i].select("focus");
				};
			};
		}
		else if (!self.found && self.searchInput.value) {
			for (var i = 0; i < self.textElements.length; i++) {
				self.textElements[i].search (self.searchInput.value);
				self.textElements[i].select("focus");
			};
		};
	};
};

Search.prototype.searchPanelChange = function (self) {
	return function (event) {
		if (findTarget(event.target, self.sequentialCheck) && self.searchInput.value) {
            (self.searchInputInput(self)).call(self.searchInput);
		};
	};
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
		for (var i = 0; i < this.textElements.length; i++) {
			this.textElements[i].deselectAll();
		};
	};
};

function getChar(event) {
  if (event.which == null) {
    if (event.keyCode < 32) return null;
    return String.fromCharCode(event.keyCode)
  };

  if (event.which != 0 && event.charCode != 0) {
    if (event.which < 32) return null;
    return String.fromCharCode(event.which);
  };

  return null;
};

function findTarget (target, wanted) { //arguments - initial target and wanted target's class or id
	while (target) {
		if (target === wanted) return target;
		target = target.parentElement;
	};
};

//Show amount of found matches
Search.prototype.showQuantity = function () {
    if (this.searchInput.value) {
		var quantity = 0;
		for (var i = 0; i < this.textElements.length; i++) {
			 quantity += this.textElements[i].lines.quantity;
		};
		this.indicator.textContent = quantity;
	}
    else this.indicator.textContent = "";
};