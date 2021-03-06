//Search has 2 arguments:
//Search has 2 arguments:
//parent - a DOM element, wich will contain search panel and in wich search will be executed
//styles - object with styles of all elements,
//  		styles may be passed explicitely as a CSS text,
//			implicitely as CSS selector
//			or not passed at all, then default styles will be used
//{
//	searchPanel: style - search panel itself
//	searchInput: style - input for required string to search
//	previousButton: style - button of sequential search (find previous)
//	nextButton: style - button of sequential search (find next)
//	sequentialCheck: style - a checkbox to mark, that seaquential search is required
//	register: style - a checkbox to mark, if allowing for register is required
//	closeButton: style - button to close search panel
//	indicatoe: style - an indicator to show a current number of matches
//	hide: true/false - a switch to show search panel immideately after it was created or to hide it
//	simpleStyle: style - style of selection with spans (or default)
//	complexStyle: style - style of selection with divs, if set replaces simpleStyle or default
//}

function Search (parent, styles) {
	//check for DOM Element !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	this.parentElem = parent;
	this.found = false;
	this.selectedTreeIndex = undefined; //tree, on which selection stopped during sequential selection
    this.checkVisibility = true;

	//Styles----------------------------------------------------------------------------------------------------------
	//search panel
	this.searchPanel = document.createElement ("form");
	this.searchPanel.tabIndex = "1";
	this.setStyle(this.searchPanel, styles);

	//search input
	this.searchInput = document.createElement("input")
	this.searchInput.type = "text";
	this.setStyle(this.searchInput, styles);
	this.searchPanel.appendChild(this.searchInput);

	//navigation buttons
	this.previousButton = document.createElement("div");
	this.previousButton.tabIndex = "3";
	this.previousButton.dataset.clicked = "";
	this.setStyle(this.previousButton, styles);
	this.searchPanel.appendChild(this.previousButton);

	this.nextButton = document.createElement("div");
	this.nextButton.tabIndex = "4";
	this.nextButton.dataset.clicked = "";
	this.setStyle(this.nextButton, styles);
	this.searchPanel.appendChild(this.nextButton);

	//checkboxes
	this.sequentialCheck = document.createElement("input");
	this.sequentialCheck.type = "checkbox";
	this.setStyle(this.sequentialCheck, styles);
	this.searchPanel.appendChild(this.sequentialCheck);
	this.sequentialCheckText = document.createTextNode("Sequential search");
	this.searchPanel.appendChild(this.sequentialCheckText);

	this.register = document.createElement("input");
	this.register.type = "checkbox";
	this.setStyle(this.register, styles);
	this.searchPanel.appendChild(this.register);
	this.registerText = document.createTextNode("Case");
	this.searchPanel.appendChild(this.registerText);
	
	//close button
	this.closeButton = document.createElement("div");
	this.closeButton.tabIndex = "2";
	this.setStyle(this.closeButton, styles);
	this.searchPanel.appendChild(this.closeButton);
	
	//indicator
	this.indicator = document.createElement("div");
	this.setStyle(this.indicator, styles);
	this.searchPanel.appendChild(this.indicator);

	//append the panel
	this.parentElem.appendChild(this.searchPanel);
	//clear offset
	this.clearOffset = document.createElement("div");
	this.clearOffset.style.clear = "both";
	this.parentElem.appendChild(this.clearOffset);

	//selection style
	this.selectionStyle = {};
	this.setSelectionStyle(styles);

	//Events----------------------------------------------------------------------------------------------------------
	//invoke panel
	this.parentElem.addEventListener ("keydown", this.keyDown(this));
	this.parentElem.addEventListener ("keypress", this.keyPress);
	//input
	this.searchInput.addEventListener("input", this.searchInputInput(this));
	//scroll
	this.scrolled = false;
	document.addEventListener ("scroll", this.scroll(this));
	setInterval (this.setTimerOnScroll(this), 200);
	//click
	this.searchPanel.addEventListener ("click", this.searchPanelClick(this));
	//focus
	this.searchPanel.addEventListener("focus", this.searchPanelFocus(this), true);
	//change checkbox
	this.searchPanel.addEventListener("change", this.searchPanelChange(this));

	//Gather text----------------------------------------------------------------------------------------------------
	this.textElements = [];
	this.collectTextElements(this.parentElem);
};

