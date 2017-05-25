var Phaser;

var uiWidgets = uiWidgets || {};

/** Group that places new child nodes directly under the previous child.*/
uiWidgets.Column = function (game, context) {
	"use strict";
	Phaser.Group.call(this, game);
    game.add.existing(this);
	
	this.game = game;
    this.context = context;

};

uiWidgets.Column.prototype = Object.create(Phaser.Group.prototype);
uiWidgets.Column.constructor = uiWidgets.Column;

/** Adds a new object into the Column, then aligns it under the previous object. */
uiWidgets.Column.prototype.addNode = function (node) {
	"use strict";
	this.add(node);
	var previousNode = this.children[this.children.length - 2];
	
	if (previousNode !== undefined) {
		node.alignTo(previousNode, Phaser.BOTTOM_CENTER);
	}
};
