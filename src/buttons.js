import * as PhaserObjects from './phaserObjects';

/** Sprite with text added as a child.
 * @extends Phaser.Group
 */
export class TextSprite extends PhaserObjects.Group {
    /**
     * @param {Object} game - Current game instance.
     * @param {string} key - The image to create a sprite with.
     * @param {number} x - The x coordinate on screen where the textSprite will be placed.
     * @param {number} y - The y coordinate on screen where the textSprite will be placed.
     */
    constructor(game, x, y, key) {
        super(game);

        this.game = game;
        game.add.existing(this);

        this.sprite = new PhaserObjects.Sprite(game, x, y, key);
        this.add(this.sprite);

        this.width = this.sprite.width;
        this.height = this.sprite.height;
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

        return this;
    }

    setOrigin(x, y) {
        this.sprite.setOrigin(x, y);
        this.text.x = this.sprite.width / 2;
        this.text.y = this.sprite.height / 2;

        return this;
    }
}


/** Phaser Group containing a button with text anchored in the button's center.
 * @extends Phaser.Group
 */
export class TextButton extends PhaserObjects.Group {
    /**
     * @param {Object} game - Current game instance.
     * @param {string} image - The image to create a sprite with.
     * @param {number} x - The x coordinate on screen where the textSprite will be placed.
     * @param {number} y - The y coordinate on screen where the textSprite will be placed.
     * @param {Object} callback - Callback to use when the button is clicked.
     * @param {Object} callbackContext - The context the callback is called in.
     * @param {number} overKey -
     * @param {number} outKey -
     * @param {number} downKey -
     * @param {number} upKey -
     */
    constructor(game, x, y, key, callback, callbackContext, overKey, outKey, downKey, upKey) {
        super(game);

        this.game = game;
        game.add.existing(this);

        this.button = new PhaserObjects.Button(
            game,
            x,
            y,
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

        return this;
    }

    setOrigin(x, y) {
        this.button.setOrigin(x, y);
        this.text.x = this.button.width / 2;
        this.text.y = this.button.height / 2;

        return this;
    }

    /** Adds an adjustment to the text on down/up events. */
    eventTextYAdjustment(number) {
        let upAdjustment;

        const sign = Math.sign(number);

        if (sign === 1) {
            upAdjustment = -Math.abs(number);
        } else if (sign === -1) {
            upAdjustment = Math.abs(number);
        }

        this.button.addDownEvent(() => { this.text.y += number; });
        this.button.addUpEvent(() => { this.text.y += upAdjustment; });

        return this;
    }
}
