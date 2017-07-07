var Phaser;

var uiWidgets = uiWidgets || {};

/**
 * A bar that moves along a track. The bar is resized relative to the size of the track and size of the content to be scrolled.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {Object} content - Anything that you want to move via the scrollbar.
 * @param {boolean} draggable - Determines if the scrollbar responds to mouse clicks.
 * @param {boolean} vertical - Determines if the scrollbar should be vertical or horizontal.
 * @param {boolean} keyboard - Determines if the scrollbar responds to keyboard input.
 * @param {string} trackImage - The image key to use for the track.
 * @param {string} barImage - The image key to use for the bar. Will be automatically resized to fit.
 * @param {Object} tweenParams - Dictionary with the duration and easing function for the scrolling tween.
 */
uiWidgets.Scrollbar = function (game, content, draggable, vertical, keyboard, trackImage, barImage, tweenParams) {
    "use strict";
    Phaser.Group.call(this, game);
    game.add.existing(this);

    this.game = game;
    this.content = content;

    this.valueRange = new uiWidgets.ViewportRange(content, vertical);

    this.vertical = vertical || false;
    this.draggable = draggable || false;
    keyboard = keyboard || false;

    if (keyboard) {
        this.enableKeyboard();
    }

    this.trackImage = trackImage;
    this.barImage = barImage;

    // The smallest pixel size allowed for the bar.
    this.minBarSize = 44;

    this.tweenParams = tweenParams || {'duration': 300, 'ease': Phaser.Easing.Quadratic.Out};

    // Flag switched on when the track is clicked, switched off after the bar movement is finished.
    this.trackClicked = false;
    this.barMoving = false;

    // Records mouse pointer when clicking the bar.
    this.mousePointer = null;

    // The track is the static area the bar will move along.
    this.track = this.game.add.sprite(0, 0, this.trackImage);
    this.add(this.track);

    if (this.draggable) {
    // If the bar is draggable, clicking the track will move the bar up or down.
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
        0
    );
    this.add(this.bar);

    this.resizeBar();

    this.verticalDraggableArea = {
        "x": this.track.x - ((this.bar.width - this.track.width) / 2),
        "y": this.track.y,
        "w": this.bar.width,
        "h": this.track.height
    };

    this.horizontalDraggableArea = {
        "x": this.track.x,
        "y": this.track.y - ((this.bar.height - this.track.height) / 2),
        "w": this.track.width,
        "h": this.bar.height
    };

    this.minY = this.track.y;
    this.maxY = this.track.y + this.track.height - this.bar.height;
    this.minX = this.track.x;
    this.maxX = this.track.x + this.track.width - this.bar.width;

    this.create();
};

uiWidgets.Scrollbar.prototype = Object.create(uiWidgets.DraggableBar.prototype);
uiWidgets.Scrollbar.constructor = uiWidgets.Scrollbar;

/** Enables keyboard input for the scrollbar */
uiWidgets.Scrollbar.prototype.enableKeyboard = function () {
    "use strict";
    this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    if (this.vertical) {
        this.upKey.onDown.add(this.scrollUp, this);
        this.downKey.onDown.add(this.scrollDown, this);
        this.leftKey.onDown.add(this.scrollUp, this);
        this.rightKey.onDown.add(this.scrollDown, this);
    } else {
        this.upKey.onDown.add(this.scrollLeft, this);
        this.downKey.onDown.add(this.scrollRight, this);
        this.leftKey.onDown.add(this.scrollLeft, this);
        this.rightKey.onDown.add(this.scrollRight, this);
    }
};

/** Given a ration between total content size and viewport size,
 * resize the bar sprite to the appropriate percentage of the track.
 */
uiWidgets.Scrollbar.prototype.resizeBar = function () {
    "use strict";

    var barSize;
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
        this.bar.height = barSize;
    } else {
        this.bar.width = barSize;
    }

};

