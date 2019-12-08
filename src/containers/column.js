import { alignments } from '../const';
import { Frame } from './frame';

/** Frame that places new child nodes directly under the previous child.
 * @extends Frame
 */
export class Column extends Frame {
    /**
     * @param {Object} game - Current game instance.
     * @param {Number} x - The x position of the Column.
     * @param {Number} y - The y position of the Column.
     * @param {string} bg - The background image to use.
     * @param {boolean} modal - If the Column should block external interaction until killed.
     */
    constructor(game, x = 0, y = 0, bg = null, modal = false) {
        super(game, x, y, bg, modal);
        this.alignment = alignments.BOTTOM_CENTER;
    }
}
