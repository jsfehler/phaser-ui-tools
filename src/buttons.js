import * as PhaserObjects from './phaserObjects';

/** Group with some added functionality for text overlays.
 * @private
 * @extends Phaser.Group
 */
class TextGroup extends PhaserObjects.Group {
    /**
     * @param {Object} game - Current game instance.
     * @param {number} x - The x coordinate on screen where the sprite will be placed.
     * @param {number} y - The y coordinate on screen where the sprite will be placed.
     */
    constructor(game, x, y) {
        super(game, x, y);

        this.game = game;
        this.x = x;
        this.y = y;

        game.add.existing(this);
    }

    /**
     * @param {string} label - The text to place on top of the sprite.
     * @param {Object} style - The style properties to be set on the Text.
     */
    setText(label, style) {
        if (this.text) {
            this.text.destroy();
        }

        if (this.version === 3) {
            this.text = this.game.add.text(0, 0, label, style);
            this.text.setOrigin(0.5, 0.5);
        } else {
            this.text = this.game.add.text(this.width / 2, this.height / 2, label, style);
            this.text.anchor.set(0.5, 0.5);
        }

        this.add(this.text);

        this.text.wordWrap = true;
        this.text.wordWrapWidth = this.width;

        return this;
    }

    /** When setOrigin is called, align the text as well. */
    setOrigin(x, y) {
        this.sprite.setOrigin(x, y);
        this.text.x = this.sprite.width / 2;
        this.text.y = this.sprite.height / 2;

        return this;
    }
}

/** Sprite with text added as a child.
 * @extends Phaser.Group
 */
export class TextSprite extends TextGroup {
    /**
     * @param {Object} game - Current game instance.
     * @param {number} x - The x coordinate on screen where the textSprite will be placed.
     * @param {number} y - The y coordinate on screen where the textSprite will be placed.
     * @param {string} key - The image to create a sprite with.
     */
    constructor(game, x, y, key) {
        super(game, x, y);

        this.sprite = new PhaserObjects.Sprite(game, 0, 0, key);
        this.add(this.sprite);

        this.width = this.sprite.width;
        this.height = this.sprite.height;
    }
}

/** Phaser Group containing a button with text anchored in the button's center.
 * @extends Phaser.Group
 */
export class TextButton extends TextGroup {
    /**
     * @param {Object} game - Current game instance.
     * @param {number} x - The x coordinate on screen where the textSprite will be placed.
     * @param {number} y - The y coordinate on screen where the textSprite will be placed.
     * @param {string} key - The image to create a sprite with.
     * @param {Object} callback - Callback to use when the button is clicked.
     * @param {Object} callbackContext - The context the callback is called in.
     * @param {number} overKey - The frame to switch to when an over event is triggered.
     * @param {number} outKey - The frame to switch to when an out event is triggered.
     * @param {number} downKey - The frame to switch to when a down event is triggered.
     * @param {number} upKey - The frame to switch to when an up event is triggered.
     */
    constructor(game, x, y, key, callback, callbackContext, overKey, outKey, downKey, upKey) {
        super(game, x, y);

        this.button = new PhaserObjects.Button(
            game,
            0,
            0,
            key,
            callback,
            callbackContext,
            overKey,
            outKey,
            downKey,
            upKey,
        );
        this.add(this.button);

        this.width = this.button.width;
        this.height = this.button.height;
    }

    /** Adds an adjustment to the text on down/up events. */
    eventTextYAdjustment(number) {
        const startY = this.text.y;

        this.button.addDownEvent(() => { this.text.y += number; });
        this.button.addUpEvent(() => { this.text.y = startY; });

        // A pointerout event should reset the text position too.
        this.button.addOutEvent(() => { this.text.y = startY; });

        return this;
    }
}
