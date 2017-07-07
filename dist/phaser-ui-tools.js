var Phaser;

var uiWidgets = uiWidgets || {};


/** Base object for all Bars. */
uiWidgets.Bar = function () {};
uiWidgets.Bar.prototype = Object.create(Phaser.Group.prototype);
uiWidgets.Bar.constructor = uiWidgets.Bar;

/** Determine the distance the bar can scroll over. */
uiWidgets.Bar.prototype.setTrackScrollAreaSize = function () {
    "use strict";

    if (this.vertical) {
        this.trackScrollAreaSize = this.track.height - this.vslice;
    } else {
        this.trackScrollAreaSize = this.track.width - this.hslice;
    }
};

/** Sets position for the bar's non-moving axis. Centers it inside the track. */
uiWidgets.Bar.prototype.centerStaticAxis = function () {
    "use strict";
    if (this.vertical) {
        this.bar.x = this.track.x + (this.track.width / 2) - (this.bar.width / 2);
    } else {
        this.bar.y = this.track.y + (this.track.height / 2) - (this.bar.height / 2);
    }
};


/** Base object for Bars that can be dragged with a mouse. */
uiWidgets.DraggableBar = function () {};
uiWidgets.DraggableBar.prototype = Object.create(uiWidgets.Bar.prototype);
uiWidgets.DraggableBar.constructor = uiWidgets.DraggableBar;

/** Allows the bar to scroll when the track is clicked. */
uiWidgets.DraggableBar.prototype.enableTrackClick = function () {
    "use strict";
    this.track.inputEnabled = true;
    this.track.events.onInputDown.add(this.clickTrack, this);
};

/** When called, ensures the bar can be moved. Must be called once the bar has finished scrolling. */
uiWidgets.DraggableBar.prototype.enableBarInput = function () {
    "use strict";
    this.trackClicked = false;
    this.barMoving = false;
    this.bar.inputEnabled = true;
};

/** Enables clicking and dragging on the bar. */
uiWidgets.DraggableBar.prototype.enableBarDrag = function () {
    "use strict";
    this.bar.inputEnabled = true;
    this.bar.input.enableDrag();
    if (this.snapping) {
        this.bar.events.onInputUp.add(this.snapToClosestPosition, this);
    }
    this.bar.events.onInputDown.add(this.saveMousePosition, this);
    this.bar.events.onDragUpdate.add(this.moveContent, this);

    var draggableArea;

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
        draggableArea.h)
    ;
};
;var Phaser;

var uiWidgets = uiWidgets || {};


/**
 * Sprite with text added as a child.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {string} image - The image to create a sprite with.
 * @param {string} label - The text to place on top of the sprite.
 * @param {Object} style - The style properties to be set on the Text.
 * @param {number} x - The x coordinate on screen where the textSprite will be placed.
 * @param {number} y - The y coordinate on screen where the textSprite will be placed.
 */
uiWidgets.textSprite = function (game, image, label, style, x, y) {
    "use strict";
    Phaser.Sprite.call(this, game, x, y, image);
    game.add.existing(this);

    this.text = this.game.add.text(0, 0, label, style);
    this.text.anchor.set(0.5, 0.5);

    this.addChild(this.text);
};

uiWidgets.textSprite.prototype = Object.create(Phaser.Sprite.prototype);
uiWidgets.textSprite.constructor = uiWidgets.textSprite;


/**
 * Phaser Button with text added as a child.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {string} image - The image to create a sprite with.
 * @param {string} label - The text to place on top of the sprite.
 * @param {Object} style - The style properties to be set on the Text.
 * @param {number} x - The x coordinate on screen where the textSprite will be placed.
 * @param {number} y - The y coordinate on screen where the textSprite will be placed.
 * @param {Object} callback - Callback to use when the button is clicked.
 * @param {Object} callbackContext - The context the callback is called in.
 */
uiWidgets.textButton = function (game, image, label, style, x, y, callback, callbackContext) {
    "use strict";
    Phaser.Button.call(this, game, x, y, image, callback, callbackContext);
    game.add.existing(this);

    this.text = this.game.add.text(0, 0, label, style);
    this.text.anchor.set(0.5, 0.5);

    this.addChild(this.text);
};

uiWidgets.textButton.prototype = Object.create(Phaser.Button.prototype);
uiWidgets.textButton.constructor = uiWidgets.textButton;
;var Phaser;

var uiWidgets = uiWidgets || {};

/**
 * Group that places new child nodes directly under the previous child.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {Object} context - The context this object is called in.
 */
