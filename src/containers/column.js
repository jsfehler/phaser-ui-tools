var uiWidgets;
uiWidgets = uiWidgets || {};

/**
 * Frame that places new child nodes directly under the previous child.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {Number} x - The x position of the Frame.
 * @param {Number} y - The y position of the Frame.
 * @param {string} bg - The background image to use.
 */
uiWidgets.Column = function (game, x, y, bg) {
    "use strict";
    uiWidgets.Frame.apply(this, arguments);
};

uiWidgets.Column.prototype = Object.create(uiWidgets.Frame.prototype);
uiWidgets.Column.constructor = uiWidgets.Column;

uiWidgets.Column.prototype.alignment = Phaser.BOTTOM_CENTER;
