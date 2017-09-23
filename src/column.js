var uiWidgets = uiWidgets || {};

/**
 * Group that places new child nodes directly under the previous child.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {Object} context - The context this object is called in.
 */
uiWidgets.Column = function (game, x, y, context, bg) {
    "use strict";
    Phaser.Group.call(this, game);
    game.add.existing(this);

    this.x = x;
    this.y = y;

    this.game = game;
    this.context = context;
    this.bg = bg || null;

    if (bg !== null) {
        var bgSprite = game.add.sprite(0, 0, bg);
        bgSprite.sendToBack();
        bgSprite.alignIn(this, Phaser.TOP_LEFT);
    }
};

uiWidgets.Column.prototype = Object.create(Phaser.Group.prototype);
uiWidgets.Column.constructor = uiWidgets.Column;

/** Adds a new object into the Column, then aligns it under the previous object.
 * @param {Object} node - The sprite to add to the column.
 * @param {Number} alignment - The alignment relative to the previous child.
 */
uiWidgets.Column.prototype.addNode = function (node, alignment) {
    "use strict";
    alignment = alignment || Phaser.BOTTOM_CENTER;

    this.add(node);
    var previousNode = this.children[this.children.length - 2];

    if (previousNode !== undefined) {
        node.alignTo(previousNode, alignment);
    }

    // Reset the positions for the bar's draggable area.
    if (node.constructor.name === "ValueBar" || node.constructor.name === "Scrollbar") {
        node.enableBarDrag();
    }

};