uiWidgets.Column = function (game, context) {
    "use strict";
    Phaser.Group.call(this, game);
    game.add.existing(this);

    this.game = game;
    this.context = context;
};

uiWidgets.Column.prototype = Object.create(Phaser.Group.prototype);
uiWidgets.Column.constructor = uiWidgets.Column;

/** Adds a new object into the Column, then aligns it under the previous object. */
uiWidgets.Column.prototype.addNode = function (node) {
    "use strict";
    this.add(node);
    var previousNode = this.children[this.children.length - 2];

    if (previousNode !== undefined) {
        node.alignTo(previousNode, Phaser.BOTTOM_CENTER);
    }
};
;var Phaser;

var uiWidgets = uiWidgets || {};

/** 
 * Bar that adjusts the size of a static sprite based on a value.
 * This is done by masking the sprite and then resizing the mask.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {Object} xy -  Dictionary with the values for the bar's x and y position.
 * @param {Object} values - The numerical values for the bar.
 * @param {boolean} vertical - Determines if the bar should be vertical or horizontal.
 * @param {boolean} reverse - Determines the direction the bar moves when adjusted.
 * @param {string} trackImage - The image key to use for the track.
 * @param {string} barImage - The image key to use for the bar. Will be automatically resized to fit.
 * @param {Object} tweenParams - Dictionary with the duration and easing function for the scrolling tween.
 */
uiWidgets.QuantityBar = function (game, xy, values, vertical, reverse, trackImage, barImage, tweenParams) {
    "use strict";
    Phaser.Group.call(this, game);
    game.add.existing(this);

    this.game = game;
    this.x = xy.x;
    this.y = xy.y;

    this.valueRange = new uiWidgets.QuantityRange(this, values.startValue, values.maxValue);

    this.vertical = vertical || false;
    this.reverse = reverse || false;

    this.trackImage = trackImage;
    this.barImage = barImage;

    this.tweenParams = tweenParams || {'duration': 300, 'ease': Phaser.Easing.Quadratic.Out};

    // The track is the static area the bar will move along.
    this.track = this.game.add.sprite(0, 0, this.trackImage);
    this.add(this.track);

    // The bar is a static image taking up the width of the track.
    this.bar = this.game.add.button(
        0,
        0,
        this.barImage,
        this.moveContent,
        this,
        1,
        0
    );
    this.add(this.bar);

    this.create();
};

uiWidgets.QuantityBar.prototype = Object.create(uiWidgets.Bar.prototype);
uiWidgets.QuantityBar.constructor = uiWidgets.QuantityBar;

/** Sets the bar's mask. */
uiWidgets.QuantityBar.prototype.setMask = function () {
    "use strict";
    if (this.bar.mask !== null) {
        this.bar.mask.destroy();
        this.bar.mask = null;
    }
    this.bar.mask = this.game.add.graphics(this.maskX, this.maskY);
    this.bar.mask.beginFill(0x0000ff);
    this.bar.mask.drawRect(0, 0, this.maskW, this.maskH);
    this.bar.mask.endFill();
};

uiWidgets.QuantityBar.prototype.getBarPosition = function () {
    "use strict";
    var windowPositionRatio = this.valueRange.getRatio() / this.windowScrollAreaSize;
    return this.trackScrollAreaSize * windowPositionRatio;
};


uiWidgets.QuantityBar.prototype.create = function () {
    "use strict";
    this.centerStaticAxis();

    // Values for the bar's mask.
    this.maskW = this.bar.width;
    this.maskH = this.bar.height;
    this.maskX = this.bar.x + this.x;
    this.maskY = this.bar.y + this.y;

    // Resizes the bar.
    if (this.vertical) {
        this.maskH = this.getBarSize();
    } else {
        this.maskW = this.getBarSize();
    }

    this.setMask();

    if (this.reverse) {
        if (this.vertical) {
            this.bar.mask.y = this.bar.y + this.y + this.getBarFraction();
        } else {
            this.bar.mask.x = this.bar.x + this.x + this.getBarFraction();
        }
    }

    // Determine the distance the window can scroll over
    this.windowScrollAreaSize = this.valueRange.maxValue;

    // Represents one fraction of the track.
    this.vslice = (this.track.height * this.valueRange.getRatio());
    this.hslice = (this.track.width * this.valueRange.getRatio());

    this.setTrackScrollAreaSize();
};

