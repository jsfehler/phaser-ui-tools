var uiWidgets;
uiWidgets = uiWidgets || {};


/** Base object for all Bars. */
uiWidgets.Bar = function () {};
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


/** Base object for Bars that can be dragged with a mouse. */
uiWidgets.DraggableBar = function () {};
uiWidgets.DraggableBar.prototype = Object.create(uiWidgets.Bar.prototype);
uiWidgets.DraggableBar.constructor = uiWidgets.DraggableBar;


/** If the vertical scrollbar is draggable, this function is called when the track is clicked. */
uiWidgets.DraggableBar.prototype.verticalTrackClick = function () {
    "use strict";
    // Don't register mouse clicks on the bar itself.
    if (this.game.input.mousePointer.y > this.bar.y + this.bar.height + this.worldPosition.y) {
        this.scrollDown();
    } else if (this.game.input.mousePointer.y < this.bar.y + this.worldPosition.y) {
        this.scrollUp();
    }
};

/** If the horizontal scrollbar is draggable, this function is called when the track is clicked. */
uiWidgets.DraggableBar.prototype.horizontalTrackClick = function () {
    "use strict";
    // Don't register mouse clicks on the bar itself.
    if (this.game.input.mousePointer.x > this.bar.x + this.bar.width + this.worldPosition.x) {
        this.scrollRight();
    } else if (this.game.input.mousePointer.x < (this.bar.x + this.worldPosition.x)) {
        this.scrollLeft();
    }
};

/** Allows the bar to scroll when the track is clicked directly. */
uiWidgets.DraggableBar.prototype.enableTrackClick = function () {
    "use strict";
    var event;

    this.track.inputEnabled = true;

    if (this.vertical) {
        event = this.verticalTrackClick;
    } else {
        event = this.horizontalTrackClick;
    }

    this.track.events.onInputDown.add(event, this);
};

/** When called, ensures the bar can be moved. Must be called once the bar has finished scrolling. */
uiWidgets.DraggableBar.prototype.enableBarInput = function () {
    "use strict";
    this.trackClicked = false;
    this.barMoving = false;
    this.bar.inputEnabled = true;
};

/** Enables clicking and dragging on the bar. */
uiWidgets.DraggableBar.prototype.enableBarDrag = function () {
    "use strict";
    this.setDraggableArea();

    this.bar.inputEnabled = true;
    this.bar.input.enableDrag();
    if (this.snapping) {
        this.bar.events.onInputUp.add(this.snapToClosestPosition, this);
    }
    this.bar.events.onInputDown.add(this.saveMousePosition, this);
    this.bar.events.onDragUpdate.add(this.moveContent, this);

    var draggableArea;

    if (this.vertical) {
        this.bar.input.allowHorizontalDrag = false;
        draggableArea = this.verticalDraggableArea;
    } else {
        this.bar.input.allowVerticalDrag = false;
        draggableArea = this.horizontalDraggableArea;
    }

    this.bar.input.boundsRect = new Phaser.Rectangle(
        draggableArea.x,
        draggableArea.y,
        draggableArea.w,
        draggableArea.h)
    ;
};
