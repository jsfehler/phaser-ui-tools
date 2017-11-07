var uiWidgets = uiWidgets || {};

/**
 * Represents a single point in a Wheel3D.
 * @ignore
 * @constructor
 * @param {number} x - The point's virtual x location.
 * @param {number} y - The point's virtual y location.
 * @param {number} z - The point's virtual z location.
 * @param {Object} sprite - The sprite associated with this point.
 * @param {number} position - The point's position on the Wheel3D.
 */
var VectorPoint = function (x, y, z, sprite, position) {
    "use strict";
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;

    this.sprite = sprite || null;
    this.position = position || 0;
};

VectorPoint.prototype = {
    getSinCosOfAngle: function (angle) {
        "use strict";
        var rad = angle * Math.PI / 180,
        cosAngle = Math.cos(rad),
        sinAngle = Math.sin(rad);

        return {cosine: cosAngle, sine: sinAngle};
    },
    rotateY: function (angle) {
        "use strict";
        var angles = this.getSinCosOfAngle(angle),
            z = this.z * angles.cosine - this.x * angles.sine,
            x = this.z * angles.sine + this.x * angles.cosine;

        return new VectorPoint(x, this.y, z);
    },
    rotateX: function (angle) {
        "use strict";
        var angles = this.getSinCosOfAngle(angle),
            y = this.y * angles.cosine - this.z * angles.sine,
            z = this.y * angles.sine + this.z * angles.cosine;

        return new VectorPoint(this.x, y, z);
    },
    rotateZ: function (angle) {
        "use strict";
        var angles = this.getSinCosOfAngle(angle),
            x = this.x * angles.cosine - this.y * angles.sine,
            y = this.x * angles.sine + this.y * angles.cosine;

        return new VectorPoint(x, y, this.z);
    },
    /** Rotate the point along the given axis by the given angle.
    * @param {string} axis - The axis to rotate.
    * @param {number} angle - The angle to rotate by.
    */
    rotate: function (axis, angle) {
        "use strict";
        if (axis === 'x') {
            return this.rotateX(angle);
        } else if (axis === 'y') {
            return this.rotateY(angle);
        } else if (axis === 'z') {
            return this.rotateZ(angle);
        }
    },
    /** Project the point to the correct physical location on screen.
     * z axis is not projected, because screens are 2D.
     */
     project: function (width, height, factor) {
        "use strict";
        var x = (this.x * factor) + width,
            y = (-this.y * factor) + height;

            return new VectorPoint(x, y, this.z);
    }
};


/**
 * A Wheel of sprites where each item's position is projected in 3D space.
 * The number of points is automatically determined by the number of items.
 * @constructor
 * @param {Object} game - Reference to current game instance.
 * @param {array} sprites - List of sprites to use in the wheel.
 * @param {Number} firstPlace - Determines which position on the wheel is the active one.
 * @param {Number} zoom - Determines how far to project the points.
 * @param {String} axis - The axis the wheel3D places items around.
 * @param {Object} rotations - Axis and angle to rotate the entire wheel after the initial projection.
 * @param {Object} visibleRange - Determines which items on the wheel should be visible. If none provided, assumes all items should be visible.
 * @param {Object} tweenParams - Array with the duration and easing function for the movement tween.
 */
uiWidgets.Wheel3D = function (game, xy, sprites, firstPlace, zoom, axis, rotations, visibleRange, tweenParams) {
    "use strict";
    this.game = game;
    this.xy = xy;
    this.sprites = sprites;
    this.firstPlace = firstPlace;
    this.zoom = zoom;
	this.axis = axis;
    this.rotationAxis = rotations;
    this.visibleRange = visibleRange || null;
    this.tweenParams = tweenParams || {'duration': 300, 'ease': Phaser.Easing.Quadratic.Out};

    // Signals
    this.onStart = new Phaser.Signal();
    this.onComplete = new Phaser.Signal();
    this.onBackComplete = new Phaser.Signal();
    this.onForwardComplete = new Phaser.Signal();

    // Group to store wheel sprites in, used for zindex sorting.
    this.group = this.game.add.group();
};


