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
     * @param {boolean} modal - If the Frame should block external interaction until killed.
     */
    constructor(game, x = 0, y = 0, bg = null, modal = false) {
        super(game);
        game.add.existing(this);

        this.x = x;
        this.y = y;

        this.uiWidgetsObjectRole = 'layout';

        this.modal = modal;

        this.background = null;
        this.back = null;

        if (modal) {
            // Create a sprite to use as the modal back.
            const texture = new PhaserObjects.Graphics(game, { x: 0, y: 0 });
            texture.fillStyle(0xffffff, 1);
            texture.fillRect(0, 0, game.scale.width, game.scale.height);

            let modalBack;
            if (this.version === 3) {
                texture.generateTexture('modalBack');
                modalBack = 'modalBack';
            } else {
                modalBack = texture.generateTexture();
            }

            this.back = new PhaserObjects.Sprite(game, 0, 0, modalBack);
            this.back.setInteractive();
            this.back.setOrigin(0, 0);
            // CE requirement
            this.back.moveDown();

            // Mask the back, causing it to be invisible.
            const backMask = new PhaserObjects.ViewportMask(game, 0, 0);
            this.back.mask = backMask.create(0, 0, 0, 0);

            game.add.existing(this.back);

            // Ensure the modal doesn't hide the Frame's content.
            this.depth = 9999;
            this.back.depth = 9998;
        }

        if (bg !== null) {
            this.background = new PhaserObjects.Sprite(game, 0, 0, bg);
            game.add.existing(this.background);
            this.background.sendToBack();
            this.background.alignIn(this, alignments.TOP_LEFT);
        }
    }

    /** Destroy the Frame, along with any background or modal effect. */
    dismiss() {
        if (this.modal) {
            this.back.destroy();
        }

        if (this.background !== null) {
            this.background.destroy();
        }

        this.destroy();
    }

    /** Adds a new object into the Frame, then aligns it with the previous object.
     * @param {Object} node - The object to add to the Frame.
     * @param {number} paddingX - The amount of horizontal space between objects.
     * @param {number} paddingY - The amount of vertical space between objects.
     * @param {number} alignment - The alignment relative to the previous child.
     */
    addNode(node, paddingX = 0, paddingY = 0, alignment = null) {
        const align = alignment || this.alignment;

        if (!(node instanceof PhaserObjects.Group)) {
            node.displayOriginX = 0; // eslint-disable-line
            node.displayOriginY = 0; // eslint-disable-line
        }

        this.add(node);
        this.alignNodeToPrevious(node, align, paddingX, paddingY);
        node.parentContainer = this;  // eslint-disable-line

        // Reset the positions for the bar's draggable area.
        if ('enableBarDrag' in node) {
            node.enableBarDrag();
        }
    }
}
