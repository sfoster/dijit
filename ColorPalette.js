define([
	"require",		// require.toUrl
	"dojo/_base/kernel",
	".",
	"dojo/text!./templates/ColorPalette.html",
	"./_Widget",
	"./_TemplatedMixin",
	"dojo/colors",
	"dojo/i18n", // dojo.i18n.getLocalization
	"./_PaletteMixin",
	"dojo/i18n!dojo/nls/colors",
	"dojo/_base/Color", // dojo.Color dojo.Color.named
	"dojo/_base/declare", // dojo.declare
	"dojo/_base/html", // dojo.hasClass dojo.place
	"dojo/_base/window", // dojo.body
	"dojo/string" // dojo.string.substitute
], function(require, dojo, dijit, template){

// module:
//		dijit/ColorPalette
// summary:
//		A keyboard accessible color-picking widget

dojo.declare("dijit.ColorPalette", [dijit._Widget, dijit._TemplatedMixin, dijit._PaletteMixin], {
	// summary:
	//		A keyboard accessible color-picking widget
	// description:
	//		Grid showing various colors, so the user can pick a certain color.
	//		Can be used standalone, or as a popup.
	//
	// example:
	// |	<div dojoType="dijit.ColorPalette"></div>
	//
	// example:
	// |	var picker = new dijit.ColorPalette({ },srcNode);
	// |	picker.startup();


	// palette: [const] String
	//		Size of grid, either "7x10" or "3x4".
	palette: "7x10",

	// _palettes: [protected] Map
	// 		This represents the value of the colors.
	//		The first level is a hashmap of the different palettes available.
	//		The next two dimensions represent the columns and rows of colors.
	_palettes: {
		"7x10":	[["white", "seashell", "cornsilk", "lemonchiffon","lightyellow", "palegreen", "paleturquoise", "lightcyan",	"lavender", "plum"],
				["lightgray", "pink", "bisque", "moccasin", "khaki", "lightgreen", "lightseagreen", "lightskyblue", "cornflowerblue", "violet"],
				["silver", "lightcoral", "sandybrown", "orange", "palegoldenrod", "chartreuse", "mediumturquoise", 	"skyblue", "mediumslateblue","orchid"],
				["gray", "red", "orangered", "darkorange", "yellow", "limegreen", 	"darkseagreen", "royalblue", "slateblue", "mediumorchid"],
				["dimgray", "crimson", 	"chocolate", "coral", "gold", "forestgreen", "seagreen", "blue", "blueviolet", "darkorchid"],
				["darkslategray","firebrick","saddlebrown", "sienna", "olive", "green", "darkcyan", "mediumblue","darkslateblue", "darkmagenta" ],
				["black", "darkred", "maroon", "brown", "darkolivegreen", "darkgreen", "midnightblue", "navy", "indigo", 	"purple"]],

		"3x4": [["white", "lime", "green", "blue"],
			["silver", "yellow", "fuchsia", "navy"],
			["gray", "red", "purple", "black"]]
	},

	// templateString: String
	//		The template of this widget.
	templateString: template,

	baseClass: "dijitColorPalette",

	_dyeFactory: function(value){
		// Overrides _PaletteMixin._dyeFactory().
		return new this._dyeClass(value);
	},

	buildRendering: function(){
		// Instantiate the template, which makes a skeleton into which we'll insert a bunch of
		// <img> nodes
		this.inherited(arguments);

		//	Creates customized constructor for dye class (color of a single cell) for
		//	specified palette and high-contrast vs. normal mode.   Used in _getDye().
		this._dyeClass = dojo.declare(dijit._Color, {
			hc: dojo.hasClass(dojo.body(), "dijit_a11y"),
			palette: this.palette
		});

		// Creates <img> nodes in each cell of the template.
		this._preparePalette(
			this._palettes[this.palette],
			dojo.i18n.getLocalization("dojo", "colors", this.lang));
	}
});

dojo.declare("dijit._Color", dojo.Color, {
	// summary:
	//		Object associated with each cell in a ColorPalette palette.
	//		Implements dijit.Dye.

	// Template for each cell in normal (non-high-contrast mode).  Each cell contains a wrapper
	// node for showing the border (called dijitPaletteImg for back-compat), and dijitColorPaletteSwatch
	// for showing the color.
	template:
		"<span class='dijitInline dijitPaletteImg'>" +
			"<img src='${blankGif}' alt='${alt}' class='dijitColorPaletteSwatch' style='background-color: ${color}'/>" +
		"</span>",

	// Template for each cell in high contrast mode.  Each cell contains an image with the whole palette,
	// but scrolled and clipped to show the correct color only
	hcTemplate:
		"<span class='dijitInline dijitPaletteImg' style='position: relative; overflow: hidden; height: 12px; width: 14px;'>" +
			"<img src='${image}' alt='${alt}' style='position: absolute; left: ${left}px; top: ${top}px; ${size}'/>" +
		"</span>",

	// _imagePaths: [protected] Map
	//		This is stores the path to the palette images used for high-contrast mode display
	_imagePaths: {
		"7x10": require.toUrl("./themes/a11y/colors7x10.png"),
		"3x4": require.toUrl("./themes/a11y/colors3x4.png")
	},

	constructor: function(/*String*/alias, /*Number*/ row, /*Number*/ col){
		this._alias = alias;
		this._row = row;
		this._col = col;
		this.setColor(dojo.Color.named[alias]);
	},

	getValue: function(){
		// summary:
		//		Note that although dijit._Color is initialized with a value like "white" getValue() always
		//		returns a hex value
		return this.toHex();
	},

	fillCell: function(/*DOMNode*/ cell, /*String*/ blankGif){
		var html = dojo.string.substitute(this.hc ? this.hcTemplate : this.template, {
			// substitution variables for normal mode
			color: this.toHex(),
			blankGif: blankGif,
			alt: this._alias,

			// variables used for high contrast mode
			image: this._imagePaths[this.palette].toString(),
			left: this._col * -20 - 5,
			top: this._row * -20 - 5,
			size: this.palette == "7x10" ? "height: 145px; width: 206px" : "height: 64px; width: 86px"
		});

		dojo.place(html, cell);
	}
});


return dijit.ColorPalette;
});
