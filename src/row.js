var Phaser;

var uiWidgets = uiWidgets || {};

/** Group that places new child nodes directly next to the previous child.*/
uiWidgets.Row = function (game, context) {
	"use strict";
	Phaser.Group.call(this, game);
    game.add.existing(this);
	
	this.game = game;
    this.context = context;

};

uiWidgets.Row.prototype = Object.create(Phaser.Group.prototype);
uiWidgets.Row.constructor = uiWidgets.Row;

/** Adds a new object into the Row, then aligns it next to the previous object. */
uiWidgets.Row.prototype.addNode = function (node) {
	"use strict";
	this.add(node);
	var previousNode = this.children[this.children.length - 2];
	
	if (previousNode !== undefined) {
		node.alignTo(previousNode, Phaser.RIGHT_CENTER);
	}
};
