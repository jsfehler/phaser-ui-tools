(function (global, factory) {
        typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
        (factory((global.uiWidgets = {})));
}(this, (function (exports) { 'use strict';

        var classCallCheck = function (instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };

        var createClass = function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }

          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        }();









        var inherits = function (subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
          }

          subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
              value: subClass,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
          if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        };











        var possibleConstructorReturn = function (self, call) {
          if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }

          return call && (typeof call === "object" || typeof call === "function") ? call : self;
        };

        /** Base object for all Bar-like Widgets.
         * @extends Phaser.Group
         */
        var Bar = function (_Phaser$Group) {
            inherits(Bar, _Phaser$Group);

            /**
             * @param {number} x - The Bar's x position.
             * @param {number} y - The Bar's y position.
             * @param {boolean} vertical - Sets the Bar's alignment as vertical.
             */
            function Bar(game) {
                var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                var vertical = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
                classCallCheck(this, Bar);

                var _this = possibleConstructorReturn(this, (Bar.__proto__ || Object.getPrototypeOf(Bar)).call(this, game));

                _this.game = game;
                _this.x = x;
                _this.y = y;

                _this.vertical = vertical;
                return _this;
            }
            /** Determine the distance the bar can scroll over. */


            createClass(Bar, [{
                key: "setTrackScrollAreaSize",
                value: function setTrackScrollAreaSize() {
                    if (this.vertical) {
                        this.trackScrollAreaSize = this.track.height - this.vslice;
                    } else {
                        this.trackScrollAreaSize = this.track.width - this.hslice;
                    }
                }
                /** Sets position for the bar's non-moving axis. Centers it inside the track. */

            }, {
                key: "centerStaticAxis",
                value: function centerStaticAxis() {
                    if (this.vertical) {
                        this.bar.x = this.track.x + this.track.width / 2 - this.bar.width / 2;
                    } else {
                        this.bar.y = this.track.y + this.track.height / 2 - this.bar.height / 2;
                    }
                }
            }]);
            return Bar;
        }(Phaser.Group);

        /**
         * Base object for Bars that can be manipulated with a mouse.
         * @extends Bar
         */
        var DraggableBar = function (_Bar) {
            inherits(DraggableBar, _Bar);

            function DraggableBar() {
                classCallCheck(this, DraggableBar);
                return possibleConstructorReturn(this, (DraggableBar.__proto__ || Object.getPrototypeOf(DraggableBar)).apply(this, arguments));
            }

            createClass(DraggableBar, [{
                key: 'verticalTrackClick',

                /** If the vertical scrollbar is draggable,
                * this function is called when the track is clicked.
                */
                value: function verticalTrackClick() {
                    // Don't register mouse clicks on the bar itself.
                    var mouseY = this.game.input.mousePointer.y;

                    if (mouseY > this.bar.y + this.worldPosition.y + this.bar.height) {
                        this.scrollDown();
                    } else if (mouseY < this.bar.y + this.worldPosition.y) {
                        this.scrollUp();
                    }
                }
                /** If the horizontal scrollbar is draggable,
                * this function is called when the track is clicked.
                */

            }, {
                key: 'horizontalTrackClick',
                value: function horizontalTrackClick() {
                    var mouseX = this.game.input.mousePointer.x;
                    // Don't register mouse clicks on the bar itself.
                    if (mouseX > this.bar.x + this.bar.width + this.worldPosition.x) {
                        this.scrollRight();
                    } else if (mouseX < this.bar.x + this.worldPosition.x) {
                        this.scrollLeft();
                    }
                }
                /** Allows the bar to scroll when the track is clicked directly. */

            }, {
                key: 'enableTrackClick',
                value: function enableTrackClick() {
                    var event = void 0;

                    this.track.inputEnabled = true;

                    if (this.vertical) {
                        event = this.verticalTrackClick;
                    } else {
                        event = this.horizontalTrackClick;
                    }

                    this.track.events.onInputDown.add(event, this);
                }
                /** When called, ensures the bar can be moved.
                * Must be called once the bar has finished scrolling.
                */

            }, {
                key: 'enableBarInput',
                value: function enableBarInput() {
                    this.trackClicked = false;
                    this.barMoving = false;
                    this.bar.inputEnabled = true;
                }
                /** Enables clicking and dragging on the bar. */

            }, {
                key: 'enableBarDrag',
                value: function enableBarDrag() {
                    this.setDraggableArea();

                    this.bar.inputEnabled = true;
                    this.bar.input.enableDrag();
                    if (this.snapping) {
                        this.bar.events.onInputUp.add(this.snapToClosestPosition, this);
                    }
                    this.bar.events.onInputDown.add(this.saveMousePosition, this);
                    this.bar.events.onDragUpdate.add(this.moveContent, this);

                    var draggableArea = void 0;

                    if (this.vertical) {
                        this.bar.input.allowHorizontalDrag = false;
                        draggableArea = this.verticalDraggableArea;
                    } else {
                        this.bar.input.allowVerticalDrag = false;
                        draggableArea = this.horizontalDraggableArea;
                    }

                    this.bar.input.boundsRect = new Phaser.Rectangle(draggableArea.x, draggableArea.y, draggableArea.w, draggableArea.h);
                }
            }, {
                key: 'saveMousePosition',
                value: function saveMousePosition(sprite, pointer) {
                    // When the bar is dragged, record where the mouse clicked down.
                    this.mousePointer = { x: pointer.x, y: pointer.y };
                }
            }, {
                key: 'getBarPosition',
                value: function getBarPosition() {
                    var currentValue = this.valueRange.getCurrentValue();
                    var windowPositionRatio = currentValue / this.windowScrollAreaSize;
                    return this.trackScrollAreaSize * windowPositionRatio;
                }
            }, {
                key: 'getMouseDelta',
                value: function getMouseDelta() {
                    var oldMousePosition = void 0;
                    if (this.vertical) {
                        oldMousePosition = this.mousePointer.y;
                    } else {
                        oldMousePosition = this.mousePointer.x;
                    }

                    // Only difference between clicking the track/using the keyboard vs mouse drag.
                    var newMousePointer = void 0;
                    if (this.trackClicked) {
                        newMousePointer = { x: this.bar.x, y: this.bar.y };
                    } else {
                        var mousePointer = this.game.input.mousePointer;

                        newMousePointer = { x: mousePointer.x, y: mousePointer.y };
                    }

                    var newMousePosition = void 0;
                    if (this.vertical) {
                        newMousePosition = newMousePointer.y;
                    } else {
                        newMousePosition = newMousePointer.x;
                    }

                    this.mousePointer = newMousePointer;

                    // Maximum value for the mouse position. Only update when the new position is inside the track.
                    var maxValue = void 0;
                    if (this.vertical) {
                        maxValue = this.track.height + this.worldPosition.y;
                    } else {
                        maxValue = this.track.width + this.worldPosition.x;
                    }

                    var mousePositionDelta = void 0;
                    if (newMousePosition < maxValue) {
                        mousePositionDelta = oldMousePosition - newMousePosition;
                    } else {
                        mousePositionDelta = 0;
                    }

                    return mousePositionDelta;
                }
                /** Creates the tween for moving the bar to a new position. */

            }, {
                key: 'addScrollTween',
                value: function addScrollTween(properties) {
                    this.mousePointer = { x: this.bar.x, y: this.bar.y };
                    this.trackClicked = true;

                    var newTween = this.game.add.tween(this.bar).to(properties, this.tweenParams.duration, this.tweenParams.ease, true);

                    this.addScrollTweenEvents(newTween);
                }
                /** Called after a scroll tween is added. Adds the necessary events to the tween. */

            }, {
                key: 'addScrollTweenEvents',
                value: function addScrollTweenEvents(tween) {
                    // Update the values as the bar moves.
                    tween.onUpdateCallback(this.moveContent, this);
                    tween.onComplete.add(this.enableBarInput, this);
                }
                /** For Vertical Scrollbars. Scrolls up by one step. */

            }, {
                key: 'scrollUp',
                value: function scrollUp() {
                    // Prevents users from moving the bar while it's moving.
                    if (this.bar.y !== this.track.y && !this.barMoving) {
                        var testPosition = this.bar.y - this.vslice;
                        var moveToY = null;
                        this.barMoving = true;

                        // Ensure the bar can't move above the track.
                        if (testPosition <= this.track.y) {
                            moveToY = this.minY;
                        } else {
                            moveToY = this.bar.y - this.vslice;
                        }

                        this.addScrollTween({ y: moveToY });
                    }
                }
                /** For Vertical Scrollbars. Scrolls down by one step. */

            }, {
                key: 'scrollDown',
                value: function scrollDown() {
                    if (this.bar.y + this.bar.height !== this.track.y + this.track.height && !this.barMoving) {
                        var testPosition = this.bar.y + this.vslice * 2;
                        var moveToY = null;
                        this.barMoving = true;
                        this.bar.inputEnabled = false;

                        // Ensure the bar can't move below the track.
                        if (testPosition >= this.track.y + this.track.height) {
                            moveToY = this.maxY;
                        } else {
                            moveToY = this.bar.y + this.vslice;
                        }

                        this.addScrollTween({ y: moveToY });
                    }
                }
                /** For Horizontal Scrollbars. Scrolls left by one step. */

            }, {
                key: 'scrollLeft',
                value: function scrollLeft() {
                    if (this.bar.x !== this.track.x && !this.barMoving) {
                        var testPosition = this.bar.x - this.hslice;
                        var moveToX = null;
                        this.barMoving = true;
                        this.bar.inputEnabled = false;

                        // Ensure the bar can't move above the track.
                        if (testPosition <= this.track.x) {
                            moveToX = this.minX;
                        } else {
                            moveToX = this.bar.x - this.hslice;
                        }

                        this.addScrollTween({ x: moveToX });
                    }
                }
                /** For Horizontal Scrollbars. Scrolls right by one step. */

            }, {
                key: 'scrollRight',
                value: function scrollRight() {
                    if (this.bar.x + this.bar.width !== this.track.x + this.track.width && !this.barMoving) {
                        var testPosition = this.bar.x + this.hslice * 2;
                        var moveToX = null;
                        this.barMoving = true;
                        this.bar.inputEnabled = false;

                        // Ensure the bar can't move below the track.
                        if (testPosition >= this.track.x + this.track.width) {
                            moveToX = this.maxX;
                        } else {
                            moveToX = this.bar.x + this.hslice;
                        }

                        this.addScrollTween({ x: moveToX });
                    }
                }
                /** Called when the scrollbar needs to move the viewport.
                * Causes the content to move relative to the bar's position on the track.
                */

            }, {
                key: 'moveContent',
                value: function moveContent() {
                    var newGripPositionRatio = this.getGripPositionRatio();

                    var newContentPosition = newGripPositionRatio * this.windowScrollAreaSize;

                    this.valueRange.adjustValue(newContentPosition);

                    this.onMovement.dispatch(this);
                }
            }]);
            return DraggableBar;
        }(Bar);

        /** Used by a QuantityBar to hold the bar's values. */
        var QuantityRange = function () {
            /**
             * @param {number} bar - The QuantityBar object that uses the range.
             * @param {number} startValue - The initial value for the bar.
             * @param {number} maxValue - The maximum value the bar can have.
             */
            function QuantityRange(bar, startValue, maxValue) {
                classCallCheck(this, QuantityRange);

                this.bar = bar;
                this.startValue = startValue;
                this.maxValue = maxValue;

                this.currentValue = startValue;
            }
            /** Returns the current ratio for how large the bar is compared to the track. */


            createClass(QuantityRange, [{
                key: "getRatio",
                value: function getRatio() {
                    var ratio = this.currentValue / this.maxValue;
                    return ratio;
                }
                /** Returns the bar's current value. */

            }, {
                key: "getCurrentValue",
                value: function getCurrentValue() {
                    return this.currentValue;
                }
            }]);
            return QuantityRange;
        }();

        /** Used by a ValueBar to hold the bar's values. */
        var ValueRange = function () {
            /**
             * @param {number} step - The amount the bar is changed by.
             * @param {number} startValue - The initial value for the bar.
             * @param {number} maxValue - The maximum value the bar can have.
             */
            function ValueRange(step, startValue, maxValue) {
                classCallCheck(this, ValueRange);

                this.step = step;
                this.startValue = startValue;
                this.maxValue = maxValue + step;

                this.ratio = step / maxValue;

                // The ratio between the step and max can't be greater than 1.
                // ie: There can't be more steps than the max value.
                if (this.ratio > 1) {
                    this.ratio = 1;
                }

                this.currentValue = startValue;

                // List of every possible step. Used for snapping into position by the ValueBar.
                this.steps = [];
                for (var i = 0; i < this.maxValue; i += step) {
                    this.steps.push(i);
                }
            }
            /** Adjusts the current value for the bar.
             * @param {number} newValue - The new current value.
             */


            createClass(ValueRange, [{
                key: "adjustValue",
                value: function adjustValue(newValue) {
                    this.currentValue = newValue;
                }
                /** Returns the bar's current value. */

            }, {
                key: "getCurrentValue",
                value: function getCurrentValue() {
                    return this.currentValue;
                }
            }]);
            return ValueRange;
        }();

        /** Used by a Scrollbar to hold the values and adjust a viewport's position. */
        var ViewportRange = function () {
            /**
             * @param {Object} viewport - The viewport to adjust.
             * @param {boolean} vertical - If the viewport is vertical or horizontal.
             */
            function ViewportRange(viewport, vertical) {
                classCallCheck(this, ViewportRange);

                this.viewport = viewport;
                this.vertical = vertical;

                if (vertical) {
                    this.step = viewport.area.height;
                    this.maxValue = viewport.height;
                } else {
                    this.step = viewport.area.width;
                    this.maxValue = viewport.width;
                }

                this.ratio = this.step / this.maxValue;

                // The ratio between the step and max can't be greater than 1.
                // ie: There can't be more steps than the max value.
                if (this.ratio > 1) {
                    this.ratio = 1;
                }
            }
            /** Adjusts the viewport's position. */


            createClass(ViewportRange, [{
                key: "adjustValue",
                value: function adjustValue(newValue) {
                    // Set the content's new position. Uses an offset for where the viewport is on screen.
                    if (this.vertical) {
                        this.viewport.y = newValue + this.viewport.area.y;
                    } else {
                        this.viewport.x = newValue + this.viewport.area.x;
                    }

                    this.viewport.disableOutOfBounds(this.viewport.children, this, this.vertical);
                }
            }, {
                key: "getCurrentValue",
                value: function getCurrentValue() {
                    var currentValue = void 0;
                    if (this.vertical) {
                        // y - an offset for where the viewport is on screen.
                        currentValue = this.viewport.y - this.viewport.area.y;
                    } else {
                        currentValue = this.viewport.x - this.viewport.area.x;
                    }

                    return currentValue;
                }
            }]);
            return ViewportRange;
        }();

        /**
          * Bar that adjusts the size of a static sprite based on a value.
          * This is done by masking the sprite and then resizing the mask.
          * @extends Bar
          */
        var QuantityBar = function (_Bar) {
            inherits(QuantityBar, _Bar);

            /**
             * @param {Object} game - Current game instance.
             * @param {Object} xy -  Dictionary with the values for the bar's x and y position.
             * @param {Object} values - The numerical values for the bar.
             * @param {boolean} vertical - Determines if the bar should be vertical or horizontal.
             * @param {boolean} reverse - Determines the direction the bar moves when adjusted.
             * @param {string} trackImage - The image key to use for the track.
             * @param {string} barImage - The image key to use for the bar. Will automatically resize to fit.
             * @param {Object} tweenParams - Object with duration and easing function for the scrolling tween.
             */
            function QuantityBar(game, xy, values, vertical, reverse, trackImage, barImage, tweenParams) {
                classCallCheck(this, QuantityBar);

                var _this = possibleConstructorReturn(this, (QuantityBar.__proto__ || Object.getPrototypeOf(QuantityBar)).call(this, game, xy.x, xy.y));

                game.add.existing(_this);

                _this.valueRange = new QuantityRange(_this, values.startValue, values.maxValue);

                _this.vertical = vertical || false;
                _this.reverse = reverse || false;

                _this.trackImage = trackImage;
                _this.barImage = barImage;

                _this.tweenParams = tweenParams || { duration: 300, ease: Phaser.Easing.Quadratic.Out };

                // The track is the static area the bar will move along.
                _this.track = _this.game.add.sprite(0, 0, _this.trackImage);
                _this.add(_this.track);

                // The bar is a static image taking up the width of the track.
                _this.bar = _this.game.add.button(0, 0, _this.barImage, _this.moveContent, _this, 1, 0);
                _this.add(_this.bar);

                _this.create();
                return _this;
            }
            /** Sets the bar's mask. */


            createClass(QuantityBar, [{
                key: 'setMask',
                value: function setMask() {
                    if (this.bar.mask !== null) {
                        this.bar.mask.destroy();
                        this.bar.mask = null;
                    }

                    var mask = this.game.add.graphics(this.maskX, this.maskY);
                    mask.beginFill(0x0000ff);
                    mask.drawRect(0, 0, this.maskW, this.maskH);
                    // mask.endFill();

                    this.bar.mask = mask;

                    this.add(mask);
                }
            }, {
                key: 'getBarPosition',
                value: function getBarPosition() {
                    var windowPositionRatio = this.valueRange.getRatio() / this.windowScrollAreaSize;
                    return this.trackScrollAreaSize * windowPositionRatio;
                }
            }, {
                key: 'create',
                value: function create() {
                    this.centerStaticAxis();

                    // Values for the bar's mask.
                    this.maskW = this.bar.width;
                    this.maskH = this.bar.height;
                    this.maskX = this.bar.x;
                    this.maskY = this.bar.y;

                    // Resizes the bar.
                    if (this.vertical) {
                        this.maskH = this.getBarSize();
                    } else {
                        this.maskW = this.getBarSize();
                    }

                    if (this.reverse) {
                        if (this.vertical) {
                            this.maskY = this.getBarFraction();
                        } else {
                            this.maskX = this.getBarFraction();
                        }
                    }

                    this.setMask();

                    // Determine the distance the window can scroll over
                    this.windowScrollAreaSize = this.valueRange.maxValue;

                    // Represents one fraction of the track.
                    this.vslice = this.track.height * this.valueRange.getRatio();
                    this.hslice = this.track.width * this.valueRange.getRatio();

                    this.setTrackScrollAreaSize();
                }
                /** Creates the tween for adjusting the size of the mask.
                 * @param {Object} properties - Values for the tween's movement.
                 */

            }, {
                key: 'addScrollTweenMask',
                value: function addScrollTweenMask(properties) {
                    this.game.add.tween(this.bar.mask).to(properties, this.tweenParams.duration, this.tweenParams.ease, true);
                }
                /** Adjusts the bar by a given value.
                 * @param {number} newValue - The value to adjust the bar by.
                 */

            }, {
                key: 'adjustBar',
                value: function adjustBar(newValue) {
                    this.valueRange.currentValue += newValue;

                    var tween = void 0;
                    var barSize = this.getBarSize();

                    if (this.reverse) {
                        if (this.vertical) {
                            tween = { height: barSize, y: this.getBarFraction() };
                        } else {
                            tween = { width: barSize, x: this.getBarFraction() };
                        }
                    } else {
                        if (this.vertical) {
                            tween = { height: barSize };
                        } else {
                            tween = { width: barSize };
                        }
                    }

                    this.addScrollTweenMask(tween);
                }
            }, {
                key: 'getBarFraction',
                value: function getBarFraction() {
                    var fraction = void 0;
                    if (this.vertical) {
                        fraction = this.track.height * this.valueRange.getRatio();
                    } else {
                        fraction = this.track.width * this.valueRange.getRatio();
                    }

                    return fraction;
                }
                /** Given a ratio between total content size and viewport size,
                 * return an appropriate percentage of the track.
                 */

            }, {
                key: 'getBarSize',
                value: function getBarSize() {
                    var barSize = void 0;
                    if (this.reverse) {
                        if (this.vertical) {
                            barSize = this.track.height - this.valueRange.getRatio();
                        } else {
                            barSize = this.track.width - this.valueRange.getRatio();
                        }
                    } else {
                        barSize = this.getBarFraction();
                    }

                    return barSize;
                }
            }]);
            return QuantityBar;
        }(Bar);

        /**
         * A bar that moves along a track.
         * The bar is resized relative to the size of the track and size of the content to be scrolled.
         * @extends DraggableBar
         */
        var Scrollbar = function (_DraggableBar) {
                inherits(Scrollbar, _DraggableBar);

                /**
                 * @param {Object} game - Current game instance.
                 * @param {Object} content - Anything that you want to move via the scrollbar.
                 * @param {boolean} draggable - Determines if the scrollbar responds to mouse clicks.
                 * @param {boolean} vertical - Determines if the scrollbar should be vertical or horizontal.
                 * @param {string} trackImage - The image key to use for the track.
                 * @param {string} barImage - The image key to use for the bar. Will automatically resize to fit.
                 * @param {Object} tweenParams - Object with duration and easing function for the scrolling tween.
                 */
                function Scrollbar(game, content, draggable, vertical, trackImage, barImage, tweenParams) {
                        classCallCheck(this, Scrollbar);

                        var _this = possibleConstructorReturn(this, (Scrollbar.__proto__ || Object.getPrototypeOf(Scrollbar)).call(this, game));

                        game.add.existing(_this);

                        _this.content = content;

                        _this.valueRange = new ViewportRange(content, vertical);

                        _this.vertical = vertical || false;
                        _this.draggable = draggable || false;

                        _this.trackImage = trackImage;
                        _this.barImage = barImage;

                        // The smallest pixel size allowed for the bar.
                        _this.minBarSize = 44;

                        _this.tweenParams = tweenParams || { duration: 300, ease: Phaser.Easing.Quadratic.Out };

                        // Flag switched on when the track is clicked, switched off after the bar movement is finished.
                        _this.trackClicked = false;
                        _this.barMoving = false;

                        // Records mouse pointer when clicking the bar.
                        _this.mousePointer = null;

                        // The track is the static area the bar will move along.
                        _this.track = _this.game.add.sprite(0, 0, _this.trackImage);
                        _this.add(_this.track);

                        if (_this.draggable) {
                                // If the bar is draggable, clicking the track will move the bar up or down.
                                _this.enableTrackClick();
                        }

                        // The bar is the part that moves, controlling the value of the scrollbar.
                        _this.bar = _this.game.add.button(_this.x, _this.y, _this.barImage, _this.moveContent, _this, 1, 0);
                        _this.add(_this.bar);

                        _this.resizeBar();

                        _this.minY = _this.track.y;
                        _this.maxY = _this.track.y + _this.track.height - _this.bar.height;
                        _this.minX = _this.track.x;
                        _this.maxX = _this.track.x + _this.track.width - _this.bar.width;

                        _this.create();

                        /**
                         * Dispatched when the bar is moved.
                         * @property {Phaser.Signal}
                         */
                        _this.onMovement = new Phaser.Signal();
                        return _this;
                }
                /** Given a ratio between total content size and viewport size,
                 * resize the bar sprite to the appropriate percentage of the track.
                 */


                createClass(Scrollbar, [{
                        key: 'resizeBar',
                        value: function resizeBar() {
                                var barSize = void 0;
                                if (this.vertical) {
                                        barSize = this.track.height * this.valueRange.ratio;
                                } else {
                                        barSize = this.track.width * this.valueRange.ratio;
                                }

                                // Prevents bar from becoming microscopic.
                                if (barSize < this.minBarSize) {
                                        barSize = this.minBarSize;
                                }

                                // Resizes the bar.
                                if (this.vertical) {
                                        this.bar.height = barSize;
                                } else {
                                        this.bar.width = barSize;
                                }
                        }
                }, {
                        key: 'create',
                        value: function create() {
                                this.centerStaticAxis();

                                if (this.draggable) {
                                        this.enableBarDrag();
                                }

                                // Determine the distance the window can scroll over
                                this.windowScrollAreaSize = this.valueRange.maxValue - this.valueRange.step;

                                // Represents one fraction of the track.
                                this.vslice = this.track.height * this.valueRange.ratio;
                                this.hslice = this.track.width * this.valueRange.ratio;

                                this.setTrackScrollAreaSize();

                                // Initial position for the bar.
                                this.mousePointer = { x: this.bar.x, y: this.bar.y };

                                this.setInitialBarPosition();
                        }
                        /** Sets the draggable area of the bar. */

                }, {
                        key: 'setDraggableArea',
                        value: function setDraggableArea() {
                                this.verticalDraggableArea = {
                                        x: this.track.x - (this.bar.width - this.track.width) / 2,
                                        y: this.track.y,
                                        w: this.bar.width,
                                        h: this.track.height
                                };

                                this.horizontalDraggableArea = {
                                        x: this.track.x,
                                        y: this.track.y - (this.bar.height - this.track.height) / 2,
                                        w: this.track.width,
                                        h: this.bar.height
                                };
                        }
                        /** Ensure the bar starts off where it should be, according to the bar's logical position. */

                }, {
                        key: 'setInitialBarPosition',
                        value: function setInitialBarPosition() {
                                var gripPositionOnTrack = this.getBarPosition();

                                // Make sure the bar is physically where it should be.
                                if (this.vertical) {
                                        this.bar.y = gripPositionOnTrack + this.track.y;
                                } else {
                                        this.bar.x = gripPositionOnTrack + this.track.x;
                                }
                        }
                }, {
                        key: 'getGripPositionRatio',
                        value: function getGripPositionRatio() {
                                var gripPositionOnTrack = this.getBarPosition();
                                var mousePositionDelta = this.getMouseDelta();

                                var newGripPosition = gripPositionOnTrack + mousePositionDelta;

                                // Don't let the content scroll above or below the track's size
                                if (newGripPosition > 0) {
                                        newGripPosition = 0;
                                } else if (newGripPosition <= -this.trackScrollAreaSize) {
                                        newGripPosition = -this.trackScrollAreaSize;
                                }

                                // When the scrollbar is at the top or bottom, prevent a mouse movement that
                                // doesn't move the scrollbar from moving the content.
                                if (this.vertical) {
                                        if (this.bar.y <= this.track.y) {
                                                newGripPosition = 0;
                                        } else if (this.bar.y + this.bar.height >= this.track.y + this.track.height) {
                                                newGripPosition = -this.trackScrollAreaSize;
                                        }
                                } else {
                                        if (this.bar.x <= this.track.x) {
                                                newGripPosition = 0;
                                        } else if (this.bar.x + this.bar.width >= this.track.x + this.track.width) {
                                                newGripPosition = -this.trackScrollAreaSize;
                                        }
                                }

                                var newGripPositionRatio = newGripPosition / this.trackScrollAreaSize;

                                // If the scrollable area is less than the size of the scrollbar,
                                // the bar and track will be the same size.
                                // In this scenario, a divide by zero occurs. Capture that and turn it into zero.
                                if (Number.isNaN(newGripPositionRatio)) {
                                        newGripPositionRatio = 0;
                                }

                                return newGripPositionRatio;
                        }
                }]);
                return Scrollbar;
        }(DraggableBar);

        /**
         * Bar that adjusts a number.
         * This is done by masking the sprite and then resizing the mask.
         * @extends DraggableBar
         */
        var ValueBar = function (_DraggableBar) {
            inherits(ValueBar, _DraggableBar);

            /**
             * @param {Object} game - Current game instance.
             * @param {Object} xy -  Dictionary with the values for the bar's x and y position.
             * @param {Object} values - The numerical values for the bar.
             * @param {boolean} draggable - Determines if the scrollbar responds to mouse clicks.
             * @param {boolean} vertical - Determines if the bar should be vertical or horizontal.
             * @param {string} trackImage - The image key to use for the track.
             * @param {string} barImage - The image key to use for the bar. Will automatically resize to fit.
             * @param {Object} tweenParams - Object with duration and easing function for the scrolling tween.
             */
            function ValueBar(game, xy, values, draggable, vertical, trackImage, barImage, tweenParams) {
                classCallCheck(this, ValueBar);

                var _this = possibleConstructorReturn(this, (ValueBar.__proto__ || Object.getPrototypeOf(ValueBar)).call(this, game, xy.x, xy.y));

                game.add.existing(_this);

                _this.valueRange = new ValueRange(values.step, values.startValue, values.maxValue);

                _this.vertical = vertical || false;
                _this.draggable = draggable || false;

                _this.trackImage = trackImage;
                _this.barImage = barImage;

                _this.tweenParams = tweenParams || { duration: 300, ease: Phaser.Easing.Quadratic.Out };

                // Flag flipped when the track is clicked, switched off after the bar movement is finished.
                _this.trackClicked = false;
                _this.barMoving = false;

                // Records mouse pointer when clicking the bar.
                _this.mousePointer = null;

                // The track is the static area the bar will move along.
                _this.track = _this.game.add.sprite(0, 0, _this.trackImage);
                _this.add(_this.track);

                // If the bar is draggable, clicking the track will move the bar up or down.
                if (_this.draggable) {
                    _this.enableTrackClick();
                }

                // The bar is the part that moves, controlling the value of the scrollbar.
                _this.bar = _this.game.add.button(_this.x, _this.y, _this.barImage, _this.moveContent, _this, 1, 0);

                // Add an invisible background.
                // This ensures the bar can always be entered correctly, no matter where the grip is.
                _this.bg = _this.game.add.graphics(0, 0);
                _this.add(_this.bg);
                _this.sendToBack(_this.bg);
                _this.bg.beginFill(0xff0000, 0);

                if (_this.vertical) {
                    _this.bg.drawRect(0, 0 - _this.bar.height / 2, 1, _this.track.height + _this.bar.height);
                } else {
                    _this.bg.drawRect(0 - _this.bar.width / 2, 0, _this.track.width + _this.bar.width, 1);
                }
                _this.bg.endFill();

                _this.snapping = true;

                _this.add(_this.bar);
                _this.minY = _this.track.y - _this.bar.height / 2;
                _this.maxY = _this.track.y + _this.track.height - _this.bar.height / 2;
                _this.minX = _this.track.x - _this.bar.width / 2;
                _this.maxX = _this.track.x + _this.track.width - _this.bar.width / 2;

                _this.create();

                if (_this.vertical) {
                    _this.upEvent = _this.scrollUp;
                    _this.downEvent = _this.scrollDown;
                } else {
                    _this.upEvent = _this.scrollLeft;
                    _this.downEvent = _this.scrollRight;
                }

                /**
                 * Dispatched when the bar is moved.
                 * @property {Phaser.Signal}
                 */
                _this.onMovement = new Phaser.Signal();
                return _this;
            }

            createClass(ValueBar, [{
                key: 'create',
                value: function create() {
                    this.centerStaticAxis();

                    if (this.draggable) {
                        this.enableBarDrag();
                    }

                    // Determine the distance the window can scroll over
                    this.windowScrollAreaSize = this.valueRange.maxValue - this.valueRange.step;

                    // Represents one fraction of the track.
                    this.vslice = this.track.height * this.valueRange.ratio;
                    this.hslice = this.track.width * this.valueRange.ratio;

                    this.setTrackScrollAreaSize();

                    // Initial position for the bar.
                    this.mousePointer = { x: this.bar.x, y: this.bar.y };

                    this.setInitialBarPosition();
                }
                /** Sets the draggable area of the bar. */

            }, {
                key: 'setDraggableArea',
                value: function setDraggableArea() {
                    this.verticalDraggableArea = {
                        x: this.track.x - (this.bar.width - this.track.width) / 2,
                        y: this.track.y - this.bar.height / 2,
                        w: this.bar.width,
                        h: this.track.height + this.bar.height
                    };

                    this.horizontalDraggableArea = {
                        x: this.track.x - this.bar.width / 2,
                        y: this.track.y - (this.bar.height - this.track.height) / 2,
                        w: this.track.width + this.bar.width,
                        h: this.bar.height
                    };
                }
                /** Determine the distance the bar can scroll over */

            }, {
                key: 'setTrackScrollAreaSize',
                value: function setTrackScrollAreaSize() {
                    if (this.vertical) {
                        this.trackScrollAreaSize = this.track.height;
                    } else {
                        this.trackScrollAreaSize = this.track.width;
                    }
                }
                /** Ensure the bar starts off where it should be, according to the bar's logical position. */

            }, {
                key: 'setInitialBarPosition',
                value: function setInitialBarPosition() {
                    var gripPositionOnTrack = this.getBarPosition();

                    // The bar should always be in centered on it's current position.
                    if (this.vertical) {
                        this.bar.y = gripPositionOnTrack + this.track.y - this.bar.height / 2;
                    } else {
                        this.bar.x = gripPositionOnTrack + this.track.x - this.bar.width / 2;
                    }
                }
                /** Returns the closest valid value. */

            }, {
                key: 'getClosestPosition',
                value: function getClosestPosition() {
                    var currentValue = this.valueRange.getCurrentValue();

                    var diff = Math.abs(currentValue - this.valueRange.steps[0]);
                    var closestPosition = this.valueRange.steps[0];

                    for (var i = 0; i < this.valueRange.steps.length; i++) {
                        var newdiff = Math.abs(currentValue - this.valueRange.steps[i]);
                        if (newdiff < diff) {
                            diff = newdiff;
                            closestPosition = this.valueRange.steps[i];
                        }
                    }

                    return closestPosition;
                }
                /** On mouse up, forces the value to equal the closest step. */

            }, {
                key: 'snapToClosestPosition',
                value: function snapToClosestPosition() {
                    var closestPosition = this.getClosestPosition();

                    this.valueRange.adjustValue(closestPosition);
                    this.moveContent();
                    this.setInitialBarPosition();
                }
                /** Called after a scroll tween is added. Adds the necessary events to the tween. */

            }, {
                key: 'addScrollTweenEvents',
                value: function addScrollTweenEvents(tween) {
                    // Only update the values once the bar has finished moving.
                    tween.onComplete.add(this.moveContent, this);
                    tween.onComplete.add(this.enableBarInput, this);
                }
            }, {
                key: 'getGripPositionRatio',
                value: function getGripPositionRatio() {
                    var gripPositionOnTrack = this.getBarPosition();
                    var mousePositionDelta = this.getMouseDelta();

                    var newGripPosition = gripPositionOnTrack - mousePositionDelta;
                    // Don't let the content scroll above or below the track's size
                    if (newGripPosition < 0) {
                        newGripPosition = 0;
                    } else if (newGripPosition >= this.trackScrollAreaSize) {
                        newGripPosition = this.trackScrollAreaSize;
                    }

                    // When the scrollbar is at the top or bottom, prevent a mouse movement that
                    // doesn't move the scrollbar from moving the content.
                    if (this.vertical) {
                        if (this.bar.y <= this.track.y) {
                            newGripPosition = 0;
                        } else if (this.bar.y + this.bar.height >= this.track.y + this.track.height) {
                            newGripPosition = this.trackScrollAreaSize;
                        }
                    } else {
                        if (this.bar.x <= this.track.x) {
                            newGripPosition = 0;
                        } else if (this.bar.x + this.bar.width >= this.track.x + this.track.width) {
                            newGripPosition = this.trackScrollAreaSize;
                        }
                    }

                    var newGripPositionRatio = newGripPosition / this.trackScrollAreaSize;

                    // If the scrollable area is less than the size of the scrollbar,
                    // the bar and track will be the same size.
                    // In this scenario, a divide by zero occurs. Capture that and turn it into zero.
                    if (Number.isNaN(newGripPositionRatio)) {
                        newGripPositionRatio = 0;
                    }

                    return newGripPositionRatio;
                }
            }]);
            return ValueBar;
        }(DraggableBar);

        /** Sprite with text added as a child.
         * @extends Phaser.Sprite
         */
        var textSprite = function (_Phaser$Sprite) {
          inherits(textSprite, _Phaser$Sprite);

          /**
           * @param {Object} game - Current game instance.
           * @param {string} image - The image to create a sprite with.
           * @param {string} label - The text to place on top of the sprite.
           * @param {Object} style - The style properties to be set on the Text.
           * @param {number} x - The x coordinate on screen where the textSprite will be placed.
           * @param {number} y - The y coordinate on screen where the textSprite will be placed.
           */
          function textSprite(game, image, label, style, x, y) {
            classCallCheck(this, textSprite);

            var _this = possibleConstructorReturn(this, (textSprite.__proto__ || Object.getPrototypeOf(textSprite)).call(this, game, x, y, image));

            game.add.existing(_this);

            _this.text = _this.game.add.text(0, 0, label, style);
            _this.text.anchor.set(0.5, 0.5);

            _this.addChild(_this.text);
            return _this;
          }

          return textSprite;
        }(Phaser.Sprite);

        /** Phaser Button with text added as a child.
         * @extends Phaser.Button
         */
        var textButton = function (_Phaser$Button) {
          inherits(textButton, _Phaser$Button);

          /**
           * @param {Object} game - Current game instance.
           * @param {string} image - The image to create a sprite with.
           * @param {string} label - The text to place on top of the sprite.
           * @param {Object} style - The style properties to be set on the Text.
           * @param {number} x - The x coordinate on screen where the textSprite will be placed.
           * @param {number} y - The y coordinate on screen where the textSprite will be placed.
           * @param {Object} callback - Callback to use when the button is clicked.
           * @param {Object} callbackContext - The context the callback is called in.
           */
          function textButton(game, image, label, style, x, y, callback, callbackContext) {
            classCallCheck(this, textButton);

            var _this2 = possibleConstructorReturn(this, (textButton.__proto__ || Object.getPrototypeOf(textButton)).call(this, game, x, y, image, callback, callbackContext));

            game.add.existing(_this2);

            _this2.text = _this2.game.add.text(0, 0, label, style);
            _this2.text.anchor.set(0.5, 0.5);

            _this2.addChild(_this2.text);
            return _this2;
          }

          return textButton;
        }(Phaser.Button);

        /** Group with a dedicated background image.
         * @extends Phaser.Group
         */
        var Frame = function (_Phaser$Group) {
            inherits(Frame, _Phaser$Group);

            /**
             * @param {Object} game - Current game instance.
             * @param {Number} x - The x position of the Frame.
             * @param {Number} y - The y position of the Frame.
             * @param {string} bg - The background image to use.
             */
            function Frame(game) {
                var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                var bg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
                classCallCheck(this, Frame);

                var _this = possibleConstructorReturn(this, (Frame.__proto__ || Object.getPrototypeOf(Frame)).call(this, game));

                game.add.existing(_this);

                _this.x = x;
                _this.y = y;

                _this.game = game;
                _this.bg = bg;

                // Add background to Frame.
                if (bg !== null) {
                    var bgSprite = game.add.sprite(0, 0, bg);
                    bgSprite.sendToBack();
                    bgSprite.alignIn(_this, Phaser.TOP_LEFT);
                }
                return _this;
            }
            /** Adds a new object into the Column, then aligns it under the previous object.
             * @param {Object} node - The sprite to add to the Column.
             * @param {Number} paddingX - The amount of horizontal space between objects.
             * @param {Number} paddingY - The amount of vertical space between objects.
             * @param {Number} alignment - The alignment relative to the previous child.
             */


            createClass(Frame, [{
                key: 'addNode',
                value: function addNode(node) {
                    var paddingX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                    var paddingY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                    var alignment = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

                    var align = alignment || this.alignment;

                    this.add(node);
                    var previousNode = this.children[this.children.length - 2];

                    if (previousNode !== undefined) {
                        node.alignTo(previousNode, align, paddingX, paddingY);
                    }

                    // Reset the positions for the bar's draggable area.
                    if ('enableBarDrag' in node) {
                        node.enableBarDrag();
                    }
                }
            }]);
            return Frame;
        }(Phaser.Group);

        /** Frame that places new child nodes directly under the previous child.
         * @extends Frame
         */
        var Column = function (_Frame) {
          inherits(Column, _Frame);

          /**
           * @param {Object} game - Current game instance.
           * @param {Number} x - The x position of the Frame.
           * @param {Number} y - The y position of the Frame.
           * @param {string} bg - The background image to use.
           */
          function Column(game) {
            var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var bg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
            classCallCheck(this, Column);

            var _this = possibleConstructorReturn(this, (Column.__proto__ || Object.getPrototypeOf(Column)).call(this, game, x, y, bg));

            _this.alignment = Phaser.BOTTOM_CENTER;
            return _this;
          }

          return Column;
        }(Frame);

        /** Frame that places new child nodes directly next to the previous child.
         * @extends Frame
         */
        var Row = function (_Frame) {
          inherits(Row, _Frame);

          /**
           * @param {Object} game - Current game instance.
           * @param {Number} x - The x position of the Frame.
           * @param {Number} y - The y position of the Frame.
           * @param {string} bg - The background image to use.
           */
          function Row(game) {
            var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var bg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
            classCallCheck(this, Row);

            var _this = possibleConstructorReturn(this, (Row.__proto__ || Object.getPrototypeOf(Row)).call(this, game, x, y, bg));

            _this.alignment = Phaser.RIGHT_CENTER;
            return _this;
          }

          return Row;
        }(Frame);

        /**
         * A container with a limited viewable area. Uses a mask to hide children outside of the specified x/y/width/height area.
         * Content outside the viewport has their input disabled.
         * @extends Phaser.Group
         */
        var Viewport = function (_Phaser$Group) {
            inherits(Viewport, _Phaser$Group);

            /**
             * @param {Object} game - Current game instance.
             * @param {number} x - The x coordinate on screen where the viewport will be placed.
             * @param {number} y - The y coordinate on screen where the viewport will be placed.
             * @param {number} width - The width of the viewport.
             * @param {number} height - The height of the viewport.
             */
            function Viewport(game, x, y, width, height) {
                classCallCheck(this, Viewport);

                var _this = possibleConstructorReturn(this, (Viewport.__proto__ || Object.getPrototypeOf(Viewport)).call(this, game));

                game.add.existing(_this);

                _this.x = x;
                _this.y = y;

                // Viewport size and position, distinct from the total window size.
                _this.area = {
                    x: x,
                    y: y,
                    width: width,
                    height: height
                };

                // Adding the mask attribute to a group hides objects outside the mask.
                _this.mask = _this.game.add.graphics(_this.area.x, _this.area.y);
                _this.mask.beginFill(0x0000ff);
                _this.mask.drawRect(0, 0, width, height);
                _this.mask.endFill();
                return _this;
            }
            /** Adds a new object into the Viewport. */


            createClass(Viewport, [{
                key: "addNode",
                value: function addNode(node) {
                    this.add(node);
                }
                /** Disable input for all objets outside the viewport's visible area.
                 * Recursively checks all the object's children.
                 * @param {Object} children - The objects to disable, if they're outside the viewport.
                 * @param {Object} context - The context the function is run in.
                 * @param {boolean} vertical - If the bounds should be checked horizontally or vertically.
                 */

            }, {
                key: "disableOutOfBounds",
                value: function disableOutOfBounds(children, context, vertical) {
                    var child = void 0;
                    var location = void 0;
                    var contentLocation = void 0;
                    var trueCoords = void 0;

                    // Makes sure the recursive function stops when there's no children.
                    if (children !== undefined) {
                        for (var i = 0; i < children.length; i++) {
                            child = children[i];
                            child.inputEnabled = true;

                            // An object's x/y is relative to it's parent.
                            // The world gives an x/y relative to the whole game.
                            trueCoords = child.world || child;

                            if (vertical) {
                                location = trueCoords.y;
                                contentLocation = context.viewport.area.y;
                            } else {
                                location = trueCoords.x;
                                contentLocation = context.viewport.area.x;
                            }

                            if (location < contentLocation) {
                                child.inputEnabled = false;
                            }

                            this.disableOutOfBounds(child.children, context, vertical);
                        }
                    }
                }
            }]);
            return Viewport;
        }(Phaser.Group);

        /** Collection of sprites that can be selected with the keyboard.
          * When the select key is hit, the sprite that was selected is now connected to the keyboard.
          */
        var KeyboardGroup = function () {
                /**
                  * @param {Object} game - Current game instance.
                  * @param {Boolean} vertical - If the selection should be controlled with up/down or left/right arrow keys.
                  * @param {Object} callbackContext - The context for the onPrevious and onNext Signals.
                  */
                function KeyboardGroup(game, vertical, callbackContext) {
                        classCallCheck(this, KeyboardGroup);

                        this.game = game;
                        this.vertical = vertical || false;
                        this.callbackContext = callbackContext;

                        this.children = [];

                        this.selected = null;
                        this.idx = 0;

                        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
                        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
                        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
                        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

                        this.upEvent = this.prevItem;
                        this.downEvent = this.nextItem;

                        /**
                         * Dispatched when the selected child is set from the current child to the previous child.
                         * @property {Phaser.Signal}
                         */
                        this.onPrevious = new Phaser.Signal();

                        /**
                         * Dispatched when the selected child is set from the current child to the next child.
                         * @property {Phaser.Signal}
                         */
                        this.onNext = new Phaser.Signal();

                        this.activateGroup();
                }
                /** Add a new child to the group
                  * @param {Object} newNode - The sprite to add to the group.
                  */


                createClass(KeyboardGroup, [{
                        key: "addNode",
                        value: function addNode(newNode) {
                                this.children.push(newNode);

                                // Ensure the first child is already selected  when the game loads.
                                this.selected = this.children[0]; // eslint-disable-line prefer-destructuring
                                this.useBar();
                        }
                        /** Selects the previous child. */

                }, {
                        key: "prevItem",
                        value: function prevItem() {
                                this.idx = this.idx - 1;

                                if (this.idx < 0) {
                                        this.idx = this.children.length - 1;
                                }

                                this.selected = this.children[this.idx];

                                this.useBar();

                                this.onPrevious.dispatch(this, this.callbackContext);
                        }
                        /** Selects the next child. */

                }, {
                        key: "nextItem",
                        value: function nextItem() {
                                this.idx = (this.idx + 1) % this.children.length;
                                this.selected = this.children[this.idx];

                                this.useBar();

                                this.onNext.dispatch(this, this.callbackContext);
                        }
                        /**
                         * Enables keyboard input for the group.
                         * @private
                         */

                }, {
                        key: "activateGroup",
                        value: function activateGroup() {
                                if (this.vertical) {
                                        this.upKey.onDown.add(this.upEvent, this);
                                        this.downKey.onDown.add(this.downEvent, this);
                                } else {
                                        this.leftKey.onDown.add(this.upEvent, this);
                                        this.rightKey.onDown.add(this.downEvent, this);
                                }
                        }
                        /**
                         * Enables keyboard input on a child.
                         * @private
                         */

                }, {
                        key: "useBar",
                        value: function useBar() {
                                if (this.vertical) {
                                        this.leftKey.onDown.removeAll();
                                        this.rightKey.onDown.removeAll();

                                        this.leftKey.onDown.add(this.selected.upEvent, this.selected);
                                        this.rightKey.onDown.add(this.selected.downEvent, this.selected);
                                } else {
                                        this.upKey.onDown.removeAll();
                                        this.downKey.onDown.removeAll();

                                        this.upKey.onDown.add(this.selected.upEvent, this.selected);
                                        this.downKey.onDown.add(this.selected.downEvent, this.selected);
                                }
                        }
                }]);
                return KeyboardGroup;
        }();

        var utils = {};

        /**
         * A modulo operator that doesn't allow negative numbers.
         * @param {number} divdend
         * @param {number} divisor
         */
        utils.modulo = function modulo(dividend, divisor) {
          return (dividend % divisor + divisor) % divisor;
        };

        /**
         * Select an operator action using a string value.
         */
        utils.operators = {
          '+': function add(a, b) {
            return a + b;
          },
          '-': function sub(a, b) {
            return a - b;
          }
        };

        /**
         * Represents a single point in a Wheel3D.
         * @ignore
         */

        var VectorPoint = function () {
            /**
             * @ignore
             * @param {number} x - The point's virtual x location.
             * @param {number} y - The point's virtual y location.
             * @param {number} z - The point's virtual z location.
             * @param {Object} sprite - The sprite associated with this point.
             * @param {number} position - The point's position on the Wheel3D.
             */
            function VectorPoint() {
                var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                var sprite = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
                var position = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
                classCallCheck(this, VectorPoint);

                this.x = x;
                this.y = y;
                this.z = z;
                this.sprite = sprite;
                this.position = position;
            }

            createClass(VectorPoint, [{
                key: 'getSinCosOfAngle',
                value: function getSinCosOfAngle(angle) {
                    // eslint-disable-line class-methods-use-this
                    var rad = angle * Math.PI / 180;
                    var cosAngle = Math.cos(rad);
                    var sinAngle = Math.sin(rad);

                    return { cosine: cosAngle, sine: sinAngle };
                }
            }, {
                key: 'rotateY',
                value: function rotateY(angle) {
                    var angles = this.getSinCosOfAngle(angle);
                    var z = this.z * angles.cosine - this.x * angles.sine;
                    var x = this.z * angles.sine + this.x * angles.cosine;

                    return new VectorPoint(x, this.y, z);
                }
            }, {
                key: 'rotateX',
                value: function rotateX(angle) {
                    var angles = this.getSinCosOfAngle(angle);
                    var y = this.y * angles.cosine - this.z * angles.sine;
                    var z = this.y * angles.sine + this.z * angles.cosine;

                    return new VectorPoint(this.x, y, z);
                }
            }, {
                key: 'rotateZ',
                value: function rotateZ(angle) {
                    var angles = this.getSinCosOfAngle(angle);
                    var x = this.x * angles.cosine - this.y * angles.sine;
                    var y = this.x * angles.sine + this.y * angles.cosine;

                    return new VectorPoint(x, y, this.z);
                }
                /** Rotate the point along the given axis by the given angle.
                * @param {string} axis - The axis to rotate.
                * @param {number} angle - The angle to rotate by.
                */

            }, {
                key: 'rotate',
                value: function rotate(axis, angle) {
                    if (axis === 'x') {
                        return this.rotateX(angle);
                    } else if (axis === 'y') {
                        return this.rotateY(angle);
                    } else if (axis === 'z') {
                        return this.rotateZ(angle);
                    }

                    return null;
                }
                /** Project the point to the correct physical location on screen.
                 * z axis is not projected, because screens are 2D.
                 */

            }, {
                key: 'project',
                value: function project(width, height, factor) {
                    var x = this.x * factor + width;
                    var y = -this.y * factor + height;

                    return new VectorPoint(x, y, this.z);
                }
            }]);
            return VectorPoint;
        }();

        /**
         * A Wheel of sprites where each item's position is projected in 3D space.
         * The number of points is automatically determined by the number of items.
         */


        var Wheel3D = function () {
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
            function Wheel3D(game, xy, sprites, firstPlace, zoom, axis, rotations, visibleRange, tweenParams) {
                classCallCheck(this, Wheel3D);

                this.game = game;
                this.xy = xy;
                this.sprites = sprites;
                this.firstPlace = firstPlace;
                this.zoom = zoom;
                this.axis = axis;
                this.rotationAxis = rotations;
                this.visibleRange = visibleRange || null;
                this.tweenParams = tweenParams || { duration: 300, ease: Phaser.Easing.Quadratic.Out };

                // Signals
                this.onStart = new Phaser.Signal();
                this.onComplete = new Phaser.Signal();
                this.onBackComplete = new Phaser.Signal();
                this.onForwardComplete = new Phaser.Signal();

                // Group to store wheel sprites in, used for zindex sorting.
                this.group = this.game.add.group();
            }

            createClass(Wheel3D, [{
                key: 'activate',
                value: function activate() {
                    var angle = void 0;
                    var radCos = void 0;
                    var radSin = void 0;
                    var nx = void 0;
                    var ny = void 0;
                    var nz = void 0;

                    this.pointsAmount = this.sprites.length;
                    this.totalPositions = this.pointsAmount - 1;
                    this.rotationAmount = 360 / this.pointsAmount;

                    // Determines which items in the wheel should be visible.
                    if (this.visibleRange !== null) {
                        var allPositions = [];
                        for (var i = 0; i <= this.totalPositions; i++) {
                            allPositions.push(i);
                        }

                        var maxV = allPositions.slice(0, this.visibleRange.max);
                        var minV = allPositions.slice(this.visibleRange.min);

                        this.visiblePositions = maxV.concat(minV);
                    }

                    // Prevents slamming down the move keys.
                    this.moving = false;

                    // Stores the direction the wheel is moving in.
                    this.direction = null;

                    // Set point positions on logical circle.
                    this.wheelItems = [];
                    var radius = 1;
                    var slice = 2 * Math.PI / this.pointsAmount;

                    // For a vertical wheel, the X axis is -1. Points are laid out on the Y axis (height) and Z axis (depth). The wheel rotates around the X axis.
                    // For a horizontal wheel, the Y Axis is -1. Points are laid out on the X axis (width) and Z axis (depth). The wheel rotates around the Y axis.
                    // For flat circular wheel, the Z Axis is -1. Points are laid out on the X axis (width) and Y axis (height). The wheel rotates around the Z axis.
                    for (var _i = 0; _i < this.pointsAmount; _i++) {
                        // Add sprite to group.
                        this.sprites[_i].wheelPosition = _i;
                        this.group.add(this.sprites[_i]);

                        angle = slice * _i;
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

                        this.wheelItems.push(new VectorPoint(nx, ny, nz, this.sprites[_i], _i));
                    }

                    // Active Point
                    this.active = this.wheelItems[this.firstPlace].sprite;

                    this.project();
                }
                /** Move the wheel backwards. */

            }, {
                key: 'moveBack',
                value: function moveBack() {
                    if (this.moving === false) {
                        this.moving = true;
                        this.direction = 0;

                        if (this.axis === 'x' || this.axis === 'z') {
                            this.rotationAxis[this.axis] += this.rotationAmount;
                        } else {
                            // y axis needs to go in the opposite direction.
                            this.rotationAxis[this.axis] -= this.rotationAmount;
                        }

                        this.updatePosition('+');

                        this.project();
                        this.resetAngle();
                    }
                }
                /** Move the wheel forward. */

            }, {
                key: 'moveForward',
                value: function moveForward() {
                    if (this.moving === false) {
                        this.moving = true;
                        this.direction = 1;

                        if (this.axis === 'x' || this.axis === 'z') {
                            this.rotationAxis[this.axis] -= this.rotationAmount;
                        } else {
                            // y axis needs to go in the opposite direction.
                            this.rotationAxis[this.axis] += this.rotationAmount;
                        }

                        this.updatePosition('-');

                        this.project();
                        this.resetAngle();
                    }
                }
                /** Project every item in the wheel to it's physical location. */

            }, {
                key: 'project',
                value: function project() {
                    var newTween = void 0;

                    // Create a list with the axes, then remove the projected axis.
                    var arr = ['x', 'y', 'z'];
                    var idx = arr.indexOf(this.axis);
                    arr.splice(idx, 1);

                    // We only need to call all this when moving. It doesn't need to be done
                    // every update
                    for (var i = 0; i < this.wheelItems.length; i++) {
                        // Rotate along the projected axis
                        var rotationOne = this.wheelItems[i].rotate(this.axis, this.rotationAxis[this.axis]);

                        // Rotate the other 2 axes
                        var rotationTwo = rotationOne.rotate(arr[0], this.rotationAxis[arr[0]]);
                        var rotationThree = rotationTwo.rotate(arr[1], this.rotationAxis[arr[1]]);

                        var p = rotationThree.project(this.xy.x, this.xy.y, this.zoom);

                        var transformed = this.wheelItems[i].sprite;
                        transformed.lz = p.z;

                        // Ensure active sprite has no scale/alpha changes.
                        if (this.wheelItems[i].position === this.firstPlace) {
                            transformed.alpha = 1.0;
                            this.active = this.wheelItems[i].sprite;
                        } else {
                            if (this.visibleRange !== null) {
                                var includes = this.visiblePositions.includes(this.wheelItems[i].position);
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

                        // Tween to new position
                        newTween = this.game.add.tween(transformed).to({ x: p.x, y: p.y }, this.tweenParams.duration, this.tweenParams.ease, true);

                        newTween.onComplete.add(this.enableMoving, this);
                    }

                    // Sort wheelItems by the projection's z axis for correct z-order when drawing.
                    this.group.sort('lz', Phaser.Group.SORT_ASCENDING);

                    // Wheel's signals are dispatched by the tween's.
                    newTween.onStart.add(this.dispatchOnStart, this);
                    newTween.onComplete.add(this.dispatchOnComplete, this);
                }
                /** Called after movement starts. */

            }, {
                key: 'dispatchOnStart',
                value: function dispatchOnStart() {
                    this.onStart.dispatch(this);
                }
                /** Called after movement is finished. */

            }, {
                key: 'dispatchOnComplete',
                value: function dispatchOnComplete() {
                    if (this.direction === 0) {
                        this.onBackComplete.dispatch(this);
                    } else if (this.direction === 1) {
                        this.onForwardComplete.dispatch(this);
                    }

                    this.onComplete.dispatch(this);
                }
                /** Once the buttons have finished their move animation, allow them to move again. */

            }, {
                key: 'enableMoving',
                value: function enableMoving() {
                    this.moving = false;
                }
                /** Move all the WheelItem's position by 1. */

            }, {
                key: 'updatePosition',
                value: function updatePosition(operator) {
                    for (var i = 0; i < this.wheelItems.length; i++) {
                        var position = this.wheelItems[i].position;

                        this.wheelItems[i].position = utils.operators[operator](position, 1);

                        var m = utils.modulo(this.wheelItems[i].position, this.pointsAmount);
                        this.wheelItems[i].position = m;
                        this.wheelItems[i].sprite.wheelPosition = m;
                    }
                }
                /** Make sure rotation can't go past 360 in either direction. */

            }, {
                key: 'resetAngle',
                value: function resetAngle() {
                    var angle = this.rotationAxis[this.axis];

                    if (angle === 360 || angle === -360) {
                        this.rotationAxis[this.axis] = 0;
                    }
                }
            }]);
            return Wheel3D;
        }();

        exports.Bar = Bar;
        exports.DraggableBar = DraggableBar;
        exports.QuantityBar = QuantityBar;
        exports.QuantityRange = QuantityRange;
        exports.ValueRange = ValueRange;
        exports.ViewportRange = ViewportRange;
        exports.Scrollbar = Scrollbar;
        exports.ValueBar = ValueBar;
        exports.textSprite = textSprite;
        exports.textButton = textButton;
        exports.Column = Column;
        exports.Frame = Frame;
        exports.Row = Row;
        exports.Viewport = Viewport;
        exports.KeyboardGroup = KeyboardGroup;
        exports.utils = utils;
        exports.Wheel3D = Wheel3D;

        Object.defineProperty(exports, '__esModule', { value: true });

})));
