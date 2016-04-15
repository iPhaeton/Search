function Search (parent, styles) {
	//check for DOM Element !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	this.parentElem = parent;

	//search panel
	this.searchPanel = document.createElement ("form");
	this.searchPanel.tabindex = "1";
	this.setStyle(this.searchPanel, styles);

	this.parentElem.appendChild(this.searchPanel);
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
	};
	
	elem.style.cssText = style;
	if (!elem.style.cssText) elem.style.cssText = defaultStyle;
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