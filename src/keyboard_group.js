/** Collection of sprites that can be selected with the keyboard.
  * When the select key is hit, the sprite that was selected is now connected to the keyboard.
  */
export class KeyboardGroup {
    /**
      * @param {Object} game - Current game instance.
      * @param {Boolean} vertical - If the selection should be controlled with up/down or left/right arrow keys.
      * @param {Object} callbackContext - The context for the onPrevious and onNext Signals.
      */
    constructor(game, vertical, callbackContext) {
        this.game = game;
        this.vertical = vertical || false;
        this.callbackContext = callbackContext;

        this.children = [];

        this.selected = null;
        this.idx = 0;

        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        this.upEvent = this.prevItem;
        this.downEvent = this.nextItem;

        /**
         * Dispatched when the selected child is set from the current child to the previous child.
         * @property {Phaser.Signal}
         */
        this.onPrevious = new Phaser.Signal();

        /**
         * Dispatched when the selected child is set from the current child to the next child.
         * @property {Phaser.Signal}
         */
        this.onNext = new Phaser.Signal();

        this.activateGroup();
    }

    /** Add a new child to the group
      * @param {Object} newNode - The sprite to add to the group.
      */
    addNode(newNode) {
        this.children.push(newNode);

        // Ensure the first child is already selected  when the game loads.
        this.selected = this.children[0]; // eslint-disable-line prefer-destructuring
        this.useBar();
    }

    /** Selects the previous child. */
    prevItem() {
        this.idx = this.idx - 1;

        if (this.idx < 0) {
            this.idx = this.children.length - 1;
        }

        this.selected = this.children[this.idx];

        this.useBar();

        this.onPrevious.dispatch(this, this.callbackContext);
    }

    /** Selects the next child. */
    nextItem() {
        this.idx = (this.idx + 1) % (this.children.length);
        this.selected = this.children[this.idx];

        this.useBar();

        this.onNext.dispatch(this, this.callbackContext);
    }

    /**
     * Enables keyboard input for the group.
     * @private
     */
    activateGroup() {
        if (this.vertical) {
            this.upKey.onDown.add(this.upEvent, this);
            this.downKey.onDown.add(this.downEvent, this);
        } else {
            this.leftKey.onDown.add(this.upEvent, this);
            this.rightKey.onDown.add(this.downEvent, this);
        }
    }

    /**
     * Enables keyboard input on a child.
     * @private
     */
    useBar() {
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
    }
}
