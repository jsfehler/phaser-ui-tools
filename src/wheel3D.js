import * as EventEmitter from 'eventemitter3';

import { utils } from './utils';

import * as PhaserObjects from './phaserObjects';

/**
 * Represents a single point in a Wheel3D.
 * @ignore
 */
class VectorPoint {
    /**
     * @ignore
     * @param {number} x - The point's virtual x location.
     * @param {number} y - The point's virtual y location.
     * @param {number} z - The point's virtual z location.
     * @param {Object} sprite - The sprite associated with this point.
     * @param {number} position - The point's position on the Wheel3D.
     */
    constructor(x = 0, y = 0, z = 0, sprite = null, position = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.sprite = sprite;
        this.position = position;
    }

    getSinCosOfAngle(angle) { // eslint-disable-line class-methods-use-this
        const rad = (angle * Math.PI) / 180;
        const cosAngle = Math.cos(rad);
        const sinAngle = Math.sin(rad);

        return { cosine: cosAngle, sine: sinAngle };
    }

    rotateY(angle) {
        const angles = this.getSinCosOfAngle(angle);
        const z = (this.z * angles.cosine) - (this.x * angles.sine);
        const x = (this.z * angles.sine) + (this.x * angles.cosine);

        return new VectorPoint(x, this.y, z);
    }

    rotateX(angle) {
        const angles = this.getSinCosOfAngle(angle);
        const y = (this.y * angles.cosine) - (this.z * angles.sine);
        const z = (this.y * angles.sine) + (this.z * angles.cosine);

        return new VectorPoint(this.x, y, z);
    }

    rotateZ(angle) {
        const angles = this.getSinCosOfAngle(angle);
        const x = (this.x * angles.cosine) - (this.y * angles.sine);
        const y = (this.x * angles.sine) + (this.y * angles.cosine);

        return new VectorPoint(x, y, this.z);
    }

    /** Rotate the point along the given axis by the given angle.
    * @param {string} axis - The axis to rotate.
    * @param {number} angle - The angle to rotate by.
    */
    rotate(axis, angle) {
        let newVector = null;

        if (axis === 'x') {
            newVector = this.rotateX(angle);
        } else if (axis === 'y') {
            newVector = this.rotateY(angle);
        } else if (axis === 'z') {
            newVector = this.rotateZ(angle);
        }

        return newVector;
    }

    /** Project the point to the correct physical location on screen.
     * z axis is not projected, because screens are 2D.
     */
    project(width, height, factor) {
        const x = (this.x * factor) + width;
        const y = (-this.y * factor) + height;

        return new VectorPoint(x, y, this.z);
    }
}

/**
 * A Wheel of sprites where each item's position is projected in 3D space.
 * The number of points is automatically determined by the number of items.
 */
export class Wheel3D {
    /**
     * @param {Object} game - Reference to current game instance.
     * @param {array} sprites - List of sprites to use in the wheel.
     * @param {Number} firstPlace - Determines which position on the wheel is the active one.
     * @param {Number} zoom - Determines how far to project the points.
     * @param {String} axis - The axis the wheel3D places items around.
     * @param {Object} rotations - Axis and angle to rotate the entire wheel after the initial projection.
     * @param {Object} visibleRange - Determines which items on the wheel should be visible. If none provided, assumes all items should be visible.
     * @param {Object} tweenParams - Array with the duration and easing function for the movement tween.
     */
    constructor(game, xy, sprites, firstPlace, zoom, axis, rotations, visibleRange, tweenParams) {
        this.game = game;
        this.xy = xy;
        this.sprites = sprites;
        this.firstPlace = firstPlace;
        this.zoom = zoom;
        this.axis = axis;
        this.rotationAxis = rotations;
        this.visibleRange = visibleRange || null;
        this.tweenParams = tweenParams || { duration: 300, ease: PhaserObjects.Easing.Quadratic.Out };

        this.emitter = new EventEmitter();

        // Group to store wheel sprites in, used for zindex sorting.
        this.group = new PhaserObjects.Group(game);
    }

