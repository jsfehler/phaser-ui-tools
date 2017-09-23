var uiWidgets = uiWidgets || {};

/**
 * Frame that places new child nodes directly next to the previous child.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {Object} context - The context this object is called in.
 */
uiWidgets.Row = function (game, x, y, bg) {
    "use strict";
    uiWidgets.Frame.apply(this, arguments);
};

uiWidgets.Row.prototype = Object.create(uiWidgets.Frame.prototype);
uiWidgets.Row.constructor = uiWidgets.Row;

/** Adds a new object into the Row, then aligns it next to the previous object.
 * @param {Object} node - The sprite to add to the row.
 * @param {Number} alignment - The alignment relative to the previous child.
 */
uiWidgets.Row.prototype.addNode = function (node, alignment) {
    "use strict";
    alignment = alignment || Phaser.RIGHT_CENTER;

    this.add(node);
    var previousNode = this.children[this.children.length - 2];

    if (previousNode !== undefined) {
        node.alignTo(previousNode, alignment);
    }

    // Reset the positions for the bar's draggable area.
    if ("enableBarDrag" in node) {
        node.enableBarDrag();
    }

};
