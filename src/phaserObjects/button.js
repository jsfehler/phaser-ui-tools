import { Sprite } from './sprite';

let exportObject;

if (Phaser.Button === undefined) {
    /** Build a button object that immitates Phaser CE's Button
    * @private
    */
    class Phaser3Button extends Sprite {
        constructor(game, x, y, key, callback, callbackContext, overKey, outKey, downKey, upKey) {
            super(game, x, y, key);

            game.add.existing(this);

            this.game = game;

            this.overKey = overKey;
            this.outKey = outKey;
            this.downKey = downKey;
            this.upKey = upKey;

            this.setInteractive({ useHandCursor: true });

            let cbContext = callbackContext;

            if (cbContext === null || (cbContext === undefined)) {
                cbContext = this;
            }

            this.on('pointerdown', (pointer) => {
                callback.call(cbContext, pointer);
            });
            this.on('pointerover', this.onOver, this);
            this.on('pointerout', this.onOut, this);
            this.on('pointerdown', this.onDown, this);
            this.on('pointerup', this.onUp, this);
        }

        onOver() {
            this.setFrame(this.overKey);
        }

        onOut() {
            this.setFrame(this.outKey);
        }

        onDown() {
            this.setFrame(this.downKey);
        }

        onUp() {
            this.setFrame(this.upKey);
        }

        updateDrag(pointer, gameObject, x, y) { //eslint-disable-line
            if (gameObject.vertical) {
                if ((gameObject.draggableArea.y + gameObject.draggableArea.h) >= y) {
                    if (gameObject.draggableArea.y <= y) {
                        gameObject.y = y; //eslint-disable-line
                    }
                }
            } else {
                const fx = (x + gameObject.displayWidth);
                if ((gameObject.draggableArea.x + gameObject.draggableArea.w) >= fx) {
                    if (gameObject.draggableArea.x <= x) {
                        gameObject.x = x; //eslint-disable-line
                    }
                }
            }
        }

        setDragBounds(draggableArea) {
            this.draggableArea = draggableArea;
        }

        enableDragging(vertical = false) {
            this.setInteractive({ useHandCursor: true });
            this.vertical = vertical;
            this.game.input.setDraggable(this);
            this.game.input.on('drag', this.updateDrag);
        }
    }

    exportObject = Phaser3Button;
} else {
    class PhaserCEButton extends Phaser.Button {
        constructor(game, x, y, key, callback, callbackContext, overKey, outKey, downKey, upKey) {
            super(game, x, y, key, callback, callbackContext, overKey, outKey, downKey, upKey);

            game.add.existing(this);
        }

        setInteractive() {
            this.inputEnabled = true;
            this.input.useHandCursor = true;
        }

        disableInteractive() {
            this.inputEnabled = false;
        }

        setDragBounds(draggableArea) {
            this.input.boundsRect = new Phaser.Rectangle(
                draggableArea.x,
                draggableArea.y,
                draggableArea.w,
                draggableArea.h,
            );
        }

        enableDragging(vertical = false) {
            this.inputEnabled = true;
            this.input.enableDrag();

            if (vertical) {
                this.input.allowHorizontalDrag = false;
            } else {
                this.input.allowVerticalDrag = false;
            }
        }

        /**
        * @private
        * Add a callback that is triggered when the pointer moves out of the object.
        */
        addOutEvent(callback, callbackContext) {
            this.events.onInputOut.add(callback, callbackContext);
        }

        /**
        * @private
        * Add a callback that is triggered when the object is unclicked.
        */
        addUpEvent(callback, callbackContext) {
            this.events.onInputUp.add(callback, callbackContext);
        }

        /**
        * @private
        * Add a callback that is triggered when the object is clicked.
        */
        addDownEvent(callback, callbackContext) {
            this.events.onInputDown.add(callback, callbackContext);
        }

        /**
        * @private
        * Add a callback that is triggered when the object is dragged.
        */
        addDragEvent(callback, callbackContext) {
            this.events.onDragUpdate.add(callback, callbackContext);
        }

        /** Immitate the API of Phaser3.
        * The current displayed height of the Object.
        * @type {number}
        * @private
        */
        get displayHeight() {
            return this.height;
        }

        set displayHeight(newValue) {
            this.height = newValue;
        }

        /** Immitate the API of Phaser3.
        * The current displayed width of the Object.
        * @type {number}
        * @private
        */
        get displayWidth() {
            return this.width;
        }

        set displayWidth(newValue) {
            this.width = newValue;
        }
    }

    exportObject = PhaserCEButton;
}

export const Button = exportObject;
