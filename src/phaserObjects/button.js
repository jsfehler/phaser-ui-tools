let exportObject;

if (Phaser.Button === undefined) {
    /** Build a button object that immitates Phaser CE's Button
    * @private
    */
    class Phaser3Button extends Phaser.GameObjects.Sprite {
        constructor(game, x, y, key, callback, callbackContext, overKey, outKey) {
            super(game, x, y, key);

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
    }

    exportObject = Phaser3Button;
} else {
    class PhaserCEButton extends Phaser.Button {
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
