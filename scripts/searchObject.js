function Search (styles) {
	//search panel
	this.searchPanel = document.createElement ("form");
	this.searchPanel.id = "search-panel";
	this.searchPanel.hidden = "true";
	this.searchPanel.tabindex = "1";
	this.setStyle(this.searchPanel, styles);
	this.searchPanel.style.position = "fixed";
	this.searchPanel.style.zIndex = "101";
	
};

Search.prototype.setStyle = function (elem, styles) {
	if (styles) style = getStyleFromCSS(styles[style]) || styles[style];
	else {
		switch (elem.id) {
			case "search-panel":
				if (styles) var style = styles.panelStyle;
				var style = "background-color:#eee;\
									top:0px;\
									left:0px;\
									width:100%;\
									border:1px solid #aaa;\
									padding:5px;\
									box-sizing:border-box;"
				break;
		};
	};
	
	elem.style.cssText = style;
	if (!elem.style.cssText) {
		elem.style.cssText = defaultStyle;
		throw new StyleError (elem.id);
	};
};

function getStyleFromCSS (selector) {
    for (var i = 0; i < document.styleSheets.length; i++) {
        for (var j = 0; j < document.styleSheets[i].cssRules.length; j++) {
            if (styleSheets[i].cssRules[j].selectorText = selector) {
                var cssText = styleSheets[i].cssRules[j].cssText;
                return cssText.slice (cssText.indexOf("{") + 1, -1);
            };
        };
    };
};