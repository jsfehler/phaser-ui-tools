var uiWidgets;
uiWidgets = uiWidgets || {};

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

    this.tweenParams = tweenParams || {"duration": 300, "ease": Phaser.Easing.Quadratic.Out};

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

    var mask = this.game.add.graphics(this.maskX, this.maskY);
    mask.beginFill(0x0000ff);
    mask.drawRect(0, 0, this.maskW, this.maskH);
    //mask.endFill();

    this.bar.mask = mask;

    this.add(mask);
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
    this.maskX = this.bar.x;
    this.maskY = this.bar.y;

    // Resizes the bar.
    if (this.vertical) {
        this.maskH = this.getBarSize();
    } else {
        this.maskW = this.getBarSize();
    }

    if (this.reverse) {
        if (this.vertical) {
            this.maskY = this.getBarFraction();
        } else {
            this.maskX = this.getBarFraction();
        }
    }

    this.setMask();

    // Determine the distance the window can scroll over
    this.windowScrollAreaSize = this.valueRange.maxValue;

    // Represents one fraction of the track.
    this.vslice = (this.track.height * this.valueRange.getRatio());
    this.hslice = (this.track.width * this.valueRange.getRatio());

    this.setTrackScrollAreaSize();
};

/** Creates the tween for adjusting the size of the mask.
 * @param {Object} properties - Values for the tween's movement.
 */
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

/** Adjusts the bar by a given value.
 * @param {number} newValue - The value to adjust the bar by.
 */
uiWidgets.QuantityBar.prototype.adjustBar = function (newValue) {
    "use strict";
    this.valueRange.currentValue += newValue;

    var tween;

    var barSize = this.getBarSize();

    if (this.reverse) {
        if (this.vertical) {
            tween = {height: barSize, y: this.getBarFraction()};
        } else {
            tween = {width: barSize, x: this.getBarFraction()};
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
};
