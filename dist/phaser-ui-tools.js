var Phaser;

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
 * @param callback - Callback to use when the button is clicked.
 * @param callbackContext {Object} - The context is the callback is called in.
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
 * @param {Object} game
 * @param context
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
 * Group that places new child nodes directly next to the previous child.
 * @constructor
 * @param {Object} game
 * @param context
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
 * Creates a bar that moves along a track. The bar is resized relative to the size of the track and size of the content to be scrolled.
 * @constructor
 * @param game
 * @param content - Anything that you want to move via the scrollbar.
 * @param {boolean} draggable
 * @param {boolean} vertical - Determines if the scrollbar should be vertical or horizontal.
 * @param {boolean} keyboard
 * @param trackImage
 * @param barImage
 */
uiWidgets.Scrollbar = function (game, content, draggable, vertical, keyboard, trackImage, barImage) {
    "use strict";
    // Reference to the game.
	this.game = game;
	
	// The content to be scrolled.
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
	var padding = 10;
	
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
    this.tweenTiming = 300;
    this.tweenEasing = Phaser.Easing.Quadratic.Out;

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
		
		var verticalAttributes = {
			"barDefaultX": this.track.x + (this.track.width / 2) - (this.bar.width / 2),
			"barDefaultY": this.track.y,
			"viewportSize": this.content.area.height,
			"containerSize": this.content.height,
			"barMaxSize": this.track.height
		};
		
		var horizontalAttributes = {
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
		
		var windowContentRatio = attributes.viewportSize / attributes.containerSize;

		//-- Set Bar Size --//
		// Prevents bar from being larger than the track.
		if (windowContentRatio > 1) {
			windowContentRatio = 1;
		}
		
		var barSize = attributes.barMaxSize * windowContentRatio;

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

		//-- Enable mouse dragging --//
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
		this.windowScrollAreaSize = attributes.containerSize - attributes.viewportSize;
		
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
    
    scrollUp: function () {
        "use strict";
        // Prevents users from moving the bar while it's moving.
		if (this.bar.y !== this.track.y && !this.barMoving) {
			var testPosition = this.bar.y - this.bar.height;
			var moveToY = null;
			this.barMoving = true;
			
			// Ensure the bar can't move above the track.
			if (testPosition <= this.track.y) {
				moveToY = this.track.y;
			} else {
				moveToY = this.bar.y - this.bar.height;
			}

			var up = this.game.add.tween(this.bar).to(
				{y: moveToY},
				this.tweenTiming,
				this.tweenEasing,
				true
			);

			this.mousePointer = {"x": this.bar.x, "y": this.bar.y};
			this.trackClicked = true;
			up.onUpdateCallback(this.moveContent, this);
			up.onComplete.add(this.enableBarInput, this);
		}
    },
    
    scrollDown: function () {
        "use strict";
		if (this.bar.y + this.bar.height !== this.track.y + this.track.height && !this.barMoving) {
			var testPosition = this.bar.y + this.bar.height * 2;
			var moveToY = null;
			this.barMoving = true;
			this.bar.inputEnabled = false;
			// Ensure the bar can't move below the track.
			if (testPosition >= this.track.y + this.track.height) {
				moveToY = this.track.y + this.track.height - this.bar.height;
			} else {
				moveToY = this.bar.y + this.bar.height;
			}

			var down = this.game.add.tween(this.bar).to(
				{y: moveToY},
				this.tweenTiming,
				this.tweenEasing,
				true
			);

			this.mousePointer = {"x": this.bar.x, "y": this.bar.y};
			this.trackClicked = true;
			down.onUpdateCallback(this.moveContent, this);
			down.onComplete.add(this.enableBarInput, this);
		}
    },

	scrollLeft: function () {
        "use strict";
        if (this.bar.x !== this.track.x && !this.barMoving) {
			var testPosition = this.bar.x - this.bar.width;
			var moveToX = null;

			// Ensure the bar can't move above the track.
			if (testPosition <= this.track.x) {
				moveToX = this.track.x;
			} else {
				moveToX = this.bar.x - this.bar.width;
			}

			var left = this.game.add.tween(this.bar).to(
				{x: moveToX},
				this.tweenTiming,
				this.tweenEasing,
				true
			);

			this.mousePointer = {"x": this.bar.x, "y": this.bar.y};
			this.trackClicked = true;
			left.onUpdateCallback(this.moveContent, this);
			left.onComplete.add(this.enableBarInput, this);
		}
    },
	
	scrollRight: function () {
        "use strict";
		if (this.bar.x + this.bar.width !== this.track.x + this.track.width && !this.barMoving) {
			var testPosition = this.bar.x + this.bar.width * 2;
			var moveToX = null;

			// Ensure the bar can't move below the track.
			if (testPosition >= this.track.x + this.track.width) {
				moveToX = this.track.x + this.track.width - this.bar.width;
			} else {
				moveToX = this.bar.x + this.bar.width;
			}

			var right = this.game.add.tween(this.bar).to(
				{x: moveToX},
				this.tweenTiming,
				this.tweenEasing,
				true
			);

			this.mousePointer = {"x": this.bar.x, "y": this.bar.y};
			this.trackClicked = true;
			right.onUpdateCallback(this.moveContent, this);
			right.onComplete.add(this.enableBarInput, this);
		}
    },
	
	enableBarInput: function () {
		this.trackClicked = false;
		this.barMoving = false;
		this.bar.inputEnabled = true;
	},
	
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
		// If the bar is draggable, record where the mouse clicked down.
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
	
    moveContent: function () {
        "use strict";
		var gripPositionOnTrack = this.getBarPosition();

		var oldMousePosition, newMousePosition, newMousePointer;
		
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
		
		// Only update when the new position is inside the track
		var maxValue;
		if (this.vertical) {
			maxValue = this.track.height;
		} else {
			maxValue = this.track.width;
		}
		
		var mousePositionDelta;
		if (newMousePosition < maxValue) {
			mousePositionDelta = oldMousePosition - newMousePosition;
		} else {
			mousePositionDelta = 0;
		}

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

		var newContentPosition = newGripPositionRatio * this.windowScrollAreaSize;
		
		// Needs an offset for where the viewport is on screen.
		if (this.vertical) {
			this.content.y = newContentPosition + this.content.area.y;
		} else {
			this.content.x = newContentPosition + this.content.area.x;
			
		}

		disableOutOfBounds(this.content.children, this, this.vertical);
		
    }
};

// Whenever the content is moved, disable input for all objets outside the viewport.
var disableOutOfBounds = function (content, context, vertical) {
	"use strict";
	// Makes sure the recursive function stops when there's no children.
	if (content !== undefined) {
		for (var i=0; i < content.length; i++) {
				var child = content[i];

				child.inputEnabled = true;

				// An object's x/y is relative to it's parent.
				// The world gives an x/y relative to the whole game.
				var trueCoords = child.world || child;	

				var location, contentLocation;
				if (vertical) {
					location = trueCoords.y;
					contentLocation = context.content.area.y;
				} else {
					location = trueCoords.x;
					contentLocation = context.content.area.x;
				}
			
				if (location < contentLocation) {
					child.inputEnabled = false;
				}
			
				disableOutOfBounds(child.children, context, vertical);

		}
	}
};;var Phaser;

var uiWidgets = uiWidgets || {};


/** 
 * A container for other objects with a limited viewable area. 
 * @constructor
 * @param game
 * @param x
 * @param y
 * @param width
 * @param height
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

uiWidgets.Viewport.prototype.addNode = function (node) {
	"use strict";
	this.add(node);
};