uiWidgets.Scrollbar.prototype.create = function () {
    "use strict";
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
    this.mousePointer = {"x": this.bar.x, "y": this.bar.y};

    this.setInitialBarPosition();
};

/** Ensure the bar starts off where it should be, according to the bar's logical position. */
uiWidgets.Scrollbar.prototype.setInitialBarPosition = function () {
    "use strict";
    var gripPositionOnTrack = this.getBarPosition();

    // Make sure the bar is physically where it should be.
    if (this.vertical) {
        this.bar.y = gripPositionOnTrack + this.track.y;
    } else {
        this.bar.x = gripPositionOnTrack + this.track.x;
    }

};

/** Creates the tween for moving the bar to a new position. */
uiWidgets.Scrollbar.prototype.addScrollTween = function (properties) {
    "use strict";
    this.mousePointer = {"x": this.bar.x, "y": this.bar.y};
    this.trackClicked = true;

    var newTween;
    newTween = this.game.add.tween(this.bar).to(
        properties,
        this.tweenParams.duration,
        this.tweenParams.ease,
        true
    );

    newTween.onUpdateCallback(this.moveContent, this);
    newTween.onComplete.add(this.enableBarInput, this);
};

/** For Vertical Scrollbars. Scrolls up by one step. */
uiWidgets.Scrollbar.prototype.scrollUp = function () {
    "use strict";
    // Prevents users from moving the bar while it's moving.
    if (this.bar.y !== this.track.y && !this.barMoving) {
        var testPosition = this.bar.y - this.vslice;
        var moveToY = null;
        this.barMoving = true;

        // Ensure the bar can't move above the track.
        if (testPosition <= this.track.y) {
            moveToY = this.minY;
        } else {
            moveToY = this.bar.y - this.vslice;
        }

        this.addScrollTween({y: moveToY});
    }
};

/** For Vertical Scrollbars. Scrolls down by one step. */
uiWidgets.Scrollbar.prototype.scrollDown = function () {
    "use strict";
    if (this.bar.y + this.bar.height !== this.track.y + this.track.height && !this.barMoving) {
        var testPosition = this.bar.y + (this.vslice * 2);
        var moveToY = null;
        this.barMoving = true;
        this.bar.inputEnabled = false;

        // Ensure the bar can't move below the track.
        if (testPosition >= this.track.y + this.track.height) {
            moveToY = this.maxY;
        } else {
            moveToY = this.bar.y + this.vslice;
        }

        this.addScrollTween({y: moveToY});
    }
};

/** For Horizontal Scrollbars. Scrolls left by one step. */
uiWidgets.Scrollbar.prototype.scrollLeft = function () {
    "use strict";
    if (this.bar.x !== this.track.x && !this.barMoving) {
        var testPosition = this.bar.x - this.hslice;
        var moveToX = null;
        this.barMoving = true;
        this.bar.inputEnabled = false;

        // Ensure the bar can't move above the track.
        if (testPosition <= this.track.x) {
            moveToX = this.minX;
        } else {
            moveToX = this.bar.x - this.hslice;
        }

        this.addScrollTween({x: moveToX});
    }
};

/** For Horizontal Scrollbars. Scrolls right by one step. */
uiWidgets.Scrollbar.prototype.scrollRight = function () {
    "use strict";
    if (this.bar.x + this.bar.width !== this.track.x + this.track.width && !this.barMoving) {
        var testPosition = this.bar.x + (this.hslice * 2);
        var moveToX = null;
        this.barMoving = true;
        this.bar.inputEnabled = false;

        // Ensure the bar can't move below the track.
        if (testPosition >= this.track.x + this.track.width) {
            moveToX = this.maxX;
        } else {
            moveToX = this.bar.x + this.hslice;
        }

        this.addScrollTween({x: moveToX});
    }
};

