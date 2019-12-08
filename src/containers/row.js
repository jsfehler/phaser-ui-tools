import { alignments } from '../const';
import { Frame } from './frame';

/** Frame that places new child nodes directly next to the previous child.
 * @extends Frame
 */
export class Row extends Frame {
    /**
     * @param {Object} game - Current game instance.
     * @param {Number} x - The x position of the Row.
     * @param {Number} y - The y position of the Row.
     * @param {string} bg - The background image to use.
     * @param {boolean} modal - If the Row should block external interaction until killed.
     */
    constructor(game, x = 0, y = 0, bg = null, modal = false) {
        super(game, x, y, bg, modal);
        this.alignment = alignments.RIGHT_CENTER;
    }
}
