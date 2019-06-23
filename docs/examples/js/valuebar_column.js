var game = new Phaser.Game(600, 400, Phaser.AUTO, 'valuebar_column', { preload: preload, create: create });

function preload() {
    var assetRoot = '../assets/valuebar/';
    game.load.image("bg", assetRoot + "background.png");
    game.load.image("track", assetRoot + "track.png");
    game.load.spritesheet('bar', assetRoot + 'bar.png', 32, 32);
    game.load.image("pointer", assetRoot + "pointer.png");

    game.load.image("vtrack", "assets/valuebar/vtrack.png");
}

var bar;
var bar2;
var barText;
var barText2;
var lessHealth;
var moreHealth;
var column;
var keyboardGroup;
var cursor;

function create() {
    // Create a quantitybar starting at 50.
    bar = new uiWidgets.ValueBar(
        game,
        {"x": 0, "y": 0},
        {"step": 25, "startValue": 50, maxValue: 100},
        true,
        false,
        "track",
        "bar",
        {'duration': 100, 'ease': Phaser.Easing.Quadratic.Out}
    );

    barText = game.add.text(50, 50, bar.valueRange.startValue, {
        font: "24px Arial",
        fill: "#ff0044",
        align: "center"
    });

    bar.valueDisplay = barText;
    bar.emitter.on('movement', updateValueDisplay);

    // Create a quantitybar starting at 50.
    bar2 = new uiWidgets.ValueBar(
        game,
        {"x": 0, "y": 0},
        {"step": 25, "startValue": 50, maxValue: 100},
        true,
        false,
        "track",
        "bar",
        {'duration': 100, 'ease': Phaser.Easing.Quadratic.Out}
    );

    barText2 = game.add.text(50, 50, bar2.valueRange.startValue, {
        font: "24px Arial",
        fill: "#ff0044",
        align: "center"
    });

    bar2.valueDisplay = barText2;
    bar2.emitter.on('movement', updateValueDisplay);

    var prevItemCallback = function (group, context) {
        cursor.y = group.selected.worldPosition.y - (group.selected.height/4);
    };

    var nextItemCallback = function (group, context) {
        cursor.y = group.selected.worldPosition.y - (group.selected.height/4);
    };

    column = new uiWidgets.Column(game, 150, 50, "bg");
    column.addNode(bar);
    column.addNode(barText);
    column.addNode(bar2);
    column.addNode(barText2);

    // Example of using prev/nextItem callback.
    // Create a cursor and move to the selected child's position.
    cursor = game.add.sprite(100, 42, 'pointer');

    // Create a KeyboardGroup and add the Bars to it.
    keyboardGroup = new uiWidgets.KeyboardGroup(game, true, this);
    keyboardGroup.addNode(bar);
    keyboardGroup.addNode(bar2);

    keyboardGroup.emitter.on('previous', prevItemCallback);
    keyboardGroup.emitter.on('next', nextItemCallback);
}

function updateValueDisplay(bar) {
    bar.valueDisplay.setText(bar.valueRange.getCurrentValue());
}
