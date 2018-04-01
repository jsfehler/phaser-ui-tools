# Phaser UI Tools

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/aa833f08d69c471c9614f1ffac4f31e2)](https://app.codacy.com/app/joshua-fehler_2/phaser-ui-tools?utm_source=github.com&utm_medium=referral&utm_content=jsfehler/phaser-ui-tools&utm_campaign=badger)
[![Greenkeeper badge](https://badges.greenkeeper.io/jsfehler/phaser-ui-tools.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/jsfehler/phaser-ui-tools.svg?branch=master)](https://travis-ci.org/jsfehler/phaser-ui-tools)

I really wanted a viewport with a scrollbar. Things escalated.

![scrollbar](https://raw.githubusercontent.com/jsfehler/phaser-ui-tools/master/diagram.png)


### Live Examples

[Vertical Scrollbar](https://jsfehler.github.io/phaser-ui-tools/examples/vscrollbar.html)

[Horizontal Scrollbar](https://jsfehler.github.io/phaser-ui-tools/examples/hscrollbar.html)

[ValueBar](https://jsfehler.github.io/phaser-ui-tools/examples/valuebar.html)

[ValueBars inside a Column, with background and keyboard events](https://jsfehler.github.io/phaser-ui-tools/examples/valuebar_column.html)

[QuantityBar](https://jsfehler.github.io/phaser-ui-tools/examples/quantitybar.html)

[Wheel3D](https://jsfehler.github.io/phaser-ui-tools/examples/wheel3D.html)

### Documentation
https://jsfehler.github.io/phaser-ui-tools/


### Getting Started
Get phaser-ui-tools.js or phaser-ui-tools.min.js from the dist directory and add it to your project's index.html.
It should look something like:
```
<script src="lib/phaser-ui-tools.min.js"></script>
```
All the tools can be dropped into a game like any other Phaser Object.


### The Tools

#### TextSprite
A sprite with text on top.
```
var textSprite = new uiWidgets.textSprite(
    game,
    image,
    label,
    style,
    x,
    y
);
```

#### TextButton
A button with text on top.
```
var textButton = new uiWidgets.textButton(
    game,
    image,
    label,
    style,
    x,
    y
);
```

#### Containers

##### Column

Columns are Phaser Groups where each child added to the group is placed directly under the previous child. If an object can be a child of a Group, it can likewise be in a Column.

![column](https://raw.githubusercontent.com/jsfehler/phaser-ui-tools/master/diagram_column.png)
```
var column = new uiWidgets.Column(game, 8, 8);
column.addNode(sprite_a, 8, 8);
column.addNode(sprite_b, 8, 8);
column.addNode(sprite_c, 8, 8);
```

##### Row

Rows are Phaser Groups where each child added to the group is placed directly next to the previous child. If an object can be a child of a Group, it can likewise be in a Row.

![row](https://raw.githubusercontent.com/jsfehler/phaser-ui-tools/master/diagram_row.png)
```
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

```
var viewport = new uiWidgets.Viewport(game, 75, 75, 600, 260);
viewport.addNode(column);
```

#### Bars

##### Scrollbar
Scrollbars are used to move the objects in a Viewport. They must be used with a Viewport.
A tweening duration and easing can be specified. This will be triggered when moving the bar.
```
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

##### ValueBar
Valuebars are like Scrollbars, but instead of moving content, they increase/decrease a number.
Valuebars always have a minimum number of 0, but the starting and maximum number can be set.
A tweening duration and easing can be specified. This will be triggered when moving the bar.

![row](https://raw.githubusercontent.com/jsfehler/phaser-ui-tools/master/diagram_valuebar.png)
```
var valuebar = new uiWidgets.ValueBar(
    game,
    {"x": 50, "y": 10},
    {"step": 1, "startValue": 0, maxValue: 100},
    true,
    false,
    true,
    trackImage,
    barImage,
    {'duration': 100, 'ease': Phaser.Easing.Quadratic.Out}
);
```

##### QuantityBar
QuantityBars do not adjust a value, they get adjusted by a value. The bar grows and shrinks based on a value.
They can be used for health bars, stamina bars, etc.
A tweening duration and easing can be specified. This will be triggered when moving the bar.

![row](https://raw.githubusercontent.com/jsfehler/phaser-ui-tools/master/diagram_quantitybar.png)
```
var quantitybar = new uiWidgets.QuantityBar(
    game,
    {"x": 50, "y": 10},
    {"startValue": 50, maxValue: 100},
    false,
    false,
    trackImage,
    barImage,
    {'duration': 400, 'ease': Phaser.Easing.Quadratic.Out}
);
```

#### Wheel3D
A collection of sprites that are arranged around a three dimensional wheel.
The wheel can be adjusted and rotated along the x, y, or z axis.
```
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

### References
Scrollbar math:
http://csdgn.org/article/scrollbar
