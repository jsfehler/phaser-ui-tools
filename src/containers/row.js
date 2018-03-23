var uiWidgets;
uiWidgets = uiWidgets || {};

/**
 * Frame that places new child nodes directly next to the previous child.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {Number} x - The x position of the Frame.
 * @param {Number} y - The y position of the Frame.
 * @param {string} bg - The background image to use.
 */
uiWidgets.Row = function (game, x, y, bg) {
    "use strict";
    uiWidgets.Frame.apply(this, arguments);
};

uiWidgets.Row.prototype = Object.create(uiWidgets.Frame.prototype);
uiWidgets.Row.constructor = uiWidgets.Row;

uiWidgets.Row.prototype.alignment = Phaser.RIGHT_CENTER;