Search.prototype.collectTextElements = function (elem) {
	if (!elem.children.length && hasOnlyText(elem)) {
		this.textElements.push(new Tree(this, elem, {simpleStyle: this.selectionStyle.simpleStyle, complexStyle: this.selectionStyle.complexStyle}));
	}
	else{
		for (var i = 0; i < elem.children.length; i++) {
			if (elem.children[i].hidden || elem.children[i] === this.searchPanel) continue;
			this.collectTextElements(elem.children[i]);
		};
	};
};

Search.prototype.setStyle = function (elem, styles) {
	switch (elem) {

		//search panel style
		case this.searchPanel:
			var defaultStyle = "background-color:#eee;\
							 top:0px;\
							 left:0px;\
							 width:100%;\
							 border:1px solid blue;\
							 padding:5px;\
							 box-sizing:border-box;\
							 position: fixed;\
							 z-index: 101";

			var style = this.getStyleFromArgument("searchPanel", styles, defaultStyle);
			//set hidden
			if (styles instanceof Object) {
				if (styles.hide === false) this.searchPanel.hidden = false;
				else this.searchPanel.hidden = true;
			}
			else{
				this.searchPanel.hidden = true;
			};

		break;

		//search input style
		case this.searchInput:
			var defaultStyle = "float: left";
			var style = this.getStyleFromArgument("searchInput", styles, defaultStyle);
		break;

		//navigation buttons style
		case this.previousButton:
			var defaultStyle = "width: 20px;\
								height: 20px;\
								display: inline-block;\
								margin-left: 5px;\
								background: blue";
			var  style = this.getStyleFromArgument("previousButton", styles, defaultStyle);
		break;

		case this.nextButton:
			var defaultStyle = "width: 20px;\
								height: 20px;\
								display: inline-block;\
								margin-left: 5px;\
								background: blue";
			var  style = this.getStyleFromArgument("nextButton", styles, defaultStyle);
		break;

		//checkboxes style
		case this.sequentialCheck:
			var defaultStyle = "";
			var style = this.getStyleFromArgument("sequentialCheck", styles, defaultStyle);
		break;

		case this.register:
			var defaultStyle = "";
			var style = this.getStyleFromArgument("register", styles, defaultStyle);
		break;

		//close button style
		case this.closeButton:
				var defaultStyle = "width:20px;\
									height:20px;\
									float:right;\
									background: red";
				var style = this.getStyleFromArgument("closeButton", styles, defaultStyle);
		break;

		//indicator style
		case this.indicator:
			var defaultStyle = "float:right";
			var style = this.getStyleFromArgument("indicator", styles, defaultStyle);
		break;
	};
	
	elem.style.cssText = style;
	if (!elem.style.cssText) elem.style.cssText = defaultStyle;
};

Search.prototype.setSelectionStyle = function (styles) {
	var defaultStyle = "background-color: rgb(150, 255, 100)";

	if (styles instanceof Object) {
		var complexStyle = this.getStyleFromArgument("complexStyle", styles, defaultStyle);
		if (complexStyle) var simpleStyle = "";
		else simpleStyle = this.getStyleFromArgument("simpleStyle", styles, defaultStyle);
	};

	this.selectionStyle.complexStyle = complexStyle;
	this.selectionStyle.simpleStyle = simpleStyle || defaultStyle;
};

Search.prototype.getStyleFromArgument = function (selector, styles, defaultStyle) {
	if (styles instanceof Object) {
		if (styles[selector]) {
			var style = getStyleFromCSS(styles[selector]) || styles[selector];
			if (styles.withDefault === true) style = defaultStyle + ";" + style;
			return style;
		};
	};
}

function getStyleFromCSS (selector) {
    for (var i = 0; i < document.styleSheets.length; i++) {
        for (var j = 0; j < document.styleSheets[i].cssRules.length; j++) {
            if (document.styleSheets[i].cssRules[j].selectorText === selector) {
                var cssText = document.styleSheets[i].cssRules[j].cssText;
                return cssText.slice (cssText.indexOf("{") + 1, -1);
            };
        };
    };
};

function hasOnlyText (elem) {
	if (!elem.childNodes.length) return false;
	for (var i = 0; i < elem.childNodes.length; i++) {
		if (elem.childNodes[i].nodeType !== 3) return false;
	};
	return true;
};