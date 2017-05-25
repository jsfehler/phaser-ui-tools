var Phaser;

var uiWidgets = uiWidgets || {};


/** Sprite with text on top of it. */
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
  

/** Button with text on top of it. */
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