/** Creates the tween for adjusting the size of the mask. */
uiWidgets.QuantityBar.prototype.addScrollTweenMask = function (properties) {
    "use strict";

    var newTween;
    newTween = this.game.add.tween(this.bar.mask).to(
        properties,
        this.tweenParams.duration,
        this.tweenParams.ease,
        true
    );
};

uiWidgets.QuantityBar.prototype.adjustBar = function (newValue) {
    "use strict";
    this.valueRange.currentValue += newValue;

    var tween;

    var barSize = this.getBarSize();

    if (this.reverse) {
        if (this.vertical) {
            tween = {height: barSize, y: this.bar.y + this.y + this.getBarFraction()};
        } else {
            tween = {width: barSize, x: this.bar.x + this.x + this.getBarFraction()};
        }
    } else {
        if (this.vertical) {
            tween = {height: barSize};
        } else {
            tween = {width: barSize};
        }
    }

    this.addScrollTweenMask(tween);
};

uiWidgets.QuantityBar.prototype.getBarFraction = function () {
    "use strict";
    var fraction;
    if (this.vertical) {
        fraction = this.track.height * this.valueRange.getRatio();
    } else {
        fraction = this.track.width * this.valueRange.getRatio();
    }

    return fraction;
};

/** Given a ratio between total content size and viewport size,
 * return an appropriate percentage of the track. 
 */
uiWidgets.QuantityBar.prototype.getBarSize = function () {
    "use strict";
    var barSize;
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
};;var Phaser;

var uiWidgets = uiWidgets || {};


/** Used by a QuantityBar to hold the bar's values.
 * @constructor
 * @param {number} bar - The QuantityBar object that uses the range.
 * @param {number} startValue - The initial value for the bar.
 * @param {number} maxValue - The maximum value the bar can have.
 */
uiWidgets.QuantityRange = function (bar, startValue, maxValue) {
	"use strict";
	this.bar = bar;
	this.startValue = startValue;
	this.maxValue = maxValue;

	this.currentValue = startValue;
};


/** Returns the current ratio for how large the bar is compared to the track. */
uiWidgets.QuantityRange.prototype.getRatio = function () {
	"use strict";
	var ratio = this.currentValue / this.maxValue;
	return ratio;
};

/** Returns the bar's current value. */
uiWidgets.QuantityRange.prototype.getCurrentValue = function () {
	"use strict";
	return this.currentValue;
};


/** 
 * Used by a ValueBar to hold the bar's values.
 * @constructor
 * @param {number} step - The amount the bar is changed by.
 * @param {number} startValue - The initial value for the bar.
 * @param {number} maxValue - The maximum value the bar can have.
 */
uiWidgets.ValueRange = function (step, startValue, maxValue) {
	"use strict";
	this.step = step;
	this.startValue = startValue;
	this.maxValue = maxValue + step;

	this.ratio = step / maxValue;

	// The ratio between the step and max can't be greater than 1.
	// ie: There can't be more steps than the max value.
	if (this.ratio > 1) {
		this.ratio = 1;
	}

	this.currentValue = startValue;

	// List of every possible step. Used for snapping into position by the ValueBar.
	this.steps = [];
	for (var i = 0; i < this.maxValue; i += step) {
		this.steps.push(i);
	}

};


/** Adjusts the current value for the bar.
 * @param {number} newValue - The new current value.
 */
uiWidgets.ValueRange.prototype.adjustValue = function (newValue) {
	"use strict";
	this.currentValue = newValue;
};


/** Returns the bar's current value. */
uiWidgets.ValueRange.prototype.getCurrentValue = function () {
	"use strict";
	return this.currentValue;
};


/** 
 * Used by a Scrollbar to hold the values and adjust a viewport's position.
 * @constructor
 * @param {Object} viewport - The viewport to adjust.
 * @param {boolean} vertical - If the viewport is vertical or horizontal.
 */
uiWidgets.ViewportRange = function (viewport, vertical) {
	"use strict";
	this.viewport = viewport;
	this.vertical = vertical;

	if (vertical) {
		this.step = viewport.area.height;
		this.maxValue = viewport.height;
	} else {
		this.step = viewport.area.width;
		this.maxValue = viewport.width;
	}

	this.ratio = this.step / this.maxValue;

	// The ratio between the step and max can't be greater than 1.
	// ie: There can't be more steps than the max value.
	if (this.ratio > 1) {
		this.ratio = 1;
	}
};

/** Adjusts the viewport's position. */
uiWidgets.ViewportRange.prototype.adjustValue = function (newValue) {
	"use strict";
	// Set the content's new position. Uses an offset for where the viewport is on screen.
	if (this.vertical) {
		this.viewport.y = newValue + this.viewport.area.y;
	} else {
		this.viewport.x = newValue + this.viewport.area.x;
	}

	this.viewport.disableOutOfBounds(this.viewport.children, this, this.vertical);
};

