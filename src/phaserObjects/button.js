let exportObject;

if (Phaser.Button === undefined) {
    class Phaser3Button extends Phaser.GameObjects.Sprite {}

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
