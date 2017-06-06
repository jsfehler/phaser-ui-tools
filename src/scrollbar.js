var Phaser;

var uiWidgets = uiWidgets || {};

/** 
 * Used by the scrollbar to hold the bar's values.
 * @constructor
 * @param {number} step - The amount the bar is changed by.
 * @param {number} minValue - The minimum value the bar can have.
 * @param {number} maxValue - The maximum value the bar can have.
 */
uiWidgets.ValueRange = function (step, minValue, maxValue) {
	"use strict";
	this.step = step;
	this.minValue = minValue;
	this.maxValue = maxValue;
	
	this.ratio = step / maxValue;
	
	// The ratio between the step and max can't be greater than 1.
	// ie: There can't be more steps than the max value.
	if (this.ratio > 1) {
		this.ratio = 1;
	}
};

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
uiWidgets.Scrollbar = function (game, content, draggable, vertical, keyboard, trackImage, barImage, padding, tweenParams) {
    "use strict";
	this.game = game;
    this.content = content;
	
    this.vertical = vertical || false;
    this.draggable = draggable || false;
	keyboard = keyboard || false;
    
	if (keyboard) {
		this.enableKeyboard();
	}
	
	this.trackImage = trackImage;
	this.barImage = barImage;
	
	// Padding between content and scrollbar.
	padding = padding || 0;
	
	if (this.vertical) {
		this.x = this.content.x + this.content.width + padding;
		this.y = this.content.y;
	} else {
		this.x = this.content.x;
		this.y = this.content.y + this.content.height + padding;
	}
	
	// The smallest pixel size allowed for the bar.
	this.minBarSize = 44;
	
	// Animation
	this.tweenParams = tweenParams || {'duration': 300, 'ease': Phaser.Easing.Quadratic.Out};
	
	// Flag switched on when the track is clicked, switched off after the bar movement is finished.
	this.trackClicked = false;
	this.barMoving = false;
	
	// Records mouse pointer when clicking the bar.
	this.mousePointer = null;
	
	this.create();
};

