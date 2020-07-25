# Phaser UI Tools

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/aa833f08d69c471c9614f1ffac4f31e2)](https://app.codacy.com/app/joshua-fehler_2/phaser-ui-tools?utm_source=github.com&utm_medium=referral&utm_content=jsfehler/phaser-ui-tools&utm_campaign=badger)
[![Build Status](https://travis-ci.org/jsfehler/phaser-ui-tools.svg?branch=master)](https://travis-ci.org/jsfehler/phaser-ui-tools)

I really wanted a viewport with a scrollbar. Things escalated.

![scrollbar](https://raw.githubusercontent.com/jsfehler/phaser-ui-tools/master/assets/diagram.png)

### Documentation
https://jsfehler.github.io/phaser-ui-tools/

### References
Scrollbar math:
http://csdgn.org/article/scrollbar


### Getting Started

#### Using NPM
On the command line, type:
```
npm i phaser-ui-tools
```

The objects are now available via import:
```
import { Column } from 'phaser-ui-tools';

var column = new Column(...)

```

####  Adding the file directly to your project
Get phaser-ui-tools.js from the releases and add it to your project's index.html.
It should look something like:
```
<script src="lib/phaser-ui-tools.js"></script>
```

The objects can now be used directly:

```
var column = new uiWidgets.Column(...)
```


### The Tools

#### Text Overlays

##### TextSprite
A sprite that can have text on top.

Text is added with the setText() method.

```javascript
var textSprite = new uiWidgets.TextSprite(
    game, x, y, key,
);
textSprite.setText(label, style);
```

##### TextButton
A button that can have text on top.

Text is added with the setText() method.

```javascript
var textButton = new uiWidgets.TextButton(
    game, x, y, key, callback, callbackContext, overKey, outKey, downKey, upKey,
);
textButton.setText(label, style);
```

##### Examples

###### Phaser CE
[Header & Buttons](https://jsfehler.github.io/phaser-ui-tools/examples/html/phaserce/textover.html) | [Code](https://jsfehler.github.io/phaser-ui-tools/examples/js/phaserce/textover.js)


#### Containers

##### Column

Columns are Phaser Groups where each child added to the group is placed directly under the previous child. If an object can be a child of a Group, it can likewise be in a Column.

![column](https://raw.githubusercontent.com/jsfehler/phaser-ui-tools/master/assets/diagram_column.png)
```javascript
var column = new uiWidgets.Column(game, 8, 8);
column.addNode(sprite_a, 8, 8);
column.addNode(sprite_b, 8, 8);
column.addNode(sprite_c, 8, 8);
```

##### Row

Rows are Phaser Groups where each child added to the group is placed directly next to the previous child. If an object can be a child of a Group, it can likewise be in a Row.

![row](https://raw.githubusercontent.com/jsfehler/phaser-ui-tools/master/assets/diagram_row.png)
```javascript
var row = new uiWidgets.Row(game, 8, 8);
row.addNode(sprite_a, 8, 8);
row.addNode(sprite_b, 8, 8);
row.addNode(sprite_c, 8, 8);
```

##### Viewport
Viewports are Phaser Groups where the children in the group are only visible if they're within the viewport's area.
If an object can be a child of a Group, it can likewise be in a Viewport.

Viewports can be combined with a Scrollbar to create a scrollable display.

Placing a Column or Row inside a Viewport is a simple way to align content.

```javascript
var viewport = new uiWidgets.Viewport(game, 75, 75, 600, 260);
viewport.addNode(column);
```

#### Bars

##### Scrollbar
Scrollbars are used to move the objects in a Viewport. They must be used with a Viewport.
A tweening duration and easing can be specified. This will be triggered when moving the bar.

```javascript
var scrollbar = new uiWidgets.Scrollbar(
    game,
    viewport,
    true,
    true,
    true,
    trackImage,
    barImage,
    {'duration': 300, 'ease': Phaser.Easing.Quadratic.Out}
);
```

##### Examples

###### Phaser CE

[Vertical](https://jsfehler.github.io/phaser-ui-tools/examples/html/phaserce/vscrollbar.html) | [Code](https://jsfehler.github.io/phaser-ui-tools/examples/js/phaserce/vscrollbar.js)

[Horizontal](https://jsfehler.github.io/phaser-ui-tools/examples/html/phaserce/hscrollbar.html) | [Code](https://jsfehler.github.io/phaser-ui-tools/examples/js/phaserce/hscrollbar.js)


##### ValueBar
Valuebars are like Scrollbars, but instead of moving content, they increase/decrease a number.
Valuebars always have a minimum number of 0, but the starting and maximum number can be set.
A tweening duration and easing can be specified. This will be triggered when moving the bar.

![valuebar](https://raw.githubusercontent.com/jsfehler/phaser-ui-tools/master/assets/diagram_valuebar.png)

```javascript
var valuebar = new uiWidgets.ValueBar(
    game,
    {'x': 50, 'y': 10},
    {'step': 1, 'startValue': 0, 'maxValue': 100},
    true,
    false,
    true,
    trackImage,
    barImage,
    {'duration': 100, 'ease': Phaser.Easing.Quadratic.Out}
);
```

##### Examples

###### Phaser CE

[ValueBar](https://jsfehler.github.io/phaser-ui-tools/examples/html/phaserce/valuebar.html) | [Code](https://jsfehler.github.io/phaser-ui-tools/examples/js/phaserce/valuebar.js)

[Multiple ValueBar inside a Column, with background image and keyboard events](https://jsfehler.github.io/phaser-ui-tools/examples/html/phaserce/valuebar_column.html) | [Code](https://jsfehler.github.io/phaser-ui-tools/examples/js/phaserce/valuebar_column.js)


##### QuantityBar
QuantityBars do not adjust a value, they get adjusted by a value. The bar grows and shrinks based on a value.
They can be used for health bars, stamina bars, etc.
A tweening duration and easing can be specified. This will be triggered when moving the bar.

![quantitybar](https://raw.githubusercontent.com/jsfehler/phaser-ui-tools/master/assets/diagram_quantitybar.png)

```javascript
var quantitybar = new uiWidgets.QuantityBar(
    game,
    {'x': 50, 'y': 10},
    {'startValue': 50, 'maxValue': 100},
    false,
    false,
    trackImage,
    barImage,
    {'duration': 400, 'ease': Phaser.Easing.Quadratic.Out}
);
```

##### Examples

###### Phaser CE

[QuantityBar](https://jsfehler.github.io/phaser-ui-tools/examples/html/phaserce/quantitybar.html) | [Code](https://jsfehler.github.io/phaser-ui-tools/examples/js/phaserce/quantitybar.js)


#### Wheel3D
A collection of sprites that are arranged around a three dimensional wheel.
The wheel can be adjusted and rotated along the x, y, or z axis.

![wheel3D](https://raw.githubusercontent.com/jsfehler/phaser-ui-tools/master/assets/diagram_wheel3D.png)

```javascript
var wheel = new uiWidgets.Wheel3D(
    game,
    {"x": game.world.centerX - 100, "y": game.world.centerY},
    [sprite1, sprite2, sprite3, sprite4],
    0,
    90,
    "y",
    {"x":0, "y": 0, "z": 0}
);
```

##### Examples

###### Phaser CE

[Wheel3D](https://jsfehler.github.io/phaser-ui-tools/examples/html/phaserce/wheel3D.html) | [Code](https://jsfehler.github.io/phaser-ui-tools/examples/js/phaserce/wheel3D.js)
