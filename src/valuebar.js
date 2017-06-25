var Phaser;

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
	this.bar.events.onInputUp.add(this.snapToClosestPosition, this);
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
			this.track.x - (this.bar.width / 2),
			this.track.y - ((this.bar.height - this.track.height) / 2),
			this.track.width + this.bar.width,
			this.bar.height
		);
	}
};

/** On mouse up, forces the value to equal the closest step. */
uiWidgets.ValueBar.prototype.snapToClosestPosition = function () {
	"use strict";
	var currentValue = this.valueRange.getCurrentValue();
	
	var diff = Math.abs(currentValue - this.valueRange.steps[0]);
	var currentPosition = this.valueRange.steps[0];
	
	for (var i = 0; i < this.valueRange.steps.length; i++) {
		var newdiff = Math.abs(currentValue - this.valueRange.steps[i]);
		if (newdiff < diff) {
			diff = newdiff;
			currentPosition = this.valueRange.steps[i];
		}
	}
	
	this.valueRange.adjustValue(currentPosition);
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
