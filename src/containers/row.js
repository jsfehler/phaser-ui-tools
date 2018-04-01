import { Frame } from './frame';


/** Frame that places new child nodes directly next to the previous child.
 * @extends Frame
 */
export class Row extends Frame {
    /**
     * @param {Object} game - Current game instance.
     * @param {Number} x - The x position of the Frame.
     * @param {Number} y - The y position of the Frame.
     * @param {string} bg - The background image to use.
     */
    constructor(game, x = 0, y = 0, bg = 0) {
        super(game, x, y, bg);
        this.alignment = Phaser.RIGHT_CENTER;
    }
}
