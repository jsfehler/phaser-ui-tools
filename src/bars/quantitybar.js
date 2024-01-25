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
     * @param {string} trackKey - The key to use for the track.
     * @param {string} barKey - The key to use for the bar.
     * @param {Object} tweenParams - Object with duration and easing function for the scrolling tween.
     */
    constructor(
        game,
        xy,
        values,
        vertical = false,
        reverse = false,
        trackKey = '',
        barKey = '',
        tweenParams = null,
    ) {
        super(game, xy.x, xy.y, vertical, trackKey, barKey);

        this.uiWidgetsObjectRole = 'quantitybar';

        this.valueRange = new QuantityRange(
            this,
            values.startValue,
            values.maxValue,
        );

        this.reverse = reverse || false;

        this.tweenParams = tweenParams || { duration: 300, ease: PhaserObjects.Easing.Quadratic.Out };

        // The track is the static area the bar will move along.
        this.track = new PhaserObjects.Sprite(game, 0, 0, this.trackKey);

        // Phaser 3:
        // Anchor the track to 0 instead of 0.5
        this.track.displayOriginX = 0;
        this.track.displayOriginY = 0;

        this.add(this.track);

        this.width = this.track.width;
        this.height = this.track.height;

        // The bar is a static image taking up the width of the track.
        this.bar = new PhaserObjects.Sprite(
            game,
            0,
            0,
            this.barKey,
        );

        // Phaser 3:
        // Anchor the track to 0 instead of 0.5
        this.bar.displayOriginX = 0;
        this.bar.displayOriginY = 0;

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
        this.bar.mask = mask.create(this.bar.maskX, this.bar.maskY, this.maskW, this.maskH);

        // Phaser CE: Mask must be added to Group
        if (this.version === undefined) {
            this.add(mask);
        }
    }

    getMaskXY(x = 0, y = 0) {
        // Phaser CE: Mask starts at bar xy, Phaser 3: Mask starts at group xy
        let maskX;
        let maskY;

        maskX = x;
        maskY = y;

        if (this.version === undefined) {
            maskX += this.bar.x;
            maskY += this.bar.y;
        } else {
            maskX += this.x;
            maskY += this.y;
        }

        // Resizes the bar.
        if (this.reverse) {
            if (this.vertical) {
                maskY += this.getBarFraction();
            } else {
                maskX += this.getBarFraction();
            }
        }

        return [maskX, maskY];
    }

    getBarPosition() {
        const windowPositionRatio = this.valueRange.getRatio() / this.windowScrollAreaSize;
        return this.trackScrollAreaSize * windowPositionRatio;
    }

    create(maskX = 0, maskY = 0) {
        this.centerStaticAxis();

        // Values for the bar's mask.
        this.maskW = this.bar.width;
        this.maskH = this.bar.height;

        const [mx, my] = this.getMaskXY(maskX, maskY);
        this.maskX = mx;
        this.maskY = my;

        this.setMask();

        const barSize = this.getBarSize();

        if (this.reverse) {
            if (this.vertical) {
                this.bar.mask.geometryMask.scaleY = barSize;
            } else {
                this.bar.mask.geometryMask.scaleX = barSize;
            }
        } else {
            if (this.vertical) {
                this.bar.mask.geometryMask.scaleY = barSize;
            } else {
                this.bar.mask.geometryMask.scaleX = barSize;
            }
        }

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
    addScrollTweenMask(properties, duration, ease) {
        new PhaserObjects.Tween(this.game).add(
            this.bar.mask.geometryMask,
            properties,
            duration,
            ease,
        );
    }

    /**
     * Adjusts the bar by a given value.
     * @param {number} newValue - The value to adjust the bar by.
     */
    adjustBar(newValue) {
        this.valueRange.currentValue += newValue;

        let tween;
        const barSize = this.getBarSize();

        let moveToX;
        let moveToY;

        // Phaser 3 requires an offset
        if (this.version === undefined) {
            moveToX = 0;
            moveToY = 0;
        } else {
            moveToX = this.x;
            moveToY = this.y;
        }

        if (this.reverse) {
            if (this.vertical) {
                tween = { scaleY: barSize, y: moveToY + this.getBarFraction() };
            } else {
                tween = { scaleX: barSize, x: moveToX + this.getBarFraction() };
            }
        } else {
            if (this.vertical) {
                tween = { scaleY: barSize };
            } else {
                tween = { scaleX: barSize };
            }
        }

        this.addScrollTweenMask(tween, this.tweenParams.duration, this.tweenParams.ease);
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
            barSize = 1 - this.valueRange.getRatio();
        } else {
            barSize = this.valueRange.getRatio();
        }

        return barSize;
    }
}