    activate() {
        let angle;
        let radCos;
        let radSin;
        let nx;
        let ny;
        let nz;

        this.pointsAmount = this.sprites.length;
        this.totalPositions = this.pointsAmount - 1;
        this.rotationAmount = 360 / this.pointsAmount;

        // Determines which items in the wheel should be visible.
        if (this.visibleRange !== null) {
            const allPositions = [];
            for (let i = 0; i <= this.totalPositions; i++) {
                allPositions.push(i);
            }

            const maxV = allPositions.slice(0, this.visibleRange.max);
            const minV = allPositions.slice(this.visibleRange.min);

            this.visiblePositions = maxV.concat(minV);
        }

        // Prevents slamming down the move keys.
        this.moving = false;

        // Stores the direction the wheel is moving in.
        this.direction = null;

        // Set point positions on logical circle.
        this.wheelItems = [];
        const radius = 1;
        const slice = (2 * Math.PI) / this.pointsAmount;

        // For a vertical wheel, the X axis is -1. Points are laid out on the Y axis (height) and Z axis (depth). The wheel rotates around the X axis.
        // For a horizontal wheel, the Y Axis is -1. Points are laid out on the X axis (width) and Z axis (depth). The wheel rotates around the Y axis.
        // For flat circular wheel, the Z Axis is -1. Points are laid out on the X axis (width) and Y axis (height). The wheel rotates around the Z axis.
        for (let i = 0; i < this.pointsAmount; i++) {
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
    }

    /** Move the wheel backwards. */
    moveBack() {
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
    }

    /** Move the wheel forward. */
    moveForward() {
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
    }

    /** Project every item in the wheel to it's physical location. */
    project() {
        // Create a list with the axes, then remove the projected axis.
        const arr = ['x', 'y', 'z'];
        const idx = arr.indexOf(this.axis);
        arr.splice(idx, 1);

        // We only need to call all this when moving. It doesn't need to be done
        // every update
        for (let i = 0; i < this.wheelItems.length; i++) {
            // Rotate along the projected axis
            const rotationOne = this.wheelItems[i].rotate(
                this.axis,
                this.rotationAxis[this.axis],
            );

            // Rotate the other 2 axes
            const rotationTwo = rotationOne.rotate(arr[0], this.rotationAxis[arr[0]]);
            const rotationThree = rotationTwo.rotate(arr[1], this.rotationAxis[arr[1]]);

            const p = rotationThree.project(
                this.xy.x,
                this.xy.y,
                this.zoom,
            );

            const transformed = this.wheelItems[i].sprite;
            transformed.lz = p.z;

            // Ensure active sprite has no scale/alpha changes.
            if (this.wheelItems[i].position === this.firstPlace) {
                transformed.alpha = 1.0;
                this.active = this.wheelItems[i].sprite;
            } else {
                if (this.visibleRange !== null) {
                    const includes = this.visiblePositions.includes(this.wheelItems[i].position);
                    // const includes = _.includes(
                    //    this.visiblePositions,
                    //    this.wheelItems[i].position,
                    // );

                    if (includes) {
                        transformed.alpha = 1.0;
                    } else {
                        transformed.alpha = 0.0;
                    }
                }
            }

            const newTween = new PhaserObjects.Tween(this.game);

            if (i !== this.wheelItems.length - 1) {
                newTween.add(
                    transformed,
                    { x: p.x, y: p.y },
                    this.tweenParams.duration,
                    this.tweenParams.ease,
                );
            } else {
                // Wheel's signals are dispatched by the last tween.
                newTween.add(
                    transformed,
                    { x: p.x, y: p.y },
                    this.tweenParams.duration,
                    this.tweenParams.ease,
                    () => { this.enableMoving(); this.dispatchOnComplete(); },
                    null,
                    () => { this.dispatchOnStart(); },
                    this,
                    null,
                    null,
                );
            }
        }

        // Sort wheelItems by the projection's z axis for correct z-order when drawing.
        this.group.sort('lz', PhaserObjects.Group.SORT_ASCENDING);
    }

    /** Called after movement starts. */
    dispatchOnStart() {
        this.emitter.emit('start', this);
    }

    /** Called after movement is finished. */
    dispatchOnComplete() {
        if (this.direction === 0) {
            this.emitter.emit('backComplete', this);
        } else if (this.direction === 1) {
            this.emitter.emit('forwardComplete', this);
        }

        this.emitter.emit('complete', this);
    }

    /** Once the buttons have finished their move animation, allow them to move again. */
    enableMoving() {
        this.moving = false;
    }

    /** Move all the WheelItem's position by 1. */
    updatePosition(operator) {
        for (let i = 0; i < this.wheelItems.length; i++) {
            const { position } = this.wheelItems[i];
            this.wheelItems[i].position = utils.operators[operator](position, 1);

            const m = utils.modulo(this.wheelItems[i].position, this.pointsAmount);
            this.wheelItems[i].position = m;
            this.wheelItems[i].sprite.wheelPosition = m;
        }
    }

    /** Make sure rotation can't go past 360 in either direction. */
    resetAngle() {
        const angle = this.rotationAxis[this.axis];

        if (angle === 360 || angle === -360) {
            this.rotationAxis[this.axis] = 0;
        }
    }
}
