import { Bar } from './bar';

/**
 * Base object for Bars that can be manipulated with a mouse.
 * @extends Bar
 */
export class DraggableBar extends Bar {
    /** If the vertical scrollbar is draggable,
    * this function is called when the track is clicked.
    */
    verticalTrackClick() {
        // Don't register mouse clicks on the bar itself.
        const mouseY = this.game.input.mousePointer.y;

        if (mouseY > this.bar.y + this.worldPosition.y + this.bar.height) {
            this.scrollDown();
        } else if (mouseY < this.bar.y + this.worldPosition.y) {
            this.scrollUp();
        }
    }

    /** If the horizontal scrollbar is draggable,
    * this function is called when the track is clicked.
    */
    horizontalTrackClick() {
        const mouseX = this.game.input.mousePointer.x;
        // Don't register mouse clicks on the bar itself.
        if (mouseX > this.bar.x + this.bar.width + this.worldPosition.x) {
            this.scrollRight();
        } else if (mouseX < (this.bar.x + this.worldPosition.x)) {
            this.scrollLeft();
        }
    }

    /** Allows the bar to scroll when the track is clicked directly. */
    enableTrackClick() {
        let event;

        this.track.inputEnabled = true;

        if (this.vertical) {
            event = this.verticalTrackClick;
        } else {
            event = this.horizontalTrackClick;
        }

        this.track.events.onInputDown.add(event, this);
    }

    /** When called, ensures the bar can be moved.
    * Must be called once the bar has finished scrolling.
    */
    enableBarInput() {
        this.trackClicked = false;
        this.barMoving = false;
        this.bar.inputEnabled = true;
    }

    /** Enables clicking and dragging on the bar. */
    enableBarDrag() {
        this.setDraggableArea();

        this.bar.inputEnabled = true;
        this.bar.input.enableDrag();
        if (this.snapping) {
            this.bar.events.onInputUp.add(this.snapToClosestPosition, this);
        }
        this.bar.events.onInputDown.add(this.saveMousePosition, this);
        this.bar.events.onDragUpdate.add(this.moveContent, this);

        let draggableArea;

        if (this.vertical) {
            this.bar.input.allowHorizontalDrag = false;
            draggableArea = this.verticalDraggableArea;
        } else {
            this.bar.input.allowVerticalDrag = false;
            draggableArea = this.horizontalDraggableArea;
        }

        this.bar.input.boundsRect = new Phaser.Rectangle(
            draggableArea.x,
            draggableArea.y,
            draggableArea.w,
            draggableArea.h,
        );
    }

    saveMousePosition(sprite, pointer) {
        // When the bar is dragged, record where the mouse clicked down.
        this.mousePointer = { x: pointer.x, y: pointer.y };
    }

    getBarPosition() {
        const currentValue = this.valueRange.getCurrentValue();
        const windowPositionRatio = currentValue / this.windowScrollAreaSize;
        return this.trackScrollAreaSize * windowPositionRatio;
    }

    getMouseDelta() {
        let oldMousePosition;
        if (this.vertical) {
            oldMousePosition = this.mousePointer.y;
        } else {
            oldMousePosition = this.mousePointer.x;
        }

        // Only difference between clicking the track/using the keyboard vs mouse drag.
        let newMousePointer;
        if (this.trackClicked) {
            newMousePointer = { x: this.bar.x, y: this.bar.y };
        } else {
            const { mousePointer } = this.game.input;
            newMousePointer = { x: mousePointer.x, y: mousePointer.y };
        }

        let newMousePosition;
        if (this.vertical) {
            newMousePosition = newMousePointer.y;
        } else {
            newMousePosition = newMousePointer.x;
        }

        this.mousePointer = newMousePointer;

        // Maximum value for the mouse position. Only update when the new position is inside the track.
        let maxValue;
        if (this.vertical) {
            maxValue = this.track.height + this.worldPosition.y;
        } else {
            maxValue = this.track.width + this.worldPosition.x;
        }

        let mousePositionDelta;
        if (newMousePosition < maxValue) {
            mousePositionDelta = oldMousePosition - newMousePosition;
        } else {
            mousePositionDelta = 0;
        }

        return mousePositionDelta;
    }

    /** Creates the tween for moving the bar to a new position. */
    addScrollTween(properties) {
        this.mousePointer = { x: this.bar.x, y: this.bar.y };
        this.trackClicked = true;

        const newTween = this.game.add.tween(this.bar).to(
            properties,
            this.tweenParams.duration,
            this.tweenParams.ease,
            true,
        );

        this.addScrollTweenEvents(newTween);
    }

    /** Called after a scroll tween is added. Adds the necessary events to the tween. */
    addScrollTweenEvents(tween) {
        // Update the values as the bar moves.
        tween.onUpdateCallback(this.moveContent, this);
        tween.onComplete.add(this.enableBarInput, this);
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
        if (this.bar.y + this.bar.height !== this.track.y + this.track.height && !this.barMoving) {
            const testPosition = this.bar.y + (this.vslice * 2);
            let moveToY = null;
            this.barMoving = true;
            this.bar.inputEnabled = false;

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
            this.bar.inputEnabled = false;

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
        if (this.bar.x + this.bar.width !== this.track.x + this.track.width && !this.barMoving) {
            const testPosition = this.bar.x + (this.hslice * 2);
            let moveToX = null;
            this.barMoving = true;
            this.bar.inputEnabled = false;

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

        this.onMovement.dispatch(this);
    }
}
