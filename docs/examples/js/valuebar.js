var game = new Phaser.Game(600, 400, Phaser.AUTO, 'valuebar', { preload: preload, create: create, update: update });

function preload() {
	game.load.image("track", "assets/valuebar/track.png");
	game.load.spritesheet('bar', 'assets/valuebar/bar.png', 32, 32);
    game.load.image("vtrack", "assets/valuebar/vtrack.png");
    game.load.image("alphaImage", "assets/valuebar/alpha.png");
}

var valuebar0;
var valuebar50;
var vvaluebar50;
var valuebar0_text;
var valuebar50_text;
var vvaluebar50_text;
var alphaImage;

function create() {

	// Create a valuebar starting at 0.
	valuebar0 = new uiWidgets.ValueBar(
		game,
		{"x": 50, "y": 10},
		{"step": 1, "startValue": 0, maxValue: 100},
		true,
		false,
		true,
		"track",
		"bar",
		{'duration': 100, 'ease': Phaser.Easing.Quadratic.Out}
	);

	valuebar0_text = game.add.text(50, 50, valuebar0.valueRange.minValue, {
        font: "65px Arial",
        fill: "#ff0044",
        align: "center"
    });

	// Create a valuebar starting at 50.
	valuebar50 = new uiWidgets.ValueBar(
		game,
		{"x": 50, "y": 150},
		{"step": 25, "startValue": 50, maxValue: 100},
		true,
		false,
		true,
		"track",
		"bar",
		{'duration': 100, 'ease': Phaser.Easing.Quadratic.Out}
	);

	valuebar50_text = game.add.text(50, 200, valuebar50.valueRange.minValue, {
        font: "65px Arial",
        fill: "#ff0044",
        align: "center"
    });

    // Create a vertical valuebar starting at 50.
	vvaluebar50 = new uiWidgets.ValueBar(
		game,
		{"x": 350, "y": 50},
		{"step": 25, "startValue": 50, maxValue: 100},
		true,
		true,
		true,
		"vtrack",
		"bar",
		{'duration': 100, 'ease': Phaser.Easing.Quadratic.Out}
	);

	vvaluebar50_text = game.add.text(400, 200, valuebar50.valueRange.minValue, {
        font: "65px Arial",
        fill: "#ff0044",
        align: "center"
    });

    alphaImage = game.add.sprite(500, 100, "alphaImage");

}

function update() {
	valuebar0_text.setText(valuebar0.valueRange.getCurrentValue());
	valuebar50_text.setText(valuebar50.valueRange.getCurrentValue());
    vvaluebar50_text.setText(vvaluebar50.valueRange.getCurrentValue());

    alphaImage.alpha = vvaluebar50.valueRange.getCurrentValue() / 100;
}
