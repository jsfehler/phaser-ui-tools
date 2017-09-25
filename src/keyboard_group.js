var uiWidgets = uiWidgets || {};

/** Collection of sprites that can be selected with the keyboard.
  * When the select key is hit, the sprite that was selected is now connected to the keyboard.
  * @constructor
  * @param {Object} game - Current game instance.
  * @param {Boolean} vertical - If the selection should be controlled with up/down or left/right.
  * @param {Object} prevItemCallback - Called when selecting the previous child.
  * @param {Object} nextItemCallback - Called when selecting the next child.
  */
uiWidgets.KeyboardGroup = function (game, vertical, prevItemCallback, nextItemCallback) {
    "use strict";
    this.game = game;
    this.vertical = vertical || false;
    this.prevItemCallback = prevItemCallback;
    this.nextItemCallback = nextItemCallback;

    this.children = [];

    this.selected = null;
    this.idx = 0;

    this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    this.upEvent = this.prevItem;
    this.downEvent = this.nextItem;

    this.activateGroup();

};

uiWidgets.KeyboardGroup.constructor = uiWidgets.KeyboardGroup;

/** Add a new child to the group
  * @param {Object} newNode - The sprite to add to the group.
  */
uiWidgets.KeyboardGroup.prototype.addNode = function (newNode) {
    "use strict";
    this.children.push(newNode);

    // Ensure the first child is already selected  when the game loads.
    this.selected = this.children[0];
    this.useBar();
};

/** Selects the previous child. */
uiWidgets.KeyboardGroup.prototype.prevItem = function () {
    "use strict";
    this.idx = this.idx - 1;

    if (this.idx < 0) {
        this.idx = this.children.length - 1;
    }

    this.selected = this.children[this.idx];

    this.useBar();

    return this.prevItemCallback();
};

/** Selects the next child. */
uiWidgets.KeyboardGroup.prototype.nextItem = function () {
    "use strict";
    this.idx = (this.idx + 1) % (this.children.length);
    this.selected = this.children[this.idx];

    this.useBar();

    return this.nextItemCallback();
};

/** Enables keyboard input for the group. */
uiWidgets.KeyboardGroup.prototype.activateGroup = function () {
    "use strict";
    if (this.vertical) {
        this.upKey.onDown.add(this.upEvent, this);
        this.downKey.onDown.add(this.downEvent, this);
    } else {
        this.leftKey.onDown.add(this.upEvent, this);
        this.rightKey.onDown.add(this.downEvent, this);
    }
};

/** Enables keyboard input on a child. */
uiWidgets.KeyboardGroup.prototype.useBar = function () {
    "use strict";
    if (this.vertical) {
        this.leftKey.onDown.removeAll();
        this.rightKey.onDown.removeAll();

        this.leftKey.onDown.add(this.selected.upEvent, this.selected);
        this.rightKey.onDown.add(this.selected.downEvent, this.selected);
    } else {
        this.upKey.onDown.removeAll();
        this.downKey.onDown.removeAll();

        this.upKey.onDown.add(this.selected.upEvent, this.selected);
        this.downKey.onDown.add(this.selected.downEvent, this.selected);
    }
};
