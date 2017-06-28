# Phaser UI Tools
I really wanted a viewport with a scrollbar. Things escalated.

### The Tools

![scrollbar](https://raw.githubusercontent.com/jsfehler/phaser-ui-tools/master/diagram.png)

##### Scrollbar
Scrollbars are used to move the objects in a Viewport. They're only useful when connected to a Viewport.

##### Viewport
Viewports are Phaser Groups where children in the group are only visible if they're within the viewport's area.

##### Column
Columns are Phaser Groups where each child added to the group is placed directly under the previous child. If an object can be a child of a Group, it can likewise be in a Column.
Placing Columns inside a Viewport is a simple way to line up Sprites/Buttons/etc vertically.

##### Row
Rows are Phaser Groups where each child added to the group is placed directly next to the previous child. If an object can be a child of a Group, it can likewise be in a Row.
Placing Rows inside a Viewport is a simple way to line up Sprites/Buttons/etc horizontally.

##### ValueBar
Valuebars are like Scrollbars, but instead of moving content, they increase/decrease a number.
Valuebars always have a minimum number of 0, but the starting and maximum number can be set.

##### QuantityBar
QuantityBars do not adjust a value, they get adjusted by a value. The bar grows and shrinks based on a value.
They can be used for health bars, stamina bars, etc.

##### TextSprite
A sprite with text on top.

##### TextButton
A button with text on top.


### Examples

##### Vertical Scrollbar
https://jsfehler.github.io/phaser-ui-tools/examples/vscrollbar.html

##### Horizontal Scrollbar
https://jsfehler.github.io/phaser-ui-tools/examples/hscrollbar.html

##### Valuebar
https://jsfehler.github.io/phaser-ui-tools/examples/valuebar.html

##### QuantityBar
https://jsfehler.github.io/phaser-ui-tools/examples/quantitybar.html

### Getting Started
Get phaser-ui-tools.js or phaser-ui-tools.min.js from the dist directory and add it to your project's index.html.
It should look something like:
```
<script src="lib/phaser-ui-tools.min.js"></script>
```

### Documentation
https://jsfehler.github.io/phaser-ui-tools/

### References
Scrollbar math:
http://csdgn.org/article/scrollbar
