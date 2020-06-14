let exportObject;

if (Phaser.Sprite === undefined) {
    class Phaser3Sprite extends Phaser.GameObjects.Sprite {
        constructor(game, x, y, image) {
            super(game, x, y, image);

            game.add.existing(this);

            // Map alignment constants to Phaser 3 Align functions
            const alignIn = Phaser.Display.Align.In;
            this.alignInMapping = {
                0: alignIn.TopLeft,
                1: alignIn.TopCenter,
                2: alignIn.TopRight,
                3: alignIn.LeftTop,
                4: alignIn.LeftCenter,
                5: alignIn.LeftBottom,
                6: alignIn.Center,
                7: alignIn.RightTop,
                8: alignIn.RightCenter,
                9: alignIn.RightBottom,
                10: alignIn.BottomLeft,
                11: alignIn.BottomCenter,
                12: alignIn.BottomRight,
            };
        }

        get maskX() {
            return this.x;
        }

        get maskY() {
            return this.y;
        }

        /** Immitate the API of PhaserCE.
        * Move this object behind all others.
        * @private
        */
        sendToBack() {
            this.depth = -9999;
        }

        /** Immitate the API of PhaserCE.
        * Move this object down the depth order by 1.
        * @private
        */
        moveDown() {
            this.depth -= 1;
        }

        /** Immitate the API of PhaserCE.
        * Align this object in another.
        * @private
        */
        alignIn(other, align) {
            this.alignInMapping[align](this, other, other.width);
        }

        /**
        * @private
        * Add a callback that is triggered when the pointer moves out of the object.
        */
        addOutEvent(callback, callbackContext) {
            this.on('pointerout', (pointer) => {
                callback.call(callbackContext, pointer);
            });
        }

        /**
        * @private
        * Add a callback that is triggered when the object is unclicked.
        */
        addUpEvent(callback, callbackContext) {
            this.on('pointerup', (pointer) => {
                callback.call(callbackContext, pointer);
            });
        }

        /**
        * @private
        * Add a callback that is triggered when the object is clicked.
        */
        addDownEvent(callback, callbackContext) {
            this.on('pointerdown', (pointer) => {
                callback.call(callbackContext, pointer);
            });
        }

        /**
        * @private
        * Add a callback that is triggered when the object is dragged.
        */
        addDragEvent(callback, callbackContext) {
            this.on('drag', () => { callback.call(callbackContext); });
        }
    }

    exportObject = Phaser3Sprite;
} else {
    class PhaserCESprite extends Phaser.Sprite {
        constructor(game, x, y, key) {
            super(game, x, y, key);

            game.add.existing(this);
        }

        setOrigin(x, y) {
            this.anchor = new Phaser.Point(x, y);
        }

        get maskX() { //eslint-disable-line
            return 0;
        }

        get maskY() { //eslint-disable-line
            return 0;
        }

        setInteractive() {
            this.inputEnabled = true;
        }

        disableInteractive() {
            this.inputEnabled = false;
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

    exportObject = PhaserCESprite;
}

export const Sprite = exportObject;
