var game = new Phaser.Game(600, 400, Phaser.AUTO, 'valuebar_column', { preload: preload, create: create, update: update });

function preload() {
    game.load.image("bg", "assets/valuebar/background.png");
    game.load.image("track", "assets/valuebar/track.png");
    game.load.spritesheet('bar', 'assets/valuebar/bar.png', 32, 32);
}

var bar;
var bar2;
var barText;
var barText2;
var lessHealth;
var moreHealth;
var column;

function create() {

    // Create a quantitybar starting at 50.
    bar = new uiWidgets.ValueBar(
        game,
		{"x": 0, "y": 0},
		{"step": 25, "startValue": 50, maxValue: 100},
		true,
		false,
		true,
		"track",
		"bar",
		{'duration': 100, 'ease': Phaser.Easing.Quadratic.Out}
    );

    barText = game.add.text(50, 50, bar.valueRange.minValue, {
        font: "24px Arial",
        fill: "#ff0044",
        align: "center"
    });

    // Create a quantitybar starting at 50.
    bar2 = new uiWidgets.ValueBar(
        game,
		{"x": 0, "y": 0},
		{"step": 25, "startValue": 50, maxValue: 100},
		true,
		false,
		true,
		"track",
		"bar",
		{'duration': 100, 'ease': Phaser.Easing.Quadratic.Out}
    );

    barText2 = game.add.text(50, 50, bar2.valueRange.minValue, {
        font: "24px Arial",
        fill: "#ff0044",
        align: "center"
    });

    column = new uiWidgets.Column(game, 150, 150, "bg");
    column.addNode(bar);
    column.addNode(barText);
    column.addNode(bar2);
    column.addNode(barText2);
}

function update() {
    barText.setText(bar.valueRange.getCurrentValue());
    barText2.setText(bar2.valueRange.getCurrentValue());
}
