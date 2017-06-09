var Phaser;

var uiWidgets = uiWidgets || {};

/**
 * Creates a bar that moves along a track. The bar is resized relative to the size of the track and size of the content to be scrolled. Content outside the viewport has input disabled.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {Object} content - Anything that you want to move via the scrollbar.
 * @param {boolean} draggable - Determines if the scrollbar responds to mouse clicks.
 * @param {boolean} vertical - Determines if the scrollbar should be vertical or horizontal.
 * @param {boolean} keyboard - Determines if the scrollbar responds to keyboard input.
 * @param {string} trackImage - The image key to use for the track.
 * @param {string} barImage - The image key to use for the bar. Will be automatically resized to fit.
 * @param {number} padding - Distance in pixels between the scrollbar and viewport.
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

	// Animation
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
	
	this.create();
};

uiWidgets.Scrollbar.prototype = Object.create(Phaser.Group.prototype);
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

/** Allows the bar to scroll when the track is clicked. */
uiWidgets.Scrollbar.prototype.enableTrackClick = function () {
	"use strict";
	this.track.inputEnabled = true;
	this.track.events.onInputDown.add(this.clickTrack, this);
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

/** Enables clicking and dragging on the bar. */
uiWidgets.Scrollbar.prototype.enableBarDrag = function () {
	"use strict";
	this.bar.inputEnabled = true;
	this.bar.input.enableDrag();
	this.bar.events.onInputDown.add(this.saveMousePosition, this);
	this.bar.events.onDragUpdate.add(this.moveContent, this);

	if (this.vertical) {
		this.setDraggableArea(
			this.track.x - ((this.bar.width - this.track.width) / 2),
			this.track.y,
			this.bar.width,
			this.track.height);
	} else {
		this.setDraggableArea(
			this.track.x,
			this.track.y - ((this.bar.height - this.track.height) / 2),
			this.track.width,
			this.bar.height
		);
	}
};

/** Determine the distance the bar can scroll over */
uiWidgets.Scrollbar.prototype.setTrackScrollAreaSize = function () {
	"use strict";

	if (this.vertical) {
		this.trackScrollAreaSize = this.track.height - this.vslice;
	} else {
		this.trackScrollAreaSize = this.track.width - this.hslice;
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

/** Sets size of the bar's draggable area. */
uiWidgets.Scrollbar.prototype.setDraggableArea = function (x, y, w, h) {
	"use strict";
	// Limit the bar's draggable area to within the track.
	if (this.vertical) {
		this.bar.input.allowHorizontalDrag = false;
	} else {
		this.bar.input.allowVerticalDrag = false;
	}
	
	this.bar.input.boundsRect = new Phaser.Rectangle(x, y, w, h);
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

/** Sets position for the bar's non-moving axis. Centers it inside the track. */
uiWidgets.Scrollbar.prototype.centerStaticAxis = function () {
	"use strict";
	if (this.vertical) {
		this.bar.x = this.track.x + (this.track.width / 2) - (this.bar.width / 2);
	} else {
		this.bar.y = this.track.y + (this.track.height / 2) - (this.bar.height / 2);
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
			moveToY = this.track.y;
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
			moveToY = this.track.y + this.track.height - this.bar.height;
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
			moveToX = this.track.x;
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
			moveToX = this.track.x + this.track.width - this.bar.width;
		} else {
			moveToX = this.bar.x + this.hslice;
		}

		this.addScrollTween({x: moveToX});
	}
};

/** When called, ensures the bar can be moved. Must be called once the bar has finished scrolling. */
uiWidgets.Scrollbar.prototype.enableBarInput = function () {
	"use strict";
	this.trackClicked = false;
	this.barMoving = false;
	this.bar.inputEnabled = true;
};

/** If the scrollbar is draggable, this function is called when the track is clicked. */
uiWidgets.Scrollbar.prototype.clickTrack = function (sprite, pointer) {
	"use strict";

	if (this.vertical) {
		// Don't register mouse clicks on the bar itself.
		if (this.game.input.mousePointer.y > this.bar.y + this.bar.height) {
			this.scrollDown();
		} else if (this.game.input.mousePointer.y < this.bar.y + this.bar.height) {
			this.scrollUp();
		}
	} else {
		// Don't register mouse clicks on the bar itself.
		if (this.game.input.mousePointer.x > this.bar.x + this.bar.width) {
			this.scrollRight();
		} else if (this.game.input.mousePointer.x < this.bar.x + this.bar.width) {
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

/** 
 * Bar that adjusts a number. 
 * @constructor
 */
uiWidgets.ValueBar = function (game, xy, step, startValue, maxValue, draggable, vertical, keyboard, trackImage, barImage, tweenParams) {
	"use strict";
    Phaser.Group.call(this, game);
    game.add.existing(this);

	this.game = game;
    this.x = xy.x;
	this.y = xy.y;
	
	this.valueRange = new uiWidgets.ValueRange(step, startValue, maxValue);

    this.vertical = vertical || false;
    this.draggable = draggable || false;
	keyboard = keyboard || false;

	if (keyboard) {
		this.enableKeyboard();
	}

	this.trackImage = trackImage;
	this.barImage = barImage;

	// Animation
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
	
	// Make sure the bar is physically where it should be.
	// The bar should always be in centered on it's current position.
	if (this.vertical) {
		this.bar.y = gripPositionOnTrack + this.track.y - (this.bar.height / 2);
	} else {
		this.bar.x = gripPositionOnTrack + this.track.x - (this.bar.width / 2);
	}
	
};

/** Enables clicking and dragging on the bar. */
uiWidgets.ValueBar.prototype.enableBarDrag = function () {
	"use strict";
	this.bar.inputEnabled = true;
	this.bar.input.enableDrag();
	this.bar.events.onInputDown.add(this.saveMousePosition, this);
	this.bar.events.onDragUpdate.add(this.moveContent, this);

	if (this.vertical) {
		this.setDraggableArea(
			this.track.x - ((this.bar.width - this.track.width) / 2),
			this.track.y,
			this.bar.width,
			this.track.height + this.bar.height
		);
	} else {
		this.setDraggableArea(
			this.track.x - (this.bar.width/2),
			this.track.y - ((this.bar.height - this.track.height) / 2),
			this.track.width + this.bar.width,
			this.bar.height
		);
	}
};

/** Creates the tween for moving the bar to a new position. */
uiWidgets.ValueBar.prototype.addScrollTween = function (properties) {
	"use strict";
	this.mousePointer = {"x": this.bar.x, "y": this.bar.y};
	this.trackClicked = true;

	var newTween;
	newTween = this.game.add.tween(this.bar).to(
		properties,
		100,
		this.tweenParams.ease,
		true
	);

	// Only update the values once the bar has finished moving.
	newTween.onComplete.add(this.moveContent, this);
	newTween.onComplete.add(this.enableBarInput, this);
};


/** For Vertical Scrollbars. Scrolls up by one step. */
uiWidgets.ValueBar.prototype.scrollUp = function () {
	"use strict";
	// Prevents users from moving the bar while it's moving.
	if (this.bar.y !== this.track.y && !this.barMoving) {
		var moveToY = null;
		this.barMoving = true;

		moveToY = this.bar.y - this.vslice;

		this.addScrollTween({y: moveToY});
	}
};

/** For Vertical Scrollbars. Scrolls down by one step. */
uiWidgets.ValueBar.prototype.scrollDown = function () {
	"use strict";
	if (this.bar.y + this.bar.height !== this.track.y + this.track.height && !this.barMoving) {
		var moveToY = null;
		this.barMoving = true;
		this.bar.inputEnabled = false;

		moveToY = this.bar.y + this.vslice;

		this.addScrollTween({y: moveToY});
	}
};

/** For Horizontal Scrollbars. Scrolls left by one step. */
uiWidgets.ValueBar.prototype.scrollLeft = function () {
	"use strict";
	if (this.bar.x !== this.track.x && !this.barMoving) {
		var moveToX = null;
		this.barMoving = true;
		this.bar.inputEnabled = false;

		moveToX = this.bar.x - this.hslice;

		this.addScrollTween({x: moveToX});
	}
};

/** For Horizontal Scrollbars. Scrolls right by one step. */
uiWidgets.ValueBar.prototype.scrollRight = function () {
	"use strict";
	if (this.bar.x + this.bar.width !== this.track.x + this.track.width && !this.barMoving) {
		var moveToX = null;
		this.barMoving = true;
		this.bar.inputEnabled = false;

		moveToX = this.bar.x + this.hslice;

		this.addScrollTween({x: moveToX});
	}
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