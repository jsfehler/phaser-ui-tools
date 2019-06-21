import { alignments } from '../const';
import { Frame } from './frame';

/** Frame that places new child nodes directly under the previous child.
 * @extends Frame
 */
export class Column extends Frame {
    /**
     * @param {Object} game - Current game instance.
     * @param {Number} x - The x position of the Frame.
     * @param {Number} y - The y position of the Frame.
     * @param {string} bg - The background image to use.
     */
    constructor(game, x = 0, y = 0, bg = 0) {
        super(game, x, y, bg);
        this.alignment = alignments.BOTTOM_CENTER;
    }
}
