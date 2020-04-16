import * as EventEmitter from 'eventemitter3';
import * as PhaserObjects from './phaserObjects';

import { utils } from './utils';

/** Collection of sprites that can be selected with the keyboard.
  * When the select key is hit, the sprite that was selected is now connected to the keyboard.
  */
export class KeyboardGroup {
    /**
      * @param {Object} game - Current game instance.
      * @param {Boolean} vertical - If the selection should be controlled with up/down or left/right arrow keys.
      * @param {Object} callbackContext - The context for the previous and next Events.
      */
    constructor(game, vertical, callbackContext) {
        this.game = game;
        this.vertical = vertical || false;
        this.callbackContext = callbackContext;

        this.children = [];

        this.selected = null;
        this.idx = 0;

        this.upKey = this.game.input.keyboard.addKey(PhaserObjects.KeyCodes.UP);
        this.downKey = this.game.input.keyboard.addKey(PhaserObjects.KeyCodes.DOWN);
        this.leftKey = this.game.input.keyboard.addKey(PhaserObjects.KeyCodes.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(PhaserObjects.KeyCodes.RIGHT);

        this.upEvent = this.prevItem;
        this.downEvent = this.nextItem;

        this.emitter = new EventEmitter();

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
        this.idx = utils.modulo(this.idx - 1, this.children.length);

        this.selected = this.children[this.idx];

        this.useBar();

        this.emitter.emit('previous', this, this.callbackContext);
    }

    /** Selects the next child. */
    nextItem() {
        this.idx = utils.modulo(this.idx + 1, this.children.length);

        this.selected = this.children[this.idx];

        this.useBar();

        this.emitter.emit('next', this, this.callbackContext);
    }

    /**
     * Enables keyboard input for the group.
     * @private
     */
    activateGroup() {
        const keyboard = new PhaserObjects.Keyboard();

        if (this.vertical) {
            keyboard.addDownEvent(this.upKey, this.upEvent, this);
            keyboard.addDownEvent(this.downKey, this.downEvent, this);
        } else {
            keyboard.addDownEvent(this.leftKey, this.upEvent, this);
            keyboard.addDownEvent(this.rightKey, this.downEvent, this);
        }
    }

    /**
     * Enables keyboard input on a child.
     * @private
     */
    useBar() {
        const keyboard = new PhaserObjects.Keyboard();

        if (this.vertical) {
            keyboard.removeDownEvent(this.leftKey);
            keyboard.removeDownEvent(this.rightKey);

            keyboard.addDownEvent(this.leftKey, this.selected.upEvent, this.selected);
            keyboard.addDownEvent(this.rightKey, this.selected.downEvent, this.selected);
        } else {
            keyboard.removeDownEvent(this.upKey);
            keyboard.removeDownEvent(this.downKey);

            keyboard.addDownEvent(this.upKey, this.selected.upEvent, this.selected);
            keyboard.addDownEvent(this.downKey, this.selected.downEvent, this.selected);
        }
    }
}
