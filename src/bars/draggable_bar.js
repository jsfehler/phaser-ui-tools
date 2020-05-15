import * as EventEmitter from 'eventemitter3';
import * as PhaserObjects from '../phaserObjects';
import { Bar } from './bar';

/**
 * Base object for Bars that can be manipulated with a mouse.
 * @private
 * @extends Bar
 */
export class DraggableBar extends Bar {
    constructor(game, x = 0, y = 0) {
        super(game, x, y);
        this.emitter = new EventEmitter();
    }

    /**
     * @private
     * If the vertical scrollbar is draggable,
     * this function is called when the track is clicked.
     */
    verticalTrackClick() {
        // Don't register mouse clicks on the bar itself.
        const mouseY = this.game.input.mousePointer.y;

        let barY = this.bar.y + this.worldPosition.y;

        if (this.parentContainer) {
            barY += this.parentContainer.y;
        }

        if (mouseY > barY + this.bar.displayHeight) {
            this.scrollDown();
        } else if (mouseY < barY) {
            this.scrollUp();
        }
    }

    /**
     * @private
     * If the horizontal scrollbar is draggable,
     * this function is called when the track is clicked.
     */
    horizontalTrackClick() {
        // Don't register mouse clicks on the bar itself.
        const mouseX = this.game.input.mousePointer.x;

        let barX = this.bar.x + this.worldPosition.x;

        if (this.parentContainer) {
            barX += this.parentContainer.x;
        }

        if (mouseX > barX + this.bar.displayWidth) {
            this.scrollRight();
        } else if (mouseX < barX) {
            this.scrollLeft();
        }
    }

    /**
     * @private
     * Allows the bar to scroll when the track is clicked directly.
     */
    enableTrackClick() {
        let event;

        this.track.setInteractive();

        if (this.vertical) {
            event = this.verticalTrackClick;
        } else {
            event = this.horizontalTrackClick;
        }

        this.track.addDownEvent(event, this);
    }

    /**
     * @private
     * When called, ensures the bar can be moved.
     * Must be called once the bar has finished scrolling.
     */
    enableBarInput() {
        this.trackClicked = false;
        this.barMoving = false;
        this.bar.enableDragging(this.vertical);
    }

    /**
     * @private
     * Enables clicking and dragging on the bar.
     */
    enableBarDrag() {
        this.setDraggableArea();

        this.bar.enableDragging(this.vertical);

        let draggableArea;

        if (this.vertical) {
            draggableArea = this.verticalDraggableArea;
        } else {
            draggableArea = this.horizontalDraggableArea;
        }

        this.bar.setDragBounds(draggableArea);

        if (this.snapping) {
            this.bar.addUpEvent(this.snapToClosestPosition, this);
        }
        this.bar.addDownEvent(this.saveMousePosition, this);
        this.bar.addDragEvent(this.moveContent, this);
    }

    saveMousePosition(pointer) {
        // When the bar is dragged, record where the mouse clicked down.
        this.mousePointer = {
            x: pointer.x - (pointer.x - this.bar.x),
            y: pointer.y - (pointer.y - this.bar.y),
        };
    }

    getBarPosition() {
        const currentValue = this.valueRange.getCurrentValue();
        const windowPositionRatio = currentValue / this.windowScrollAreaSize;
        return this.trackScrollAreaSize * windowPositionRatio;
    }

    getMouseDelta() {
        // Only difference between clicking the track/using the keyboard vs mouse drag.
        let newMousePointer;
        if (this.trackClicked) {
            newMousePointer = { x: this.bar.x, y: this.bar.y };
        } else {
            const { mousePointer } = this.game.input;
            newMousePointer = {
                x: mousePointer.x - (mousePointer.x - this.bar.x),
                y: mousePointer.y - (mousePointer.y - this.bar.y),
            };
        }

        let oldMousePosition;
        let newMousePosition;
        if (this.vertical) {
            oldMousePosition = this.mousePointer.y;
            newMousePosition = newMousePointer.y;
        } else {
            oldMousePosition = this.mousePointer.x;
            newMousePosition = newMousePointer.x;
        }

        this.mousePointer = newMousePointer;

        // Only update when the new position is inside the track.
        let mousePositionDelta;
        if (newMousePosition < this.maxValue) {
            mousePositionDelta = oldMousePosition - newMousePosition;
        } else {
            mousePositionDelta = 0;
        }

        return mousePositionDelta;
    }

    /**
     * @private
     * Creates the tween for moving the bar to a new position.
     */
    addScrollTween(properties) {
        this.mousePointer = { x: this.bar.x, y: this.bar.y };
        this.trackClicked = true;

        new PhaserObjects.Tween(this.game).add(
            this.bar,
            properties,
            this.tweenParams.duration,
            this.tweenParams.ease,
            this.enableBarInput,
            this.moveContent,
            null,
            this,
            this,
            null,
        );
    }

    /** For Vertical Scrollbars. Scrolls up by one step. */
    scrollUp() {
        // Prevents users from moving the bar while it's moving.
        if (this.bar.y !== this.track.y && !this.barMoving) {
            const testPosition = this.bar.y - this.vslice;
            let moveToY = null;
            this.barMoving = true;

            // Ensure the bar can't move above the track.
            if (testPosition <= this.track.y) {
                moveToY = this.minY;
            } else {
                moveToY = this.bar.y - this.vslice;
            }

            this.addScrollTween({ y: moveToY });
        }
    }

    /** For Vertical Scrollbars. Scrolls down by one step. */
    scrollDown() {
        if (this.bar.y + this.bar.displayHeight !== this.track.y + this.track.height && !this.barMoving) {
            const testPosition = this.bar.y + (this.vslice * 2);
            let moveToY = null;
            this.barMoving = true;
            this.bar.disableInteractive();

            // Ensure the bar can't move below the track.
            if (testPosition >= this.track.y + this.track.height) {
                moveToY = this.maxY;
            } else {
                moveToY = this.bar.y + this.vslice;
            }

            this.addScrollTween({ y: moveToY });
        }
    }

    /** For Horizontal Scrollbars. Scrolls left by one step. */
    scrollLeft() {
        if (this.bar.x !== this.track.x && !this.barMoving) {
            const testPosition = this.bar.x - this.hslice;
            let moveToX = null;
            this.barMoving = true;
            this.bar.disableInteractive();

            // Ensure the bar can't move above the track.
            if (testPosition <= this.track.x) {
                moveToX = this.minX;
            } else {
                moveToX = this.bar.x - this.hslice;
            }

            this.addScrollTween({ x: moveToX });
        }
    }

    /** For Horizontal Scrollbars. Scrolls right by one step. */
    scrollRight() {
        if (this.bar.x + this.bar.displayWidth !== this.track.x + this.track.width && !this.barMoving) {
            const testPosition = this.bar.x + (this.hslice * 2);
            let moveToX = null;
            this.barMoving = true;
            this.bar.disableInteractive();

            // Ensure the bar can't move below the track.
            if (testPosition >= this.track.x + this.track.width) {
                moveToX = this.maxX;
            } else {
                moveToX = this.bar.x + this.hslice;
            }

            this.addScrollTween({ x: moveToX });
        }
    }

    /** Called when the scrollbar needs to move the viewport.
    * Causes the content to move relative to the bar's position on the track.
    */
    moveContent() {
        const newGripPositionRatio = this.getGripPositionRatio();

        const newContentPosition = newGripPositionRatio * this.windowScrollAreaSize;

        this.valueRange.adjustValue(newContentPosition);

        this.emitter.emit('movement', this);
    }
}
