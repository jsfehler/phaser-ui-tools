var uiWidgets = uiWidgets || {};

/**
 * Group with a dedicated background image.
 * Children added to the group will always be above the background image.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {Object} context - The context this object is called in.
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

/** Adds a new object to the Frame.
 * @param {Object} node - The sprite to add to the Frame.
 */
uiWidgets.Frame.prototype.addNode = function (node) {
    "use strict";
    this.add(node);

    // Reset the positions for the bar's draggable area.
    if ("enableBarDrag" in node) {
        node.enableBarDrag();
    }

};
