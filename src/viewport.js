var Phaser;

var uiWidgets = uiWidgets || {};


/**
 * A container for other objects with a limited viewable area. Uses a mask to hide children outside of the specified x/y/width/height area.
 * Content outside the viewport has their input disabled.
 * @constructor
 * @param {Object} game - Current game instance.
 * @param {number} x - The x coordinate on screen where the viewport will be placed.
 * @param {number} y - The y coordinate on screen where the viewport will be placed.
 * @param {number} width - The width of the viewport.
 * @param {number} height - The height of the viewport.
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

/** Adds a new object into the Viewport. */
uiWidgets.Viewport.prototype.addNode = function (node) {
    "use strict";
    this.add(node);
};


/** Disable input for all objets outside the viewport's visible area. */
uiWidgets.Viewport.prototype.disableOutOfBounds = function (children, context, vertical) {
    "use strict";
    var child, location, contentLocation, trueCoords;

    // Makes sure the recursive function stops when there's no children.
    if (children !== undefined) {
        for (var i = 0; i < children.length; i++) {
            child = children[i];
            child.inputEnabled = true;

            // An object's x/y is relative to it's parent.
            // The world gives an x/y relative to the whole game.
            trueCoords = child.world || child;

            if (vertical) {
                location = trueCoords.y;
                contentLocation = context.viewport.area.y;
            } else {
                location = trueCoords.x;
                contentLocation = context.viewport.area.x;
            }

            if (location < contentLocation) {
                child.inputEnabled = false;
            }

            this.disableOutOfBounds(child.children, context, vertical);
        }
    }
};
