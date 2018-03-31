/** Base object for all Bar-like Widgets.
 * @extends Phaser.Group
 */
export class Bar extends Phaser.Group {
    /**
     * @param {number} x - The Bar's x position.
     * @param {number} y - The Bar's y position.
     * @param {boolean} vertical - Sets the Bar's alignment as vertical.
     */
    constructor(game, x = 0, y = 0, vertical = false) {
        super(game);

        this.game = game;
        this.x = x;
        this.y = y;

        this.vertical = vertical;
    }
    /** Determine the distance the bar can scroll over. */
    setTrackScrollAreaSize() {
        if (this.vertical) {
            this.trackScrollAreaSize = this.track.height - this.vslice;
        } else {
            this.trackScrollAreaSize = this.track.width - this.hslice;
        }
    }
    /** Sets position for the bar's non-moving axis. Centers it inside the track. */
    centerStaticAxis() {
        if (this.vertical) {
            this.bar.x = (
                this.track.x + (this.track.width / 2)) - (this.bar.width / 2);
        } else {
            this.bar.y = (
                this.track.y + (this.track.height / 2)) - (this.bar.height / 2);
        }
    }
}