uiWidgets.Wheel3D.prototype = {
    activate: function () {
        "use strict";
        var radius,
            slice,
            angle,
            radCos,
            radSin,
            nx,
            ny,
            nz,
            i;

        this.pointsAmount = this.sprites.length;
        this.totalPositions = this.pointsAmount - 1;
        this.rotationAmount = 360 / this.pointsAmount;

        // Determines which items in the wheel should be visible.
        if (this.visibleRange !== null) {
            var allPositions = [];
            for (i = 0; i <= this.totalPositions; i++) {
                allPositions.push(i);
            }

            var maxV = allPositions.slice(0, this.visibleRange.max);
            var minV = allPositions.slice(this.visibleRange.min);

            this.visiblePositions = maxV.concat(minV);
        }

        // Prevents slamming down the move keys.
        this.moving = false;

        // Stores the direction the wheel is moving in.
        this.direction = 0;

        // Set point positions on logical circle.
        this.wheelItems = [];
        radius = 1;
        slice = (2 * Math.PI) / this.pointsAmount;

		// For a vertical wheel, the X axis is -1. Points are laid out on the Y axis (height) and Z axis (depth). The wheel rotates around the X axis.
		// For a horizontal wheel, the Y Axis is -1. Points are laid out on the X axis (width) and Z axis (depth). The wheel rotates around the Y axis.
        // For flat circular wheel, the Z Axis is -1. Points are laid out on the X axis (width) and Y axis (height). The wheel rotates around the Z axis.
        for (i = 0; i < this.pointsAmount; i++) {
            // Add sprite to group.
            this.sprites[i].wheelPosition = i;
            this.group.add(this.sprites[i]);

            angle = slice * i;
            radCos = radius * Math.cos(angle);
            radSin = radius * Math.sin(angle);

            if (this.axis === 'x') {
                nx = -1;
                ny = radCos;
                nz = radSin;
            } else if (this.axis === 'y') {
                nx = radCos;
                ny = -1;
                nz = radSin;
            } else if (this.axis === 'z') {
                nx = radCos;
                ny = radSin;
                nz = -1;
            }

            this.wheelItems.push(new VectorPoint(nx, ny, nz, this.sprites[i], i));
        }

		// Active Point
        this.active = this.wheelItems[this.firstPlace].sprite;

        this.project();
    },

    /** Move the wheel backwards. */
    moveBack: function () {
        "use strict";
        if (this.moving === false) {
            this.moving = true;
            this.direction = 0;

            if (this.axis === 'x' || this.axis === 'z') {
                this.rotationAxis[this.axis] += this.rotationAmount;
            } else { // y axis needs to go in the opposite direction.
                this.rotationAxis[this.axis] -= this.rotationAmount;
            }

            this.updatePosition('+');

            this.project();
            this.resetAngle();
		}
    },

    /** Move the wheel forward. */
    moveForward: function () {
        "use strict";
        if (this.moving === false) {
            this.moving = true;
            this.direction = 1;

            if (this.axis === 'x' || this.axis === 'z') {
                this.rotationAxis[this.axis] -= this.rotationAmount;
            } else { // y axis needs to go in the opposite direction.
                this.rotationAxis[this.axis] += this.rotationAmount;
            }

            this.updatePosition('-');

            this.project();
            this.resetAngle();
		}
    },

    /** Project every item in the wheel to it's physical location. */
    project: function () {
        "use strict";
        var transformed, newTween;

        // Create a list with the axes, then remove the projected axis.
        var arr = ["x", "y", "z"];
        var idx = arr.indexOf(this.axis);
        arr.splice(idx, 1);

        // We only need to call all this when moving. It doesn't need to be done
        // every update
        for (var i = 0; i < this.wheelItems.length; i++) {

            // Rotate along the projected axis
            var rotationOne = this.wheelItems[i].rotate(
                this.axis,
                this.rotationAxis[this.axis]
            );

            // Rotate the other 2 axes
            var rotationTwo = rotationOne.rotate(arr[0], this.rotationAxis[arr[0]]);
            var rotationThree = rotationTwo.rotate(arr[1], this.rotationAxis[arr[1]]);

			var p = rotationThree.project(
                this.xy.x,
                this.xy.y,
                this.zoom
            );

            transformed = this.wheelItems[i].sprite;
            transformed.lz = p.z;

            // Ensure active sprite has no scale/alpha changes.
            if (this.wheelItems[i].position === this.firstPlace) {
                transformed.alpha = 1.0;
				this.active = this.wheelItems[i].sprite;

            } else {
                if (this.visibleRange !== null) {
                    var includes = _.includes(
                        this.visiblePositions,
                        this.wheelItems[i].position
                    );

                    if (includes) {
                        transformed.alpha = 1.0;
                    } else {
                        transformed.alpha = 0.0;
                    }

                }
            }

            // Tween to new position
            newTween = this.game.add.tween(transformed).to(
                {x: p.x, y: p.y},
                this.tweenParams.duration,
                this.tweenParams.ease,
                true
            );

            newTween.onComplete.add(this.enableMoving, this);
		}

        // Sort wheelItems by the projection's z axis for correct z-order when drawing.
        this.group.sort("lz", Phaser.Group.SORT_ASCENDING);

        // Wheel's signals are dispatched by the tween's.
        newTween.onStart.add(this.dispatchOnStart, this);
        newTween.onComplete.add(this.dispatchOnComplete, this);
	},

    /** Called after movement starts. */
    dispatchOnStart: function () {
        "use strict";
        this.onStart.dispatch(this);
    },

    /** Called after movement is finished. */
    dispatchOnComplete: function () {
        "use strict";
        if (this.direction === 0) {
            this.onBackComplete.dispatch(this);
        } else if (this.direction === 1) {
            this.onForwardComplete.dispatch(this);
        }

        this.onComplete.dispatch(this);
    },

    /** Once the buttons have finished their move animation, allow them to move again. */
	enableMoving: function () {
        "use strict";
        this.moving = false;
    },

	/** Move all the WheelItem's position by 1. */
    updatePosition: function (operator) {
        "use strict";
        var m;

        for (var i = 0; i < this.wheelItems.length; i++) {
            var position = this.wheelItems[i].position;
            this.wheelItems[i].position = uiWidgets.utils.operators[operator](position, 1);

            m = uiWidgets.utils.modulo(this.wheelItems[i].position, this.pointsAmount);
            this.wheelItems[i].position = m;
            this.wheelItems[i].sprite.wheelPosition = m;
        }
    },

    /** Make sure rotation can't go past 360 in either direction. */
    resetAngle: function () {
        "use strict";
        var angle = this.rotationAxis[this.axis];

        if (angle === 360 || angle === -360 ) {
            this.rotationAxis[this.axis] = 0;
        }
    }
};
