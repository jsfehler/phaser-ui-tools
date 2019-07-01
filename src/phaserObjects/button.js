import { Sprite } from './sprite';

let exportObject;

if (Phaser.Button === undefined) {
    /** Build a button object that immitates Phaser CE's Button
    * @private
    */
    class Phaser3Button extends Sprite {
        constructor(game, x, y, key, callback, callbackContext, overKey, outKey) {
            super(game, x, y, key);

            game.add.existing(this);

            this.game = game;

            this.overKey = overKey;
            this.outKey = outKey;

            this.setInteractive();

            this.on('pointerdown', callback, callbackContext);
            this.on('pointerover', this.onOver, this);
            this.on('pointerout', this.onOut, this);
        }

        onOver() {
            this.setFrame(this.overKey);
        }

        onOut() {
            this.setFrame(this.outKey);
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
            this.setInteractive();
            this.vertical = vertical;
            this.game.input.setDraggable(this);
            this.game.input.on('drag', this.updateDrag);
        }
    }

    exportObject = Phaser3Button;
} else {
    class PhaserCEButton extends Phaser.Button {
        setInteractive() {
            this.inputEnabled = true;
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
