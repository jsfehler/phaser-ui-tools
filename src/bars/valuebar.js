import { DraggableBar } from './draggable_bar';

import { ValueRange } from './ranges';

/**
 * Bar that adjusts a number.
 * This is done by masking the sprite and then resizing the mask.
 * @extends DraggableBar
 */
export class ValueBar extends DraggableBar {
    /**
     * @param {Object} game - Current game instance.
     * @param {Object} xy -  Dictionary with the values for the bar's x and y position.
     * @param {Object} values - The numerical values for the bar.
     * @param {boolean} draggable - Determines if the scrollbar responds to mouse clicks.
     * @param {boolean} vertical - Determines if the bar should be vertical or horizontal.
     * @param {string} trackImage - The image key to use for the track.
     * @param {string} barImage - The image key to use for the bar. Will automatically resize to fit.
     * @param {Object} tweenParams - Object with duration and easing function for the scrolling tween.
     */
    constructor(game, xy, values, draggable, vertical, trackImage, barImage, tweenParams) {
        super(game, xy.x, xy.y);
        game.add.existing(this);

        this.valueRange = new ValueRange(values.step, values.startValue, values.maxValue);

        this.vertical = vertical || false;
        this.draggable = draggable || false;

        this.trackImage = trackImage;
        this.barImage = barImage;

        this.tweenParams = tweenParams || { duration: 300, ease: Phaser.Easing.Quadratic.Out };

        // Flag flipped when the track is clicked, switched off after the bar movement is finished.
        this.trackClicked = false;
        this.barMoving = false;

        // Records mouse pointer when clicking the bar.
        this.mousePointer = null;

        // The track is the static area the bar will move along.
        this.track = this.game.add.sprite(0, 0, this.trackImage);
        this.add(this.track);

        // If the bar is draggable, clicking the track will move the bar up or down.
        if (this.draggable) {
            this.enableTrackClick();
        }

        // The bar is the part that moves, controlling the value of the scrollbar.
        this.bar = this.game.add.button(
            this.x,
            this.y,
            this.barImage,
            this.moveContent,
            this,
            1,
            0,
        );

        // Add an invisible background.
        // This ensures the bar can always be entered correctly, no matter where the grip is.
        this.bg = this.game.add.graphics(0, 0);
        this.add(this.bg);
        this.sendToBack(this.bg);
        this.bg.beginFill(0xff0000, 0);

        if (this.vertical) {
            this.bg.drawRect(0, 0 - (this.bar.height / 2), 1, this.track.height + this.bar.height);
        } else {
            this.bg.drawRect(0 - (this.bar.width / 2), 0, this.track.width + this.bar.width, 1);
        }
        this.bg.endFill();

        this.snapping = true;

        this.add(this.bar);
        this.minY = this.track.y - (this.bar.height / 2);
        this.maxY = (this.track.y + this.track.height) - (this.bar.height / 2);
        this.minX = this.track.x - (this.bar.width / 2);
        this.maxX = (this.track.x + this.track.width) - (this.bar.width / 2);

        this.create();

        if (this.vertical) {
            this.upEvent = this.scrollUp;
            this.downEvent = this.scrollDown;
        } else {
            this.upEvent = this.scrollLeft;
            this.downEvent = this.scrollRight;
        }

        /**
         * Dispatched when the bar is moved.
         * @property {Phaser.Signal}
         */
        this.onMovement = new Phaser.Signal();
    }

    create() {
        this.centerStaticAxis();

        if (this.draggable) {
            this.enableBarDrag();
        }

        // Determine the distance the window can scroll over
        this.windowScrollAreaSize = this.valueRange.maxValue - this.valueRange.step;

        // Represents one fraction of the track.
        this.vslice = (this.track.height * this.valueRange.ratio);
        this.hslice = (this.track.width * this.valueRange.ratio);

        this.setTrackScrollAreaSize();

        // Initial position for the bar.
        this.mousePointer = { x: this.bar.x, y: this.bar.y };

        this.setInitialBarPosition();
    }

