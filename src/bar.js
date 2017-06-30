var Phaser;

var uiWidgets = uiWidgets || {};


uiWidgets.Bar = function () {};

/** Base object for all Bars. */
uiWidgets.Bar.prototype = Object.create(Phaser.Group.prototype);
uiWidgets.Bar.constructor = uiWidgets.Bar;

/** Determine the distance the bar can scroll over. */
uiWidgets.Bar.prototype.setTrackScrollAreaSize = function () {
    "use strict";

    if (this.vertical) {
        this.trackScrollAreaSize = this.track.height - this.vslice;
    } else {
        this.trackScrollAreaSize = this.track.width - this.hslice;
    }
};

/** Sets position for the bar's non-moving axis. Centers it inside the track. */
uiWidgets.Bar.prototype.centerStaticAxis = function () {
    "use strict";
    if (this.vertical) {
        this.bar.x = this.track.x + (this.track.width / 2) - (this.bar.width / 2);
    } else {
        this.bar.y = this.track.y + (this.track.height / 2) - (this.bar.height / 2);
    }
};
