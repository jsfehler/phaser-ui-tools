var uiWidgets = uiWidgets || {};

/** Collection of sprites that can be selected with the keyboard.
  * When the select key is hit, the sprite that was selected is now connected to the keyboard.
  * @constructor
  * @param {Object} game - Current game instance.
  * @param {Object} prevItemCallback - Called when selecting the previous child.
  * @param {Object} nextItemCallback - Called when selecting the next child.
  */
uiWidgets.KeyboardGroup = function (game, prevItemCallback, nextItemCallback) {
    "use strict";
    this.game = game;

    this.children = [];

    this.selected = null;
    this.idx = 0;
    this.onBar = false;

    this.prevItemCallback = prevItemCallback;
    this.nextItemCallback = nextItemCallback;

    this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.selectKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    this.selectKey.onDown.add(this.selectBar, this);

    this.activateGroup();
};

uiWidgets.KeyboardGroup.constructor = uiWidgets.KeyboardGroup;

/** Add a new child to the group */
uiWidgets.KeyboardGroup.prototype.addNode = function (newNode) {
    "use strict";
    this.children.push(newNode);
};

/** Selects the previous child. */
uiWidgets.KeyboardGroup.prototype.prevItem = function () {
    "use strict";
    this.idx = this.idx - 1;

    if (this.idx < 0) {
        this.idx = this.children.length - 1;
    }

    this.selected = this.children[this.idx];

    return this.prevItemCallback();
};

/** Selects the next child. */
uiWidgets.KeyboardGroup.prototype.nextItem = function () {
    "use strict";
    this.idx = (this.idx + 1) % (this.children.length);
    this.selected = this.children[this.idx];

    return this.nextItemCallback();
};

/** Adds or removes focus from the selected child. */
uiWidgets.KeyboardGroup.prototype.selectBar = function () {
    "use strict";
    this.removeKeyboardEventListeners();

    if (this.onBar === false) {
        this.activateBar();
        this.onBar = true;
    } else {
        this.activateGroup();
        this.onBar = false;
    }
};

/** Used when switching from group selection to Bar manipulation. */
uiWidgets.KeyboardGroup.prototype.removeKeyboardEventListeners = function () {
    "use strict";
    this.upKey.onDown.removeAll();
    this.downKey.onDown.removeAll();
    this.leftKey.onDown.removeAll();
    this.rightKey.onDown.removeAll();
};

/** Enables keyboard input for the group. */
uiWidgets.KeyboardGroup.prototype.activateGroup = function () {
    "use strict";
    this.upEvent = this.prevItem;
    this.upKey.onDown.add(this.upEvent, this);

    this.downEvent = this.nextItem;
    this.downKey.onDown.add(this.downEvent, this);

    this.leftEvent = this.leftKey.onDown.add(this.upEvent, this);
    this.rightEvent = this.rightKey.onDown.add(this.downEvent, this);

};

/** Enables keyboard input on a Bar. */
uiWidgets.KeyboardGroup.prototype.activateBar = function () {
    "use strict";
    if (this.selected.vertical) {
        this.upEvent = this.selected.scrollUp;
        this.downEvent = this.selected.scrollDown;
        this.leftEvent = this.selected.scrollUp;
        this.rightEvent = this.selected.scrollDown;
    } else {
        this.upEvent = this.selected.scrollLeft;
        this.downEvent = this.selected.scrollRight;
        this.leftEvent = this.selected.scrollLeft;
        this.rightEvent = this.selected.scrollRight;
    }

    this.upKey.onDown.add(this.upEvent, this.selected);
    this.downKey.onDown.add(this.downEvent, this.selected);
    this.leftKey.onDown.add(this.leftEvent, this.selected);
    this.rightKey.onDown.add(this.rightEvent, this.selected);
};
