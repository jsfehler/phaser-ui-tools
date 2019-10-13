import { DraggableBar } from './draggable_bar';

import { ViewportRange } from './ranges';

import * as PhaserObjects from '../phaserObjects';

/**
 * A bar that moves along a track.
 * The bar is resized relative to the size of the track and size of the content to be scrolled.
 * @extends DraggableBar
 */
export class Scrollbar extends DraggableBar {
    /**
     * @param {Object} game - Current game instance.
     * @param {Object} content - Anything that you want to move via the scrollbar.
     * @param {boolean} draggable - Determines if the scrollbar responds to mouse clicks.
     * @param {boolean} vertical - Determines if the scrollbar should be vertical or horizontal.
     * @param {string} trackImage - The image key to use for the track.
     * @param {string} barImage - The image key to use for the bar. Will automatically resize to fit.
     * @param {Object} tweenParams - Object with duration and easing function for the scrolling tween.
     */
    constructor(game, content, draggable, vertical, trackImage, barImage, tweenParams) {
        super(game);

        this.content = content;

        this.valueRange = new ViewportRange(content, vertical);

        this.vertical = vertical || false;
        this.draggable = draggable || false;

        this.trackImage = trackImage;
        this.barImage = barImage;

        // The smallest pixel size allowed for the bar.
        this.minBarSize = 44;

        this.tweenParams = tweenParams || { duration: 300, ease: PhaserObjects.Easing.Quadratic.Out };

        // Flag switched on when the track is clicked, switched off after the bar movement is finished.
        this.trackClicked = false;
        this.barMoving = false;

        // Records mouse pointer when clicking the bar.
        this.mousePointer = null;

        // The track is the static area the bar will move along.
        this.track = new PhaserObjects.Sprite(
            game,
            this.x,
            this.y,
            this.trackImage,
        );

        // Phaser 3:
        // Anchor the track to 0 instead of 0.5
        this.track.displayOriginX = 0;
        this.track.displayOriginY = 0;

        this.add(this.track);

        if (this.draggable) {
        // If the bar is draggable, clicking the track will move the bar up or down.
            this.enableTrackClick();
        }

        // The bar is the part that moves, controlling the value of the scrollbar.
        this.bar = new PhaserObjects.Button(
            game,
            this.x,
            this.y,
            this.barImage,
            this.moveContent,
            this,
            1,
            0,
        );

        // Phaser 3:
        // Anchor the bar to 0 instead of 0.5
        this.bar.displayOriginX = 0;
        this.bar.displayOriginY = 0;

        this.add(this.bar);

        this.resizeBar();

        this.minY = this.track.y;
        this.maxY = (this.track.y + this.track.height) - this.bar.displayHeight;
        this.minX = this.track.x;
        this.maxX = (this.track.x + this.track.width) - this.bar.displayWidth;

        this.create();

        // Maximum value for the mouse position.
        if (this.vertical) {
            this.maxValue = this.track.displayHeight + this.worldPosition.y;

            if (this.version === undefined) {
                this.maxValue += this.bar.displayHeight;
            }
        } else {
            this.maxValue = this.track.displayWidth + this.worldPosition.x;

            if (this.version === undefined) {
                this.maxValue += this.bar.displayWidth;
            }
        }
    }

    /**
     * @private
     * Given a ratio between total content size and viewport size,
     * resize the bar sprite to the appropriate percentage of the track.
     */
    resizeBar() {
        let barSize;
        if (this.vertical) {
            barSize = this.track.height * this.valueRange.ratio;
        } else {
            barSize = this.track.width * this.valueRange.ratio;
        }

        // Prevents bar from becoming microscopic.
        if (barSize < this.minBarSize) {
            barSize = this.minBarSize;
        }

        // Resizes the bar.
        if (this.vertical) {
            this.bar.displayHeight = barSize;
        } else {
            this.bar.displayWidth = barSize;
        }
    }

    create() {
        this.centerStaticAxis();

        if (this.draggable) {
            this.enableBarDrag();
        }

        // Determine the distance the window can scroll over
        this.windowScrollAreaSize = this.valueRange.maxValue - this.valueRange.step;

        // Represents one fraction of the track.
        this.vslice = (this.track.displayHeight * this.valueRange.ratio);
        this.hslice = (this.track.displayWidth * this.valueRange.ratio);

        this.setTrackScrollAreaSize();

        // Initial position for the bar.
        this.mousePointer = { x: this.bar.x, y: this.bar.y };

        this.setInitialBarPosition();
    }

    /**
     * @private
     * Sets the draggable area of the bar.
     */
    setDraggableArea() {
        let vh = this.track.displayHeight;

        if (this.version === 3) {
            vh -= this.bar.displayHeight;
        }

        this.verticalDraggableArea = {
            x: this.track.x - ((this.bar.displayWidth - this.track.width) / 2),
            y: this.track.y,
            w: this.bar.displayWidth,
            h: vh,
        };

        this.horizontalDraggableArea = {
            x: this.track.x,
            y: this.track.y - ((this.bar.displayHeight - this.track.height) / 2),
            w: this.track.width,
            h: this.bar.displayHeight,
        };
    }

    /**
     * @private
     * Ensure the bar starts off where it should be, according to the bar's logical position.
     */
    setInitialBarPosition() {
        const gripPositionOnTrack = this.getBarPosition();

        // Make sure the bar is physically where it should be.
        if (this.vertical) {
            this.bar.y = gripPositionOnTrack + this.track.y;
        } else {
            this.bar.x = gripPositionOnTrack + this.track.x;
        }
    }

    getGripPositionRatio() {
        const gripPositionOnTrack = this.getBarPosition();
        const mousePositionDelta = this.getMouseDelta();

        let newGripPosition = gripPositionOnTrack + mousePositionDelta;

        // Don't let the content scroll above or below the track's size
        if (newGripPosition > 0) {
            newGripPosition = 0;
        } else if (newGripPosition <= -this.trackScrollAreaSize) {
            newGripPosition = -this.trackScrollAreaSize;
        }

        // When the scrollbar is at the top or bottom, prevent a mouse movement that
        // doesn't move the scrollbar from moving the content.
        if (this.vertical) {
            if (this.bar.y <= this.track.y) {
                newGripPosition = 0;
            } else if (this.bar.y + this.bar.displayHeight >= this.track.y + this.track.displayHeight) {
                newGripPosition = -this.trackScrollAreaSize;
            }
        } else {
            if (this.bar.x <= this.track.x) {
                newGripPosition = 0;
            } else if (this.bar.x + this.bar.displayWidth >= this.track.x + this.track.displayWidth) {
                newGripPosition = -this.trackScrollAreaSize;
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
