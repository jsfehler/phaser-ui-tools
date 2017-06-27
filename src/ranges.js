var Phaser;

var uiWidgets = uiWidgets || {};


/** Used by a QuantityBar to hold the bar's values.
 * @constructor
 */
uiWidgets.QuantityRange = function (bar, startValue, maxValue) {
	"use strict";
	this.bar = bar;
	this.startValue = startValue;
	this.maxValue = maxValue;

	this.currentValue = startValue;
};


/** Returns the current ratio for how big the bar is compared to the track. */
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
