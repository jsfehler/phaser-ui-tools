import { alignments } from '../const';
import * as PhaserObjects from '../phaserObjects';

/** Group with a dedicated background image.
 * @extends Phaser.Group
 */
export class Frame extends PhaserObjects.Group {
    /**
     * @param {Object} game - Current game instance.
     * @param {number} x - The x position of the Frame.
     * @param {number} y - The y position of the Frame.
     * @param {string} bg - The background image to use.
     */
    constructor(game, x = 0, y = 0, bg = null) {
        super(game);

        this.x = x;
        this.y = y;

        this.background = null;

        // Add background to Frame.
        if (bg !== null) {
            this.background = new PhaserObjects.Sprite(game, 0, 0, bg);
            game.add.existing(this.background);
            this.background.sendToBack();
            this.background.alignIn(this, alignments.TOP_LEFT);
        }
    }

    /** Adds a new object into the Frame, then aligns it with the previous object.
     * @param {Object} node - The object to add to the Frame.
     * @param {number} paddingX - The amount of horizontal space between objects.
     * @param {number} paddingY - The amount of vertical space between objects.
     * @param {number} alignment - The alignment relative to the previous child.
     */
    addNode(node, paddingX = 0, paddingY = 0, alignment = null) {
        const align = alignment || this.alignment;

        this.add(node);
        const previousNode = this.children[this.children.length - 2];

        if (previousNode !== undefined) {
            node.alignTo(previousNode, align, paddingX, paddingY);
        }

        // Reset the positions for the bar's draggable area.
        if ('enableBarDrag' in node) {
            node.enableBarDrag();
        }
    }
}
