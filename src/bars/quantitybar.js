import { Bar } from './bar';

import { QuantityRange } from './ranges';

import * as PhaserObjects from '../phaserObjects';

/**
  * Bar that adjusts the size of a static sprite based on a value.
  * This is done by masking the sprite and then resizing the mask.
  * @extends Bar
  */
export class QuantityBar extends Bar {
    /**
     * @param {Object} game - Current game instance.
     * @param {Object} xy -  Dictionary with the values for the bar's x and y position.
     * @param {Object} values - The numerical values for the bar.
     * @param {boolean} vertical - Determines if the bar should be vertical or horizontal.
     * @param {boolean} reverse - Determines the direction the bar moves when adjusted.
     * @param {string} trackImage - The image key to use for the track.
     * @param {string} barImage - The image key to use for the bar. Will automatically resize to fit.
     * @param {Object} tweenParams - Object with duration and easing function for the scrolling tween.
     */
    constructor(game, xy, values, vertical, reverse, trackImage, barImage, tweenParams) {
        super(game, xy.x, xy.y);

        this.valueRange = new QuantityRange(
            this,
            values.startValue,
            values.maxValue,
        );

        this.vertical = vertical || false;
        this.reverse = reverse || false;

        this.trackImage = trackImage;
        this.barImage = barImage;

        this.tweenParams = tweenParams || { duration: 300, ease: PhaserObjects.Easing.Quadratic.Out };

        // The track is the static area the bar will move along.
        this.track = this.game.add.sprite(0, 0, this.trackImage);
        this.add(this.track);

        // The bar is a static image taking up the width of the track.
        this.bar = new PhaserObjects.Button(
            game,
            0,
            0,
            this.barImage,
            this.moveContent,
            this,
            1,
            0,
        );
        this.add(this.bar);

        this.create();
    }

    /**
     * @private
     * Sets the bar's mask.
     */
    setMask() {
        if (this.bar.mask !== null) {
            this.bar.mask.destroy();
            this.bar.mask = null;
        }

        const mask = new PhaserObjects.ViewportMask(this.game, this.maskX, this.maskY);
        this.bar.mask = mask.create(0, 0, this.maskW, this.maskH);

        this.add(mask);
    }

    getBarPosition() {
        const windowPositionRatio = this.valueRange.getRatio() / this.windowScrollAreaSize;
        return this.trackScrollAreaSize * windowPositionRatio;
    }

    create() {
        this.centerStaticAxis();

        // Values for the bar's mask.
        this.maskW = this.bar.width;
        this.maskH = this.bar.height;
        this.maskX = this.bar.x;
        this.maskY = this.bar.y;

        // Resizes the bar.
        if (this.vertical) {
            this.maskH = this.getBarSize();
        } else {
            this.maskW = this.getBarSize();
        }

        if (this.reverse) {
            if (this.vertical) {
                this.maskY = this.getBarFraction();
            } else {
                this.maskX = this.getBarFraction();
            }
        }

        this.setMask();

        // Determine the distance the window can scroll over
        this.windowScrollAreaSize = this.valueRange.maxValue;

        // Represents one fraction of the track.
        this.vslice = (this.track.height * this.valueRange.getRatio());
        this.hslice = (this.track.width * this.valueRange.getRatio());

        this.setTrackScrollAreaSize();
    }

    /**
     * @private
     * Creates the tween for adjusting the size of the mask.
     * @param {Object} properties - Values for the tween's movement.
     */
    addScrollTweenMask(properties) {
        this.game.add.tween(this.bar.mask).to(
            properties,
            this.tweenParams.duration,
            this.tweenParams.ease,
            true,
        );
    }

    /**
     * @private
     * Adjusts the bar by a given value.
     * @param {number} newValue - The value to adjust the bar by.
     */
    adjustBar(newValue) {
        this.valueRange.currentValue += newValue;

        let tween;
        const barSize = this.getBarSize();

        if (this.reverse) {
            if (this.vertical) {
                tween = { height: barSize, y: this.getBarFraction() };
            } else {
                tween = { width: barSize, x: this.getBarFraction() };
            }
        } else {
            if (this.vertical) {
                tween = { height: barSize };
            } else {
                tween = { width: barSize };
            }
        }

        this.addScrollTweenMask(tween);
    }

    getBarFraction() {
        let fraction;
        if (this.vertical) {
            fraction = this.track.height * this.valueRange.getRatio();
        } else {
            fraction = this.track.width * this.valueRange.getRatio();
        }

        return fraction;
    }

    /**
     * @private
     * Given a ratio between total content size and viewport size,
     * return an appropriate percentage of the track.
     */
    getBarSize() {
        let barSize;
        if (this.reverse) {
            if (this.vertical) {
                barSize = this.track.height - this.valueRange.getRatio();
            } else {
                barSize = this.track.width - this.valueRange.getRatio();
            }
        } else {
            barSize = this.getBarFraction();
        }

        return barSize;
    }
}
