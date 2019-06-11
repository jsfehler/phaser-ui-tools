!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("uiWidgets",[],e):"object"==typeof exports?exports.uiWidgets=e():t.uiWidgets=e()}(window,function(){return function(t){var e={};function i(r){if(e[r])return e[r].exports;var n=e[r]={i:r,l:!1,exports:{}};return t[r].call(n.exports,n,n.exports,i),n.l=!0,n.exports}return i.m=t,i.c=e,i.d=function(t,e,r){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(r,n,function(e){return t[e]}.bind(null,n));return r},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?s(t):e}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function s(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function h(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}i.r(e);var c=function(t){function e(t,i,r,h,u,c){var l;return n(this,e),l=o(this,a(e).call(this,t,u,c,i)),t.add.existing(s(l)),l.text=l.game.add.text(0,0,r,h),l.text.anchor.set(.5,.5),l.addChild(l.text),l}return h(e,Phaser.Sprite),e}(),l=function(t){function e(t,i,r,h,u,c,l,f){var p;return n(this,e),p=o(this,a(e).call(this,t,u,c,i,l,f)),t.add.existing(s(p)),p.text=p.game.add.text(0,0,r,h),p.text.anchor.set(.5,.5),p.addChild(p.text),p}return h(e,Phaser.Button),e}(),f={};function p(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function y(t,e){for(var i=0;i<e.length;i++){var r=e[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function b(t,e,i){return e&&y(t.prototype,e),i&&y(t,i),t}f.modulo=function(t,e){return(t%e+e)%e},f.operators={"+":function(t,e){return t+e},"-":function(t,e){return t-e}};var v=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0;p(this,t),this.x=e,this.y=i,this.z=r,this.sprite=n,this.position=o}return b(t,[{key:"getSinCosOfAngle",value:function(t){var e=t*Math.PI/180;return{cosine:Math.cos(e),sine:Math.sin(e)}}},{key:"rotateY",value:function(e){var i=this.getSinCosOfAngle(e),r=this.z*i.cosine-this.x*i.sine;return new t(this.z*i.sine+this.x*i.cosine,this.y,r)}},{key:"rotateX",value:function(e){var i=this.getSinCosOfAngle(e),r=this.y*i.cosine-this.z*i.sine,n=this.y*i.sine+this.z*i.cosine;return new t(this.x,r,n)}},{key:"rotateZ",value:function(e){var i=this.getSinCosOfAngle(e);return new t(this.x*i.cosine-this.y*i.sine,this.x*i.sine+this.y*i.cosine,this.z)}},{key:"rotate",value:function(t,e){var i=null;return"x"===t?i=this.rotateX(e):"y"===t?i=this.rotateY(e):"z"===t&&(i=this.rotateZ(e)),i}},{key:"project",value:function(e,i,r){return new t(this.x*r+e,-this.y*r+i,this.z)}}]),t}(),d=function(){function t(e,i,r,n,o,a,s,h,u){p(this,t),this.game=e,this.xy=i,this.sprites=r,this.firstPlace=n,this.zoom=o,this.axis=a,this.rotationAxis=s,this.visibleRange=h||null,this.tweenParams=u||{duration:300,ease:Phaser.Easing.Quadratic.Out},this.onStart=new Phaser.Signal,this.onComplete=new Phaser.Signal,this.onBackComplete=new Phaser.Signal,this.onForwardComplete=new Phaser.Signal,this.group=this.game.add.group()}return b(t,[{key:"activate",value:function(){var t,e,i,r,n,o;if(this.pointsAmount=this.sprites.length,this.totalPositions=this.pointsAmount-1,this.rotationAmount=360/this.pointsAmount,null!==this.visibleRange){for(var a=[],s=0;s<=this.totalPositions;s++)a.push(s);var h=a.slice(0,this.visibleRange.max),u=a.slice(this.visibleRange.min);this.visiblePositions=h.concat(u)}this.moving=!1,this.direction=null,this.wheelItems=[];for(var c=2*Math.PI/this.pointsAmount,l=0;l<this.pointsAmount;l++)this.sprites[l].wheelPosition=l,this.group.add(this.sprites[l]),t=c*l,e=1*Math.cos(t),i=1*Math.sin(t),"x"===this.axis?(r=-1,n=e,o=i):"y"===this.axis?(r=e,n=-1,o=i):"z"===this.axis&&(r=e,n=i,o=-1),this.wheelItems.push(new v(r,n,o,this.sprites[l],l));this.active=this.wheelItems[this.firstPlace].sprite,this.project()}},{key:"moveBack",value:function(){!1===this.moving&&(this.moving=!0,this.direction=0,"x"===this.axis||"z"===this.axis?this.rotationAxis[this.axis]+=this.rotationAmount:this.rotationAxis[this.axis]-=this.rotationAmount,this.updatePosition("+"),this.project(),this.resetAngle())}},{key:"moveForward",value:function(){!1===this.moving&&(this.moving=!0,this.direction=1,"x"===this.axis||"z"===this.axis?this.rotationAxis[this.axis]-=this.rotationAmount:this.rotationAxis[this.axis]+=this.rotationAmount,this.updatePosition("-"),this.project(),this.resetAngle())}},{key:"project",value:function(){var t,e=["x","y","z"],i=e.indexOf(this.axis);e.splice(i,1);for(var r=0;r<this.wheelItems.length;r++){var n=this.wheelItems[r].rotate(this.axis,this.rotationAxis[this.axis]).rotate(e[0],this.rotationAxis[e[0]]).rotate(e[1],this.rotationAxis[e[1]]).project(this.xy.x,this.xy.y,this.zoom),o=this.wheelItems[r].sprite;if(o.lz=n.z,this.wheelItems[r].position===this.firstPlace)o.alpha=1,this.active=this.wheelItems[r].sprite;else if(null!==this.visibleRange){var a=this.visiblePositions.includes(this.wheelItems[r].position);o.alpha=a?1:0}(t=this.game.add.tween(o).to({x:n.x,y:n.y},this.tweenParams.duration,this.tweenParams.ease,!0)).onComplete.add(this.enableMoving,this)}this.group.sort("lz",Phaser.Group.SORT_ASCENDING),t.onStart.add(this.dispatchOnStart,this),t.onComplete.add(this.dispatchOnComplete,this)}},{key:"dispatchOnStart",value:function(){this.onStart.dispatch(this)}},{key:"dispatchOnComplete",value:function(){0===this.direction?this.onBackComplete.dispatch(this):1===this.direction&&this.onForwardComplete.dispatch(this),this.onComplete.dispatch(this)}},{key:"enableMoving",value:function(){this.moving=!1}},{key:"updatePosition",value:function(t){for(var e=0;e<this.wheelItems.length;e++){var i=this.wheelItems[e].position;this.wheelItems[e].position=f.operators[t](i,1);var r=f.modulo(this.wheelItems[e].position,this.pointsAmount);this.wheelItems[e].position=r,this.wheelItems[e].sprite.wheelPosition=r}}},{key:"resetAngle",value:function(){var t=this.rotationAxis[this.axis];360!==t&&-360!==t||(this.rotationAxis[this.axis]=0)}}]),t}();function g(t){return(g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function m(t,e){for(var i=0;i<e.length;i++){var r=e[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function w(t,e){return!e||"object"!==g(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function k(t){return(k=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function x(t,e){return(x=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var S=function(t){function e(t){var i,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o=arguments.length>3&&void 0!==arguments[3]&&arguments[3];return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(i=w(this,k(e).call(this,t))).game=t,i.x=r,i.y=n,i.vertical=o,i}var i,r,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&x(t,e)}(e,Phaser.Group),i=e,(r=[{key:"setTrackScrollAreaSize",value:function(){this.vertical?this.trackScrollAreaSize=this.track.height-this.vslice:this.trackScrollAreaSize=this.track.width-this.hslice}},{key:"centerStaticAxis",value:function(){this.vertical?this.bar.x=this.track.x+this.track.width/2-this.bar.width/2:this.bar.y=this.track.y+this.track.height/2-this.bar.height/2}}])&&m(i.prototype,r),n&&m(i,n),e}();function O(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function P(t,e){for(var i=0;i<e.length;i++){var r=e[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _(t,e,i){return e&&P(t.prototype,e),i&&P(t,i),t}var j=function(){function t(e,i,r){O(this,t),this.bar=e,this.startValue=i,this.maxValue=r,this.currentValue=i}return _(t,[{key:"getRatio",value:function(){return this.currentValue/this.maxValue}},{key:"getCurrentValue",value:function(){return this.currentValue}}]),t}(),T=function(){function t(e,i,r){O(this,t),this.step=e,this.startValue=i,this.maxValue=r+e,this.ratio=e/r,this.ratio>1&&(this.ratio=1),this.currentValue=i,this.steps=[];for(var n=0;n<this.maxValue;n+=e)this.steps.push(n)}return _(t,[{key:"adjustValue",value:function(t){this.currentValue=t}},{key:"getCurrentValue",value:function(){return this.currentValue}}]),t}(),R=function(){function t(e,i){O(this,t),this.viewport=e,this.vertical=i,i?(this.step=e.area.height,this.maxValue=e.height):(this.step=e.area.width,this.maxValue=e.width),this.ratio=this.step/this.maxValue,this.ratio>1&&(this.ratio=1)}return _(t,[{key:"adjustValue",value:function(t){this.vertical?this.viewport.y=t+this.viewport.area.y:this.viewport.x=t+this.viewport.area.x,this.viewport.disableOutOfBounds(this.viewport.children,this,this.vertical)}},{key:"getCurrentValue",value:function(){return this.vertical?this.viewport.y-this.viewport.area.y:this.viewport.x-this.viewport.area.x}}]),t}();function E(t){return(E="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function C(t,e){for(var i=0;i<e.length;i++){var r=e[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function A(t){return(A=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function z(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function B(t,e){return(B=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var I=function(t){function e(t,i,r,n,o,a,s,h){var u,c,l;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),c=this,u=!(l=A(e).call(this,t,i.x,i.y))||"object"!==E(l)&&"function"!=typeof l?z(c):l,t.add.existing(z(u)),u.valueRange=new j(z(u),r.startValue,r.maxValue),u.vertical=n||!1,u.reverse=o||!1,u.trackImage=a,u.barImage=s,u.tweenParams=h||{duration:300,ease:Phaser.Easing.Quadratic.Out},u.track=u.game.add.sprite(0,0,u.trackImage),u.add(u.track),u.bar=u.game.add.button(0,0,u.barImage,u.moveContent,z(u),1,0),u.add(u.bar),u.create(),u}var i,r,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&B(t,e)}(e,S),i=e,(r=[{key:"setMask",value:function(){null!==this.bar.mask&&(this.bar.mask.destroy(),this.bar.mask=null);var t=this.game.add.graphics(this.maskX,this.maskY);t.beginFill(255),t.drawRect(0,0,this.maskW,this.maskH),this.bar.mask=t,this.add(t)}},{key:"getBarPosition",value:function(){var t=this.valueRange.getRatio()/this.windowScrollAreaSize;return this.trackScrollAreaSize*t}},{key:"create",value:function(){this.centerStaticAxis(),this.maskW=this.bar.width,this.maskH=this.bar.height,this.maskX=this.bar.x,this.maskY=this.bar.y,this.vertical?this.maskH=this.getBarSize():this.maskW=this.getBarSize(),this.reverse&&(this.vertical?this.maskY=this.getBarFraction():this.maskX=this.getBarFraction()),this.setMask(),this.windowScrollAreaSize=this.valueRange.maxValue,this.vslice=this.track.height*this.valueRange.getRatio(),this.hslice=this.track.width*this.valueRange.getRatio(),this.setTrackScrollAreaSize()}},{key:"addScrollTweenMask",value:function(t){this.game.add.tween(this.bar.mask).to(t,this.tweenParams.duration,this.tweenParams.ease,!0)}},{key:"adjustBar",value:function(t){var e;this.valueRange.currentValue+=t;var i=this.getBarSize();e=this.reverse?this.vertical?{height:i,y:this.getBarFraction()}:{width:i,x:this.getBarFraction()}:this.vertical?{height:i}:{width:i},this.addScrollTweenMask(e)}},{key:"getBarFraction",value:function(){return this.vertical?this.track.height*this.valueRange.getRatio():this.track.width*this.valueRange.getRatio()}},{key:"getBarSize",value:function(){return this.reverse?this.vertical?this.track.height-this.valueRange.getRatio():this.track.width-this.valueRange.getRatio():this.getBarFraction()}}])&&C(i.prototype,r),n&&C(i,n),e}();function M(t){return(M="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function V(t,e){for(var i=0;i<e.length;i++){var r=e[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function D(t,e){return!e||"object"!==M(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function F(t){return(F=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function N(t,e){return(N=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var G=function(t){function e(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),D(this,F(e).apply(this,arguments))}var i,r,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&N(t,e)}(e,S),i=e,(r=[{key:"verticalTrackClick",value:function(){var t=this.game.input.mousePointer.y;t>this.bar.y+this.worldPosition.y+this.bar.height?this.scrollDown():t<this.bar.y+this.worldPosition.y&&this.scrollUp()}},{key:"horizontalTrackClick",value:function(){var t=this.game.input.mousePointer.x;t>this.bar.x+this.bar.width+this.worldPosition.x?this.scrollRight():t<this.bar.x+this.worldPosition.x&&this.scrollLeft()}},{key:"enableTrackClick",value:function(){var t;this.track.inputEnabled=!0,t=this.vertical?this.verticalTrackClick:this.horizontalTrackClick,this.track.events.onInputDown.add(t,this)}},{key:"enableBarInput",value:function(){this.trackClicked=!1,this.barMoving=!1,this.bar.inputEnabled=!0}},{key:"enableBarDrag",value:function(){var t;this.setDraggableArea(),this.bar.inputEnabled=!0,this.bar.input.enableDrag(),this.snapping&&this.bar.events.onInputUp.add(this.snapToClosestPosition,this),this.bar.events.onInputDown.add(this.saveMousePosition,this),this.bar.events.onDragUpdate.add(this.moveContent,this),this.vertical?(this.bar.input.allowHorizontalDrag=!1,t=this.verticalDraggableArea):(this.bar.input.allowVerticalDrag=!1,t=this.horizontalDraggableArea),this.bar.input.boundsRect=new Phaser.Rectangle(t.x,t.y,t.w,t.h)}},{key:"saveMousePosition",value:function(t,e){this.mousePointer={x:e.x,y:e.y}}},{key:"getBarPosition",value:function(){var t=this.valueRange.getCurrentValue()/this.windowScrollAreaSize;return this.trackScrollAreaSize*t}},{key:"getMouseDelta",value:function(){var t,e,i;if(t=this.vertical?this.mousePointer.y:this.mousePointer.x,this.trackClicked)e={x:this.bar.x,y:this.bar.y};else{var r=this.game.input.mousePointer;e={x:r.x,y:r.y}}return i=this.vertical?e.y:e.x,this.mousePointer=e,i<(this.vertical?this.track.height+this.worldPosition.y:this.track.width+this.worldPosition.x)?t-i:0}},{key:"addScrollTween",value:function(t){this.mousePointer={x:this.bar.x,y:this.bar.y},this.trackClicked=!0;var e=this.game.add.tween(this.bar).to(t,this.tweenParams.duration,this.tweenParams.ease,!0);this.addScrollTweenEvents(e)}},{key:"addScrollTweenEvents",value:function(t){t.onUpdateCallback(this.moveContent,this),t.onComplete.add(this.enableBarInput,this)}},{key:"scrollUp",value:function(){if(this.bar.y!==this.track.y&&!this.barMoving){var t=this.bar.y-this.vslice,e=null;this.barMoving=!0,e=t<=this.track.y?this.minY:this.bar.y-this.vslice,this.addScrollTween({y:e})}}},{key:"scrollDown",value:function(){if(this.bar.y+this.bar.height!==this.track.y+this.track.height&&!this.barMoving){var t=this.bar.y+2*this.vslice,e=null;this.barMoving=!0,this.bar.inputEnabled=!1,e=t>=this.track.y+this.track.height?this.maxY:this.bar.y+this.vslice,this.addScrollTween({y:e})}}},{key:"scrollLeft",value:function(){if(this.bar.x!==this.track.x&&!this.barMoving){var t=this.bar.x-this.hslice,e=null;this.barMoving=!0,this.bar.inputEnabled=!1,e=t<=this.track.x?this.minX:this.bar.x-this.hslice,this.addScrollTween({x:e})}}},{key:"scrollRight",value:function(){if(this.bar.x+this.bar.width!==this.track.x+this.track.width&&!this.barMoving){var t=this.bar.x+2*this.hslice,e=null;this.barMoving=!0,this.bar.inputEnabled=!1,e=t>=this.track.x+this.track.width?this.maxX:this.bar.x+this.hslice,this.addScrollTween({x:e})}}},{key:"moveContent",value:function(){var t=this.getGripPositionRatio()*this.windowScrollAreaSize;this.valueRange.adjustValue(t),this.onMovement.dispatch(this)}}])&&V(i.prototype,r),n&&V(i,n),e}();function X(t){return(X="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Y(t,e){for(var i=0;i<e.length;i++){var r=e[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function H(t){return(H=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function L(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function W(t,e){return(W=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var U=function(t){function e(t,i,r,n,o,a,s){var h,u,c;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),u=this,h=!(c=H(e).call(this,t))||"object"!==X(c)&&"function"!=typeof c?L(u):c,t.add.existing(L(h)),h.content=i,h.valueRange=new R(i,n),h.vertical=n||!1,h.draggable=r||!1,h.trackImage=o,h.barImage=a,h.minBarSize=44,h.tweenParams=s||{duration:300,ease:Phaser.Easing.Quadratic.Out},h.trackClicked=!1,h.barMoving=!1,h.mousePointer=null,h.track=h.game.add.sprite(0,0,h.trackImage),h.add(h.track),h.draggable&&h.enableTrackClick(),h.bar=h.game.add.button(h.x,h.y,h.barImage,h.moveContent,L(h),1,0),h.add(h.bar),h.resizeBar(),h.minY=h.track.y,h.maxY=h.track.y+h.track.height-h.bar.height,h.minX=h.track.x,h.maxX=h.track.x+h.track.width-h.bar.width,h.create(),h.onMovement=new Phaser.Signal,h}var i,r,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&W(t,e)}(e,G),i=e,(r=[{key:"resizeBar",value:function(){var t;(t=this.vertical?this.track.height*this.valueRange.ratio:this.track.width*this.valueRange.ratio)<this.minBarSize&&(t=this.minBarSize),this.vertical?this.bar.height=t:this.bar.width=t}},{key:"create",value:function(){this.centerStaticAxis(),this.draggable&&this.enableBarDrag(),this.windowScrollAreaSize=this.valueRange.maxValue-this.valueRange.step,this.vslice=this.track.height*this.valueRange.ratio,this.hslice=this.track.width*this.valueRange.ratio,this.setTrackScrollAreaSize(),this.mousePointer={x:this.bar.x,y:this.bar.y},this.setInitialBarPosition()}},{key:"setDraggableArea",value:function(){this.verticalDraggableArea={x:this.track.x-(this.bar.width-this.track.width)/2,y:this.track.y,w:this.bar.width,h:this.track.height},this.horizontalDraggableArea={x:this.track.x,y:this.track.y-(this.bar.height-this.track.height)/2,w:this.track.width,h:this.bar.height}}},{key:"setInitialBarPosition",value:function(){var t=this.getBarPosition();this.vertical?this.bar.y=t+this.track.y:this.bar.x=t+this.track.x}},{key:"getGripPositionRatio",value:function(){var t=this.getBarPosition()+this.getMouseDelta();t>0?t=0:t<=-this.trackScrollAreaSize&&(t=-this.trackScrollAreaSize),this.vertical?this.bar.y<=this.track.y?t=0:this.bar.y+this.bar.height>=this.track.y+this.track.height&&(t=-this.trackScrollAreaSize):this.bar.x<=this.track.x?t=0:this.bar.x+this.bar.width>=this.track.x+this.track.width&&(t=-this.trackScrollAreaSize);var e=t/this.trackScrollAreaSize;return Number.isNaN(e)&&(e=0),e}}])&&Y(i.prototype,r),n&&Y(i,n),e}();function Q(t){return(Q="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Z(t,e){for(var i=0;i<e.length;i++){var r=e[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function q(t){return(q=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function J(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function K(t,e){return(K=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var $=function(t){function e(t,i,r,n,o,a,s,h){var u,c,l;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),c=this,u=!(l=q(e).call(this,t,i.x,i.y))||"object"!==Q(l)&&"function"!=typeof l?J(c):l,t.add.existing(J(u)),u.valueRange=new T(r.step,r.startValue,r.maxValue),u.vertical=o||!1,u.draggable=n||!1,u.trackImage=a,u.barImage=s,u.tweenParams=h||{duration:300,ease:Phaser.Easing.Quadratic.Out},u.trackClicked=!1,u.barMoving=!1,u.mousePointer=null,u.track=u.game.add.sprite(0,0,u.trackImage),u.add(u.track),u.draggable&&u.enableTrackClick(),u.bar=u.game.add.button(u.x,u.y,u.barImage,u.moveContent,J(u),1,0),u.bg=u.game.add.graphics(0,0),u.add(u.bg),u.sendToBack(u.bg),u.bg.beginFill(16711680,0),u.vertical?u.bg.drawRect(0,0-u.bar.height/2,1,u.track.height+u.bar.height):u.bg.drawRect(0-u.bar.width/2,0,u.track.width+u.bar.width,1),u.bg.endFill(),u.snapping=!0,u.add(u.bar),u.minY=u.track.y-u.bar.height/2,u.maxY=u.track.y+u.track.height-u.bar.height/2,u.minX=u.track.x-u.bar.width/2,u.maxX=u.track.x+u.track.width-u.bar.width/2,u.create(),u.vertical?(u.upEvent=u.scrollUp,u.downEvent=u.scrollDown):(u.upEvent=u.scrollLeft,u.downEvent=u.scrollRight),u.onMovement=new Phaser.Signal,u}var i,r,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&K(t,e)}(e,G),i=e,(r=[{key:"create",value:function(){this.centerStaticAxis(),this.draggable&&this.enableBarDrag(),this.windowScrollAreaSize=this.valueRange.maxValue-this.valueRange.step,this.vslice=this.track.height*this.valueRange.ratio,this.hslice=this.track.width*this.valueRange.ratio,this.setTrackScrollAreaSize(),this.mousePointer={x:this.bar.x,y:this.bar.y},this.setInitialBarPosition()}},{key:"setDraggableArea",value:function(){this.verticalDraggableArea={x:this.track.x-(this.bar.width-this.track.width)/2,y:this.track.y-this.bar.height/2,w:this.bar.width,h:this.track.height+this.bar.height},this.horizontalDraggableArea={x:this.track.x-this.bar.width/2,y:this.track.y-(this.bar.height-this.track.height)/2,w:this.track.width+this.bar.width,h:this.bar.height}}},{key:"setTrackScrollAreaSize",value:function(){this.vertical?this.trackScrollAreaSize=this.track.height:this.trackScrollAreaSize=this.track.width}},{key:"setInitialBarPosition",value:function(){var t=this.getBarPosition();this.vertical?this.bar.y=t+this.track.y-this.bar.height/2:this.bar.x=t+this.track.x-this.bar.width/2}},{key:"getClosestPosition",value:function(){for(var t=this.valueRange.getCurrentValue(),e=Math.abs(t-this.valueRange.steps[0]),i=this.valueRange.steps[0],r=0;r<this.valueRange.steps.length;r++){var n=Math.abs(t-this.valueRange.steps[r]);n<e&&(e=n,i=this.valueRange.steps[r])}return i}},{key:"snapToClosestPosition",value:function(){var t=this.getClosestPosition();this.valueRange.adjustValue(t),this.moveContent(),this.setInitialBarPosition()}},{key:"addScrollTweenEvents",value:function(t){t.onComplete.add(this.moveContent,this),t.onComplete.add(this.enableBarInput,this)}},{key:"getGripPositionRatio",value:function(){var t=this.getBarPosition()-this.getMouseDelta();t<0?t=0:t>=this.trackScrollAreaSize&&(t=this.trackScrollAreaSize),this.vertical?this.bar.y<=this.track.y?t=0:this.bar.y+this.bar.height>=this.track.y+this.track.height&&(t=this.trackScrollAreaSize):this.bar.x<=this.track.x?t=0:this.bar.x+this.bar.width>=this.track.x+this.track.width&&(t=this.trackScrollAreaSize);var e=t/this.trackScrollAreaSize;return Number.isNaN(e)&&(e=0),e}}])&&Z(i.prototype,r),n&&Z(i,n),e}(),tt={TOP_LEFT:0,TOP_CENTER:1,TOP_RIGHT:2,LEFT_TOP:3,LEFT_CENTER:4,LEFT_BOTTOM:5,CENTER:6,RIGHT_TOP:7,RIGHT_CENTER:8,RIGHT_BOTTOM:9,BOTTOM_LEFT:10,BOTTOM_CENTER:11,BOTTOM_RIGHT:12};function et(t){return(et="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function it(t,e){for(var i=0;i<e.length;i++){var r=e[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function rt(t){return(rt=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function nt(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function ot(t,e){return(ot=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var at=function(t){function e(t){var i,r,n,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),r=this,i=!(n=rt(e).call(this,t))||"object"!==et(n)&&"function"!=typeof n?nt(r):n,t.add.existing(nt(i)),i.x=o,i.y=a,i.game=t,i.bg=s,null!==s){var h=t.add.sprite(0,0,s);h.sendToBack(),h.alignIn(nt(i),tt.TOP_LEFT)}return i}var i,r,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&ot(t,e)}(e,Phaser.Group),i=e,(r=[{key:"addNode",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=(arguments.length>3&&void 0!==arguments[3]?arguments[3]:null)||this.alignment;this.add(t);var n=this.children[this.children.length-2];void 0!==n&&t.alignTo(n,r,e,i),"enableBarDrag"in t&&t.enableBarDrag()}}])&&it(i.prototype,r),n&&it(i,n),e}();function st(t){return(st="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function ht(t,e){return!e||"object"!==st(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function ut(t){return(ut=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function ct(t,e){return(ct=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var lt=function(t){function e(t){var i,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(i=ht(this,ut(e).call(this,t,r,n,o))).alignment=tt.BOTTOM_CENTER,i}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&ct(t,e)}(e,at),e}();function ft(t){return(ft="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function pt(t,e){return!e||"object"!==ft(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function yt(t){return(yt=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function bt(t,e){return(bt=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var vt=function(t){function e(t){var i,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(i=pt(this,yt(e).call(this,t,r,n,o))).alignment=tt.RIGHT_CENTER,i}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&bt(t,e)}(e,at),e}();function dt(t){return(dt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function gt(t,e){for(var i=0;i<e.length;i++){var r=e[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function mt(t){return(mt=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function wt(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function kt(t,e){return(kt=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var xt=function(t){function e(t,i,r,n,o){var a,s,h;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),s=this,a=!(h=mt(e).call(this,t))||"object"!==dt(h)&&"function"!=typeof h?wt(s):h,t.add.existing(wt(a)),a.x=i,a.y=r,a.area={x:i,y:r,width:n,height:o},a.mask=a.game.add.graphics(a.area.x,a.area.y),a.mask.beginFill(255),a.mask.drawRect(0,0,n,o),a.mask.endFill(),a}var i,r,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&kt(t,e)}(e,Phaser.Group),i=e,(r=[{key:"addNode",value:function(t){this.add(t)}},{key:"disableOutOfBounds",value:function(t,e,i){var r,n,o,a;if(void 0!==t)for(var s=0;s<t.length;s++)(r=t[s]).inputEnabled=!0,a=r.world||r,i?(n=a.y,o=e.viewport.area.y):(n=a.x,o=e.viewport.area.x),n<o&&(r.inputEnabled=!1),this.disableOutOfBounds(r.children,e,i)}}])&&gt(i.prototype,r),n&&gt(i,n),e}();i.d(e,"textSprite",function(){return c}),i.d(e,"textButton",function(){return l}),i.d(e,"Wheel3D",function(){return d}),i.d(e,"QuantityBar",function(){return I}),i.d(e,"Scrollbar",function(){return U}),i.d(e,"ValueBar",function(){return $}),i.d(e,"Frame",function(){return at}),i.d(e,"Column",function(){return lt}),i.d(e,"Row",function(){return vt}),i.d(e,"Viewport",function(){return xt})}])});