    /** Sets the draggable area of the bar. */
    setDraggableArea() {
        this.verticalDraggableArea = {
            x: this.track.x - ((this.bar.width - this.track.width) / 2),
            y: this.track.y - (this.bar.height / 2),
            w: this.bar.width,
            h: this.track.height + this.bar.height,
        };

        this.horizontalDraggableArea = {
            x: this.track.x - (this.bar.width / 2),
            y: this.track.y - ((this.bar.height - this.track.height) / 2),
            w: this.track.width + this.bar.width,
            h: this.bar.height,
        };
    }

    /** Determine the distance the bar can scroll over */
    setTrackScrollAreaSize() {
        if (this.vertical) {
            this.trackScrollAreaSize = this.track.height;
        } else {
            this.trackScrollAreaSize = this.track.width;
        }
    }

    /** Ensure the bar starts off where it should be, according to the bar's logical position. */
    setInitialBarPosition() {
        const gripPositionOnTrack = this.getBarPosition();

        // The bar should always be in centered on it's current position.
        if (this.vertical) {
            this.bar.y = (gripPositionOnTrack + this.track.y) - (this.bar.height / 2);
        } else {
            this.bar.x = (gripPositionOnTrack + this.track.x) - (this.bar.width / 2);
        }
    }

    /** Returns the closest valid value. */
    getClosestPosition() {
        const currentValue = this.valueRange.getCurrentValue();

        let diff = Math.abs(currentValue - this.valueRange.steps[0]);
        let closestPosition = this.valueRange.steps[0];

        for (let i = 0; i < this.valueRange.steps.length; i++) {
            const newdiff = Math.abs(currentValue - this.valueRange.steps[i]);
            if (newdiff < diff) {
                diff = newdiff;
                closestPosition = this.valueRange.steps[i];
            }
        }

        return closestPosition;
    }

    /** On mouse up, forces the value to equal the closest step. */
    snapToClosestPosition() {
        const closestPosition = this.getClosestPosition();

        this.valueRange.adjustValue(closestPosition);
        this.moveContent();
        this.setInitialBarPosition();
    }

    /** Called after a scroll tween is added. Adds the necessary events to the tween. */
    addScrollTweenEvents(tween) {
        // Only update the values once the bar has finished moving.
        tween.onComplete.add(this.moveContent, this);
        tween.onComplete.add(this.enableBarInput, this);
    }

    getGripPositionRatio() {
        const gripPositionOnTrack = this.getBarPosition();
        const mousePositionDelta = this.getMouseDelta();

        let newGripPosition = gripPositionOnTrack - mousePositionDelta;
        // Don't let the content scroll above or below the track's size
        if (newGripPosition < 0) {
            newGripPosition = 0;
        } else if (newGripPosition >= this.trackScrollAreaSize) {
            newGripPosition = this.trackScrollAreaSize;
        }

        // When the scrollbar is at the top or bottom, prevent a mouse movement that
        // doesn't move the scrollbar from moving the content.
        if (this.vertical) {
            if (this.bar.y <= this.track.y) {
                newGripPosition = 0;
            } else if (this.bar.y + this.bar.height >= this.track.y + this.track.height) {
                newGripPosition = this.trackScrollAreaSize;
            }
        } else {
            if (this.bar.x <= this.track.x) {
                newGripPosition = 0;
            } else if (this.bar.x + this.bar.width >= this.track.x + this.track.width) {
                newGripPosition = this.trackScrollAreaSize;
            }
        }

        let newGripPositionRatio = newGripPosition / this.trackScrollAreaSize;

        // If the scrollable area is less than the size of the scrollbar,
        // the bar and track will be the same size.
        // In this scenario, a divide by zero occurs. Capture that and turn it into zero.
        if (Number.isNaN(newGripPositionRatio)) {
            newGripPositionRatio = 0;
        }

        return newGripPositionRatio;
    }
}
