# Phaser UI Tools
I really wanted a viewport with a scrollbar. Things escalated.

##### Scrollbar
Scrollbars are used to move the content in a Viewport.

Viewports are Phaser Groups and can contain anything a Group can. 
If it's a child of the Viewport, the Scrollbar will move it.
 
Columns and Rows are Phaser Groups where each child added to the group is placed directly under/next to the previous child. If an object can be a child of a Group, it can likewise be in a Column or Row.

Placing Columns/Rows inside a Viewport is a simple way to line up Sprites/Buttons/etc.

##### ValueBar
Valuebars are like Scrollbars, but instead of moving content, they increase/decrease a number.
Valuebars always have a minimum number of 0, but the starting and maximum number can be set.

##### QuantityBar
QuantityBars do not adjust a value, they get adjusted by a value. The bar grows and shrinks based on a value.
They can be used for health bars, stamina bars, etc.


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
