import * as PhaserObjects from '../phaserObjects';

/** Base object for all Bar-like Widgets.
 * @private
 * @extends PhaserObjects.Group
 */
export class Bar extends PhaserObjects.Group {
    /**
     * @param {Object} game - Current game instance.
     * @param {number} x - The Bar's x position.
     * @param {number} y - The Bar's y position.
     * @param {boolean} vertical - Sets the Bar's alignment as vertical.
     * @param {string} trackKey - The key to use for the track.
     * @param {string} barKey - The key to use for the bar.
     */
    constructor(game, x = 0, y = 0, vertical = false, trackKey = '', barKey = '') {
        super(game);
        game.add.existing(this);

        this.game = game;
        this.x = x;
        this.y = y;

        this.vertical = vertical;

        this.trackKey = trackKey;
        this.barKey = barKey;

        this.parentContainer = null;
    }

    /**
     * @private
     * Determine the distance the bar can scroll over.
     */
    setTrackScrollAreaSize() {
        if (this.vertical) {
            this.trackScrollAreaSize = this.track.height - this.vslice;
        } else {
            this.trackScrollAreaSize = this.track.width - this.hslice;
        }
    }

    /**
     * @private
     * Sets position for the bar's non-moving axis. Centers it inside the track.
     */
    centerStaticAxis() {
        if (this.vertical) {
            this.bar.x = (
                this.track.x + (this.track.width / 2)) - (this.bar.displayWidth / 2);
        } else {
            this.bar.y = (
                this.track.y + (this.track.height / 2)) - (this.bar.displayHeight / 2);
        }
    }
}