uiWidgets.ViewportRange.prototype.getCurrentValue = function () {
	"use strict";
	var currentValue;
	if (this.vertical) {
		// y - an offset for where the viewport is on screen.
		currentValue = this.viewport.y - this.viewport.area.y;
	} else {
		currentValue = this.viewport.x - this.viewport.area.x;
	}

	return currentValue;
};
;var Phaser;

var uiWidgets = uiWidgets || {};

/**
 * Group that places new child nodes directly next to the previous child.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {Object} context - The context this object is called in.
*/
uiWidgets.Row = function (game, context) {
    "use strict";
    Phaser.Group.call(this, game);
    game.add.existing(this);

    this.game = game;
    this.context = context;
};

uiWidgets.Row.prototype = Object.create(Phaser.Group.prototype);
uiWidgets.Row.constructor = uiWidgets.Row;

/** Adds a new object into the Row, then aligns it next to the previous object. */
uiWidgets.Row.prototype.addNode = function (node) {
    "use strict";
    this.add(node);
    var previousNode = this.children[this.children.length - 2];

    if (previousNode !== undefined) {
        node.alignTo(previousNode, Phaser.RIGHT_CENTER);
    }
};
;var Phaser;

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
;var Phaser;

var uiWidgets = uiWidgets || {};

/**
 * Bar that adjusts a number.
 * This is done by masking the sprite and then resizing the mask.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {Object} xy -  Dictionary with the values for the bar's x and y position.
 * @param {Object} values - The numerical values for the bar.
 * @param {boolean} draggable - Determines if the scrollbar responds to mouse clicks.
 * @param {boolean} vertical - Determines if the bar should be vertical or horizontal.
 * @param {boolean} keyboard - Determines if the scrollbar responds to keyboard input.
 * @param {string} trackImage - The image key to use for the track.
 * @param {string} barImage - The image key to use for the bar. Will be automatically resized to fit.
 * @param {Object} tweenParams - Dictionary with the duration and easing function for the scrolling tween.
 */
uiWidgets.ValueBar = function (game, xy, values, draggable, vertical, keyboard, trackImage, barImage, tweenParams) {
    "use strict";
    Phaser.Group.call(this, game);
    game.add.existing(this);

    this.game = game;
    this.x = xy.x;
    this.y = xy.y;

    this.valueRange = new uiWidgets.ValueRange(values.step, values.startValue, values.maxValue);

    this.vertical = vertical || false;
    this.draggable = draggable || false;
    keyboard = keyboard || false;

    if (keyboard) {
        this.enableKeyboard();
    }

    this.trackImage = trackImage;
    this.barImage = barImage;

    this.tweenParams = tweenParams || {'duration': 300, 'ease': Phaser.Easing.Quadratic.Out};

    // Flag switched on when the track is clicked, switched off after the bar movement is finished.
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
        0
    );

    this.snapping = true;

    this.add(this.bar);

    this.verticalDraggableArea = {
        "x": this.track.x - ((this.bar.width - this.track.width) / 2),
        "y": this.track.y - (this.bar.height / 2),
        "w": this.bar.width,
        "h": this.track.height + this.bar.height
    };

    this.horizontalDraggableArea = {
        "x": this.track.x - (this.bar.width / 2),
        "y": this.track.y - ((this.bar.height - this.track.height) / 2),
        "w": this.track.width + this.bar.width,
        "h": this.bar.height
    };

    this.minY = this.track.y - (this.bar.height / 2);
    this.maxY =  this.track.y + this.track.height - (this.bar.height / 2);
    this.minX = this.track.x - (this.bar.width / 2);
    this.maxX = this.track.x + this.track.width - (this.bar.width / 2);

    this.create();
};

uiWidgets.ValueBar.prototype = Object.create(uiWidgets.Scrollbar.prototype);
uiWidgets.ValueBar.constructor = uiWidgets.ValueBar;

/** Determine the distance the bar can scroll over */
uiWidgets.ValueBar.prototype.setTrackScrollAreaSize = function () {
    "use strict";
    if (this.vertical) {
        this.trackScrollAreaSize = this.track.height;
    } else {
        this.trackScrollAreaSize = this.track.width;
    }
};

