/** Used by a QuantityBar to hold the bar's values. */
export class QuantityRange {
    /**
     * @param {number} bar - The QuantityBar object that uses the range.
     * @param {number} startValue - The initial value for the bar.
     * @param {number} maxValue - The maximum value the bar can have.
     */
    constructor(bar, startValue, maxValue) {
        this.bar = bar;
        this.startValue = startValue;
        this.maxValue = maxValue;

        this.currentValue = startValue;
    }

    /** Returns the current ratio for how large the bar is compared to the track. */
    getRatio() {
        const ratio = this.currentValue / this.maxValue;
        return ratio;
    }

    /** Returns the bar's current value. */
    getCurrentValue() {
        return this.currentValue;
    }
}

/** Used by a ValueBar to hold the bar's values. */
export class ValueRange {
    /**
     * @param {number} step - The amount the bar is changed by.
     * @param {number} startValue - The initial value for the bar.
     * @param {number} maxValue - The maximum value the bar can have.
     */
    constructor(step, startValue, maxValue) {
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
        for (let i = 0; i < this.maxValue; i += step) {
            this.steps.push(i);
        }
    }

    /** Adjusts the current value for the bar.
     * @param {number} newValue - The new current value.
     */
    adjustValue(newValue) {
        this.currentValue = newValue;
    }

    /** Returns the bar's current value. */
    getCurrentValue() {
        return this.currentValue;
    }
}

/** Used by a Scrollbar to hold the values and adjust a viewport's position. */
export class ViewportRange {
    /**
     * @param {Object} viewport - The viewport to adjust.
     * @param {boolean} vertical - If the viewport is vertical or horizontal.
     */
    constructor(viewport, vertical) {
        this.viewport = viewport;
        this.vertical = vertical;

        if (vertical) {
            this.step = viewport.area.height;
            this.maxValue = viewport.realHeight;
        } else {
            this.step = viewport.area.width;
            this.maxValue = viewport.realWidth;
        }

        this.ratio = this.step / this.maxValue;

        // The ratio between the step and max can't be greater than 1.
        // ie: There can't be more steps than the max value.
        if (this.ratio > 1) {
            this.ratio = 1;
        }
    }

    /** Adjusts the viewport's position. */
    adjustValue(newValue) {
        // Set the content's new position. Uses an offset for where the viewport is on screen.
        if (this.vertical) {
            this.viewport.y = newValue + this.viewport.area.y;
        } else {
            this.viewport.x = newValue + this.viewport.area.x;
        }

        this.viewport.disableOutOfBounds(
            this.viewport.children,
            this,
            this.vertical,
        );
    }

    getCurrentValue() {
        let currentValue;
        if (this.vertical) {
            // y - an offset for where the viewport is on screen.
            currentValue = this.viewport.y - this.viewport.area.y;
        } else {
            currentValue = this.viewport.x - this.viewport.area.x;
        }

        return currentValue;
    }
}
