var uiWidgets;
uiWidgets = uiWidgets || {};

/**
 * Group with a dedicated background image.
 * Children added to the group will always be above the background image.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {Number} x - The x position of the Frame.
 * @param {Number} y - The y position of the Frame.
 * @param {string} bg - The background image to use.
 */
uiWidgets.Frame = function (game, x, y, bg) {
    "use strict";
    Phaser.Group.call(this, game);
    game.add.existing(this);

    this.x = x || 0;
    this.y = y || 0;

    this.game = game;
    this.bg = bg || null;

    // Add background to Frame.
    if (bg !== null) {
        var bgSprite = game.add.sprite(0, 0, bg);
        bgSprite.sendToBack();
        bgSprite.alignIn(this, Phaser.TOP_LEFT);
    }
};

uiWidgets.Frame.prototype = Object.create(Phaser.Group.prototype);
uiWidgets.Frame.constructor = uiWidgets.Frame;

/** Adds a new object into the Column, then aligns it under the previous object.
 * @param {Object} node - The sprite to add to the Column.
 * @param {Number} alignment - The alignment relative to the previous child.
 * @param {Number} padding_x - The amount of horizontal space between objects.
 * @param {Number} padding_y - The amount of vertical space between objects.
 */
uiWidgets.Frame.prototype.addNode = function (node, alignment, padding_x, padding_y) {
    "use strict";
    alignment = alignment || this.alignment;
    padding_x = padding_x || 0;
    padding_y = padding_y || 0;

    this.add(node);
    var previousNode = this.children[this.children.length - 2];

    if (previousNode !== undefined) {
        node.alignTo(previousNode, alignment, padding_x, padding_y);
    }

    // Reset the positions for the bar's draggable area.
    if ("enableBarDrag" in node) {
        node.enableBarDrag();
    }
};