/** If the scrollbar is draggable, this function is called when the track is clicked. */
uiWidgets.Scrollbar.prototype.clickTrack = function (sprite, pointer) {
    "use strict";

    if (this.vertical) {
        // Don't register mouse clicks on the bar itself.
        if (this.game.input.mousePointer.y > this.bar.y + this.bar.height + this.y) {
            this.scrollDown();
        } else if (this.game.input.mousePointer.y < this.bar.y + this.y) {
            this.scrollUp();
        }
    } else {
        // Don't register mouse clicks on the bar itself.
        if (this.game.input.mousePointer.x > this.bar.x + this.bar.width + this.x) {
            this.scrollRight();
        } else if (this.game.input.mousePointer.x < (this.bar.x + this.x)) {
            this.scrollLeft();
        }
    }
};

uiWidgets.Scrollbar.prototype.saveMousePosition = function (sprite, pointer) {
    "use strict";
    // When the bar is dragged, record where the mouse clicked down.
    this.mousePointer = {"x": pointer.x, "y": pointer.y};
};

uiWidgets.Scrollbar.prototype.getBarPosition = function () {
    "use strict";
    var currentValue = this.valueRange.getCurrentValue();
    var windowPositionRatio = currentValue / this.windowScrollAreaSize;
    return this.trackScrollAreaSize * windowPositionRatio;
};

uiWidgets.Scrollbar.prototype.getMouseDelta = function () {
    "use strict";
    var oldMousePosition,
    newMousePosition,
    newMousePointer,
    maxValue,
    mousePositionDelta;

    if (this.vertical) {
        oldMousePosition = this.mousePointer.y;
    } else {
        oldMousePosition = this.mousePointer.x;
    }

    // Only difference between clicking the track/using the keyboard vs mouse drag.
    if (this.trackClicked) {
        newMousePointer = {"x": this.bar.x, "y": this.bar.y};
    } else {
        newMousePointer = {"x": this.game.input.mousePointer.x, "y": this.game.input.mousePointer.y};
    }

    if (this.vertical) {
        newMousePosition = newMousePointer.y;
    } else {
        newMousePosition = newMousePointer.x;
    }

    this.mousePointer = newMousePointer;

    // Maximum value for the mouse position. Only update when the new position is inside the track.
    if (this.vertical) {
        maxValue = this.track.height + this.y;
    } else {
        maxValue = this.track.width + this.x;
    }

    if (newMousePosition < maxValue) {
        mousePositionDelta = oldMousePosition - newMousePosition;
    } else {
        mousePositionDelta = 0;
    }

    return mousePositionDelta;
};

uiWidgets.Scrollbar.prototype.getGripPositionRatio = function () {
    "use strict";
    var gripPositionOnTrack = this.getBarPosition();
    var mousePositionDelta = this.getMouseDelta();

    var newGripPosition = gripPositionOnTrack + mousePositionDelta;

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
        } else if (this.bar.y + this.bar.height >= this.track.y + this.track.height) {
            newGripPosition = -this.trackScrollAreaSize;
        }
    } else {
        if (this.bar.x <= this.track.x) {
            newGripPosition = 0;
        } else if (this.bar.x + this.bar.width >= this.track.x + this.track.width) {
            newGripPosition = -this.trackScrollAreaSize;
        }
    }

    var newGripPositionRatio = newGripPosition / this.trackScrollAreaSize;

    // If the scrollable area is less than the size of the scrollbar, the bar and track will be the same size.
    // In this scenario, a divide by zero occurs. Capture that and turn it into zero.
    if (isNaN(newGripPositionRatio)) {
        newGripPositionRatio = 0;
    }

    return newGripPositionRatio;

};

/** Called when the scrollbar needs to move the viewport. Causes the content to move relative to the bar's position on the track. */
uiWidgets.Scrollbar.prototype.moveContent = function () {
    "use strict";
    var newGripPositionRatio = this.getGripPositionRatio();

    var newContentPosition = newGripPositionRatio * this.windowScrollAreaSize;

    this.valueRange.adjustValue(newContentPosition);
};
