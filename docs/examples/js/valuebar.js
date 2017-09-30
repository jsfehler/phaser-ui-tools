var game = new Phaser.Game(600, 400, Phaser.AUTO, 'valuebar', { preload: preload, create: create });

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
		"track",
		"bar",
		{'duration': 100, 'ease': Phaser.Easing.Quadratic.Out}
	);

	valuebar0_text = game.add.text(50, 50, valuebar0.valueRange.startValue, {
        font: "65px Arial",
        fill: "#ff0044",
        align: "center"
    });

    valuebar0.valueDisplay = valuebar0_text;

    // Use the onMovement signal to update the display of text when the bar is moved.
    valuebar0.onMovement.add(updateValueDisplay);

	// Create a valuebar starting at 50.
	valuebar50 = new uiWidgets.ValueBar(
		game,
		{"x": 50, "y": 150},
		{"step": 25, "startValue": 50, maxValue: 100},
		true,
		false,
		"track",
		"bar",
		{'duration': 100, 'ease': Phaser.Easing.Quadratic.Out}
	);

	valuebar50_text = game.add.text(50, 200, valuebar50.valueRange.startValue, {
        font: "65px Arial",
        fill: "#ff0044",
        align: "center"
    });

    valuebar50.valueDisplay = valuebar50_text;
    valuebar50.onMovement.add(updateValueDisplay);

    // Create a vertical valuebar starting at 50.
	vvaluebar50 = new uiWidgets.ValueBar(
		game,
		{"x": 350, "y": 50},
		{"step": 25, "startValue": 50, maxValue: 100},
		true,
		true,
		"vtrack",
		"bar",
		{'duration': 100, 'ease': Phaser.Easing.Quadratic.Out}
	);

	vvaluebar50_text = game.add.text(400, 200, valuebar50.valueRange.startValue, {
        font: "65px Arial",
        fill: "#ff0044",
        align: "center"
    });

    vvaluebar50.valueDisplay = vvaluebar50_text;
    vvaluebar50.onMovement.add(updateValueDisplay);

    alphaImage = game.add.sprite(500, 100, "alphaImage");
    alphaImage.alpha = vvaluebar50.valueRange.getCurrentValue() / 100;

    // Use the onMovement signal to updte the sprite's opacity whenever the bar is moved.
    vvaluebar50.onMovement.add(updateAlpha);
}

function updateValueDisplay(bar) {
    bar.valueDisplay.setText(bar.valueRange.getCurrentValue());
}

function updateAlpha(bar) {
    alphaImage.alpha = bar.valueRange.getCurrentValue() / 100;
}
