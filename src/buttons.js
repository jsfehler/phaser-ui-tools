var Phaser;

var uiWidgets = uiWidgets || {};


/** 
 * Sprite with text on top of it.
 * @constructor
 * @param {Object} game - The game the button is in.
 * @param {string} image - The image to create a sprite with.
 * @param {string} label - The text to place on top of the sprite.
 * @param {number} x - The x coordinate on screen where the textSprite will be placed.
 * @param {number} y - The y coordinate on screen where the textSprite will be placed.
 */
uiWidgets.textSprite = function (game, image, label, x, y) {
    "use strict";
    Phaser.Sprite.call(this, game, x, y, image);
    game.add.existing(this);

    var style = { font: "18px vcr_osd_monoregular", fill: "#fff", align: "center" };
    
    this.text = this.game.add.text(0, 0, label, style);
    this.text.anchor.set(0.5, 0.5);
    
    this.addChild(this.text);
};

uiWidgets.textSprite.prototype = Object.create(Phaser.Sprite.prototype);
uiWidgets.textSprite.constructor = uiWidgets.textSprite;
  

/** 
 * Button with text on top of it. 
 * @constructor
 * @param {Object} game - The game the button is in.
 * @param {string} image - The image to create a sprite with.
 * @param {string} label - The text to place on top of the sprite.
 * @param {number} x - The x coordinate on screen where the textSprite will be placed.
 * @param {number} y - The y coordinate on screen where the textSprite will be placed.
 * @param callback - Callback to use when the button is clicked.
 * @param callbackContext - The context is the callback is called in.
 */
uiWidgets.textButton = function (game, image, label, x, y, callback, callbackContext) {
    "use strict";
    Phaser.Button.call(this, game, x, y, image, callback, callbackContext);
    game.add.existing(this);
       
    var style = { font: "18px vcr_osd_monoregular", fill: "#fff", align: "center" };
    
    this.text = this.game.add.text(0, 0, label, style);
    this.text.anchor.set(0.5, 0.5);
    
    this.addChild(this.text);
};

uiWidgets.textButton.prototype = Object.create(Phaser.Button.prototype);
uiWidgets.textButton.constructor = uiWidgets.textButton;