/** Ensure the bar starts off where it should be, according to the bar's logical position. */
uiWidgets.ValueBar.prototype.setInitialBarPosition = function () {
    "use strict";
    var gripPositionOnTrack = this.getBarPosition();

    // The bar should always be in centered on it's current position.
    if (this.vertical) {
	       this.bar.y = gripPositionOnTrack + this.track.y - (this.bar.height / 2);
    } else {
	       this.bar.x = gripPositionOnTrack + this.track.x - (this.bar.width / 2);
    }

};

/** Returns the closest valid value.*/
uiWidgets.ValueBar.prototype.getClosestPosition = function () {
    "use strict";
    var currentValue = this.valueRange.getCurrentValue();

    var diff = Math.abs(currentValue - this.valueRange.steps[0]);
    var closestPosition = this.valueRange.steps[0];

    for (var i = 0; i < this.valueRange.steps.length; i++) {
        var newdiff = Math.abs(currentValue - this.valueRange.steps[i]);
        if (newdiff < diff) {
            diff = newdiff;
            closestPosition = this.valueRange.steps[i];
        }
    }

    return closestPosition;
};

/** On mouse up, forces the value to equal the closest step. */
uiWidgets.ValueBar.prototype.snapToClosestPosition = function () {
    "use strict";
    var closestPosition = this.getClosestPosition();

    this.valueRange.adjustValue(closestPosition);
    this.moveContent();
    this.setInitialBarPosition();
};

/** Creates the tween for moving the bar to a new position. */
uiWidgets.ValueBar.prototype.addScrollTween = function (properties) {
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

    // Only update the values once the bar has finished moving.
    newTween.onComplete.add(this.moveContent, this);
    newTween.onComplete.add(this.enableBarInput, this);
};

uiWidgets.ValueBar.prototype.getGripPositionRatio = function () {
    "use strict";
    var gripPositionOnTrack = this.getBarPosition();
    var mousePositionDelta = this.getMouseDelta();

    var newGripPosition = gripPositionOnTrack - mousePositionDelta;
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

    var newGripPositionRatio = newGripPosition / this.trackScrollAreaSize;

    // If the scrollable area is less than the size of the scrollbar, the bar and track will be the same size.
    // In this scenario, a divide by zero occurs. Capture that and turn it into zero.
    if (isNaN(newGripPositionRatio)) {
        newGripPositionRatio = 0;
    }

    return newGripPositionRatio;
};
;var Phaser;

var uiWidgets = uiWidgets || {};


/**
 * A container for other objects with a limited viewable area. Uses a mask to hide children outside of the specified x/y/width/height area.
 * Content outside the viewport has their input disabled.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {number} x - The x coordinate on screen where the viewport will be placed.
 * @param {number} y - The y coordinate on screen where the viewport will be placed.
 * @param {number} width - The width of the viewport.
 * @param {number} height - The height of the viewport.
 */
uiWidgets.Viewport = function (game, x, y, width, height) {
    "use strict";
    Phaser.Group.call(this, game);
    game.add.existing(this);

    this.x = x;
    this.y = y;

    // Viewport size and position, distinct from the total window size.
    this.area = {
        "x": x,
        "y": y,
        "width": width,
        "height": height
    };

    // Adding the mask attribute to a group hides objects outside the mask.
    this.mask = this.game.add.graphics(this.area.x, this.area.y);
    this.mask.beginFill(0x0000ff);
    this.mask.drawRect(0, 0, width, height);
    this.mask.endFill();
};

uiWidgets.Viewport.prototype = Object.create(Phaser.Group.prototype);
uiWidgets.Viewport.constructor = uiWidgets.Viewport;

/** Adds a new object into the Viewport. */
uiWidgets.Viewport.prototype.addNode = function (node) {
    "use strict";
    this.add(node);
};


/** Disable input for all objets outside the viewport's visible area. */
uiWidgets.Viewport.prototype.disableOutOfBounds = function (children, context, vertical) {
    "use strict";
    var child, location, contentLocation, trueCoords;

    // Makes sure the recursive function stops when there's no children.
    if (children !== undefined) {
        for (var i = 0; i < children.length; i++) {
            child = children[i];
            child.inputEnabled = true;

            // An object's x/y is relative to it's parent.
            // The world gives an x/y relative to the whole game.
            trueCoords = child.world || child;

            if (vertical) {
                location = trueCoords.y;
                contentLocation = context.viewport.area.y;
            } else {
                location = trueCoords.x;
                contentLocation = context.viewport.area.x;
            }

            if (location < contentLocation) {
                child.inputEnabled = false;
            }

            this.disableOutOfBounds(child.children, context, vertical);
        }
    }
};
