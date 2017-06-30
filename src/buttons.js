var Phaser;

var uiWidgets = uiWidgets || {};


/**
 * Sprite with text added as a child.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {string} image - The image to create a sprite with.
 * @param {string} label - The text to place on top of the sprite.
 * @param {Object} style - The style properties to be set on the Text.
 * @param {number} x - The x coordinate on screen where the textSprite will be placed.
 * @param {number} y - The y coordinate on screen where the textSprite will be placed.
 */
uiWidgets.textSprite = function (game, image, label, style, x, y) {
    "use strict";
    Phaser.Sprite.call(this, game, x, y, image);
    game.add.existing(this);

    this.text = this.game.add.text(0, 0, label, style);
    this.text.anchor.set(0.5, 0.5);

    this.addChild(this.text);
};

uiWidgets.textSprite.prototype = Object.create(Phaser.Sprite.prototype);
uiWidgets.textSprite.constructor = uiWidgets.textSprite;


/**
 * Phaser Button with text added as a child.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {string} image - The image to create a sprite with.
 * @param {string} label - The text to place on top of the sprite.
 * @param {Object} style - The style properties to be set on the Text.
 * @param {number} x - The x coordinate on screen where the textSprite will be placed.
 * @param {number} y - The y coordinate on screen where the textSprite will be placed.
 * @param {Object} callback - Callback to use when the button is clicked.
 * @param {Object} callbackContext - The context the callback is called in.
 */
uiWidgets.textButton = function (game, image, label, style, x, y, callback, callbackContext) {
    "use strict";
    Phaser.Button.call(this, game, x, y, image, callback, callbackContext);
    game.add.existing(this);

    this.text = this.game.add.text(0, 0, label, style);
    this.text.anchor.set(0.5, 0.5);

    this.addChild(this.text);
};

uiWidgets.textButton.prototype = Object.create(Phaser.Button.prototype);
uiWidgets.textButton.constructor = uiWidgets.textButton;