uiWidgets.Scrollbar.prototype = {
    /** Enables keyboard input for the scrollbar */
	enableKeyboard: function () {
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
	},
	
	/** Allows the bar to scroll when the track is clicked. */
	enableTrackClick: function () {
		"use strict";
		this.track.inputEnabled = true;
		this.track.events.onInputDown.add(this.clickTrack, this);
	},
	
	create: function () {
        "use strict";

        this.track = this.game.add.sprite(this.x, this.y, this.trackImage);

        // Clicking the track will move the bar up or down.
        if (this.draggable) {
			this.enableTrackClick();
		}
		
        // Bar sprite.
		this.bar = this.game.add.button(
			this.track.x,
			this.track.y,
			this.barImage,
			this.moveContent,
			this,
			1,
			0
        );
		var verticalAttributes, horizontalAttributes;
		verticalAttributes = {
			"barDefaultX": this.track.x + (this.track.width / 2) - (this.bar.width / 2),
			"barDefaultY": this.track.y,
			"viewportSize": this.content.area.height,
			"containerSize": this.content.height,
			"barMaxSize": this.track.height
		};
		
		horizontalAttributes = {
			"barDefaultX": this.track.x,
			"barDefaultY": this.track.y + (this.track.height / 2) - (this.bar.height / 2),
			"viewportSize": this.content.area.width,
			"containerSize": this.content.width,
			"barMaxSize": this.track.width
		};
		
		var attributes;
		if (this.vertical) {
			attributes = verticalAttributes;
		} else {
			attributes = horizontalAttributes;
		}
		
        // Set default position for the bar. Center it on the non-moving axis inside the track.
        this.barDefaultX = attributes.barDefaultX;
        this.barDefaultY = attributes.barDefaultY;
        
        this.bar.x = this.barDefaultX;
        this.bar.y = this.barDefaultY;
		
		this.valueRange = new uiWidgets.ValueRange(attributes.viewportSize, attributes.barDefaultY, attributes.containerSize);

		//-- Set Bar Size --//
		var barSize = attributes.barMaxSize * this.valueRange.ratio;
		
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

		//-- Enable mouse dragging on the bar. --//
        if (this.draggable) {
            this.bar.inputEnabled = true;
            this.bar.input.enableDrag();
			this.bar.events.onInputDown.add(this.saveMousePosition, this);
			this.bar.events.onDragUpdate.add(this.moveContent, this);
			
			// Limit the bar's draggable area to within the track.
			if (this.vertical) {
				this.bar.input.allowHorizontalDrag = false;
				this.bar.input.boundsRect = new Phaser.Rectangle(
					this.track.x,
					this.track.y,
					this.track.x,
					this.track.height
				);
			} else {
				this.bar.input.allowVerticalDrag = false;
				this.bar.input.boundsRect = new Phaser.Rectangle(
					this.track.x,
					this.track.y,
					this.track.width,
					this.track.y
				);
			}
		}
		
		// Determine the distance the window can scroll over
		this.windowScrollAreaSize = this.valueRange.maxValue - this.valueRange.step;
		
		// Determine the distance the bar can scroll over
		if (this.vertical) {
			this.trackScrollAreaSize = this.track.height - this.bar.height;
		} else {
			this.trackScrollAreaSize = this.track.width - this.bar.width;
		}
    },
    
    resetPosition: function () {
        "use strict";
        this.bar.x = this.barDefaultX;
        this.bar.y = this.barDefaultY;
    },
    
	/** Creates the tween for moving the bar to a new position. */
	_addScrollTween: function (properties) {
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
	},
	
	/** For Vertical Scrollbars. Scrolls the content up by one window. */
    scrollUp: function () {
        "use strict";
        // Prevents users from moving the bar while it's moving.
		if (this.bar.y !== this.track.y && !this.barMoving) {
			var slice = (this.track.height * this.valueRange.ratio);
			var testPosition = this.bar.y - slice;
			var moveToY = null;
			this.barMoving = true;
			
			// Ensure the bar can't move above the track.
			if (testPosition <= this.track.y) {
				moveToY = this.track.y;
			} else {
				moveToY = this.bar.y - slice;
			}

			this._addScrollTween({y: moveToY});
		}
    },
    
	/** For Vertical Scrollbars. Scrolls the content down by one window. */
    scrollDown: function () {
        "use strict";
		if (this.bar.y + this.bar.height !== this.track.y + this.track.height && !this.barMoving) {
			var slice = (this.track.height * this.valueRange.ratio);
			var testPosition = this.bar.y + (slice * 2);
			var moveToY = null;
			this.barMoving = true;
			this.bar.inputEnabled = false;
			// Ensure the bar can't move below the track.
			if (testPosition >= this.track.y + this.track.height) {
				moveToY = this.track.y + this.track.height - this.bar.height;
			} else {
				moveToY = this.bar.y + slice;
			}

			this._addScrollTween({y: moveToY});
		}
    },
	
	/** For Horizontal Scrollbars. Scrolls the content left by one window. */
	scrollLeft: function () {
        "use strict";
        if (this.bar.x !== this.track.x && !this.barMoving) {
			var slice = (this.track.width * this.valueRange.ratio);
			var testPosition = this.bar.x - slice;
			var moveToX = null;
			this.barMoving = true;
			this.bar.inputEnabled = false;

			// Ensure the bar can't move above the track.
			if (testPosition <= this.track.x) {
				moveToX = this.track.x;
			} else {
				moveToX = this.bar.x - slice;
			}

			this._addScrollTween({x: moveToX});
		}
    },
	
	/** For Horizontal Scrollbars. Scrolls the content right by one window. */
	scrollRight: function () {
        "use strict";
		if (this.bar.x + this.bar.width !== this.track.x + this.track.width && !this.barMoving) {
			var slice = (this.track.width * this.valueRange.ratio);
			
			var testPosition = this.bar.x + (slice * 2);
			var moveToX = null;
			this.barMoving = true;
			this.bar.inputEnabled = false;
			
			// Ensure the bar can't move below the track.
			if (testPosition >= this.track.x + this.track.width) {
				moveToX = this.track.x + this.track.width - this.bar.width;
			} else {
				moveToX = this.bar.x + slice;
			}

			this._addScrollTween({x: moveToX});
		}
    },
	
	/** When called, ensures the bar can be moved. Must be called once the bar has finished scrolling. */
	enableBarInput: function () {
		"use strict";
		this.trackClicked = false;
		this.barMoving = false;
		this.bar.inputEnabled = true;
	},
	
	/** If the scrollbar is draggable, this function is called when the track is clicked. */
    clickTrack: function (sprite, pointer) {
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
    },
    
	saveMousePosition: function (sprite, pointer) {
		"use strict";
		// Record where the mouse clicked down.
		this.mousePointer = {"x": pointer.x, "y": pointer.y};
	},
	
	getBarPosition: function () {
		"use strict";
		var currentArea;
		
		if (this.vertical) {
			// y - an offset for where the viewport is on screen.
			currentArea = this.content.y - this.content.area.y;
		} else {
			currentArea = this.content.x - this.content.area.x;
		}
		var windowPositionRatio = currentArea / this.windowScrollAreaSize;
		return this.trackScrollAreaSize * windowPositionRatio;
	},
	
	getMouseDelta: function () {
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
			maxValue = this.track.height + this.track.y;
		} else {
			maxValue = this.track.width + this.track.x;
		}

		if (newMousePosition < maxValue) {
			mousePositionDelta = oldMousePosition - newMousePosition;
		} else {
			mousePositionDelta = 0;
		}
		
		return mousePositionDelta;
	},

	getGripPositionRatio: function () {
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

	},
	
	/** Called when the scrollbar needs to move the viewport. Causes the content to move relative to the bar's position on the track. */
    moveContent: function () {
        "use strict";
		var newGripPositionRatio = this.getGripPositionRatio();

		var newContentPosition = newGripPositionRatio * this.windowScrollAreaSize;
		
		// Set the content's new position. Uses an offset for where the viewport is on screen.
		if (this.vertical) {
			this.content.y = newContentPosition + this.content.area.y;
		} else {
			this.content.x = newContentPosition + this.content.area.x;
			
		}

		this.content.disableOutOfBounds(this.content.children, this, this.vertical);
    }
};
