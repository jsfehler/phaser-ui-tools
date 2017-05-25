var Phaser;

var uiWidgets = uiWidgets || {};


/** A container for other objects with a limited viewable area. */
uiWidgets.Viewport = function (game, x, y, width, height) {
    "use strict";
    Phaser.Group.call(this, game);
    game.add.existing(this);

	this.x = x;
	this.y = y;

	// Viewport size and position, distinct from the total window size.
	this.area = {
		"x": x,
		"y": y,
		"width": width,
		"height": height
	};

	// Adding the mask attribute to a group hides objects outside the mask.
	this.mask = this.game.add.graphics(this.area.x, this.area.y);
	this.mask.beginFill(0x0000ff);
	this.mask.drawRect(0, 0, width, height);
	this.mask.endFill();
};

uiWidgets.Viewport.prototype = Object.create(Phaser.Group.prototype);
uiWidgets.Viewport.constructor = uiWidgets.Viewport;

uiWidgets.Viewport.prototype.addNode = function (node) {
	"use strict";
	this.add(node);
};
