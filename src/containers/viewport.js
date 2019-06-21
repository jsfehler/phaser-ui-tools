import * as PhaserObjects from '../phaserObjects';

/**
 * A container with a limited viewable area. Uses a mask to hide children outside of the specified x/y/width/height area.
 * Content outside the viewport has their input disabled.
 * @extends PhaserObjects.Group
 */
export class Viewport extends PhaserObjects.Group {
    /**
     * @param {Object} game - Current game instance.
     * @param {number} x - The x coordinate on screen where the viewport will be placed.
     * @param {number} y - The y coordinate on screen where the viewport will be placed.
     * @param {number} width - The width of the viewport.
     * @param {number} height - The height of the viewport.
     */
    constructor(game, x, y, width, height) {
        super(game);

        this.x = x;
        this.y = y;

        // Viewport size and position, distinct from the total window size.
        this.area = {
            x,
            y,
            width,
            height,
        };

        // Adding the mask attribute to a group hides objects outside the mask.
        this.mask = game.add.graphics(this.area.x, this.area.y);
        this.mask.beginFill(0x0000ff);
        this.mask.drawRect(0, 0, width, height);
        this.mask.endFill();
    }

    /** Adds a new object into the Viewport.
    * @param {Object} node - The object to add to the Viewport.
    */
    addNode(node) {
        this.add(node);
    }

    /** Disable input for all objets outside the viewport's visible area.
     * Recursively checks all the object's children.
     * @param {Object} children - The objects to disable, if they're outside the viewport.
     * @param {Object} context - The context the function is run in.
     * @param {boolean} vertical - If the bounds should be checked horizontally or vertically.
     */
    disableOutOfBounds(children, context, vertical) {
        let child;
        let location;
        let contentLocation;
        let trueCoords;

        // Makes sure the recursive function stops when there's no children.
        if (children !== undefined) {
            for (let i = 0; i < children.length; i++) {
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
    }
}
