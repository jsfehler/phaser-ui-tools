var uiWidgets = uiWidgets || {};

/**
 * Group that places new child nodes directly next to the previous child.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {Object} context - The context this object is called in.
 */
uiWidgets.Row = function (game, x, y, context) {
    "use strict";
    Phaser.Group.call(this, game);
    game.add.existing(this);

    this.x = x;
    this.y = y;

    this.game = game;
    this.context = context;
};

uiWidgets.Row.prototype = Object.create(Phaser.Group.prototype);
uiWidgets.Row.constructor = uiWidgets.Row;

/** Adds a new object into the Row, then aligns it next to the previous object.
 * @param {Object} node - The sprite to add to the row.
 * @param {Number} alignment - The alignment relative to the previous child.
 */
uiWidgets.Row.prototype.addNode = function (node, alignment) {
    "use strict";
    alignment = alignment || Phaser.RIGHT_CENTER;

    this.add(node);
    var previousNode = this.children[this.children.length - 2];

    if (previousNode !== undefined) {
        node.alignTo(previousNode, alignment);
    }
};
