var game = new Phaser.Game(600, 400, Phaser.AUTO, 'quantitybar', { preload: preload, create: create, update: update });

function preload() {
	game.load.image("track", "assets/quantitybar/horizontal/track.png");
	game.load.spritesheet('bar', 'assets/quantitybar/horizontal/bar.png', 260, 32);
	
	game.load.image("vtrack", "assets/quantitybar/vertical/track.png");
	game.load.spritesheet('vbar', 'assets/quantitybar/vertical/bar.png', 32, 260);	
	
	game.load.image("add", "assets/quantitybar/add.png");
	game.load.image("subtract", "assets/quantitybar/subtract.png");

}

var healthbar, healthbarText;

function create() {

	// Create a quantitybar starting at 50.
	healthbar = new uiWidgets.QuantityBar(
		game,
		{"x": 50, "y": 10},
		{"startValue": 50, maxValue: 100},
		false,
		"track",
		"bar",
		{'duration': 400, 'ease': Phaser.Easing.Quadratic.Out}
	);
	
	healthbarText = game.add.text(50, 50, healthbar.valueRange.minValue, {
        font: "65px Arial",
        fill: "#ff0044",
        align: "center"
    });

	var lessHealth = game.add.button(150, 50, 'subtract', decreaseHealth, this)
	var moreHealth = game.add.button(200, 50, 'add', increaseHealth, this)

	// Create a quantitybar starting at 50.
	vhealthbar = new uiWidgets.QuantityBar(
		game,
		{"x": 50, "y": 130},
		{"startValue": 32, maxValue: 100},
		true,
		"vtrack",
		"vbar",
		{'duration': 400, 'ease': Phaser.Easing.Quadratic.Out}
	);	
	

	vhealthbarText = game.add.text(150, 150, vhealthbar.valueRange.minValue, {
        font: "65px Arial",
        fill: "#ff0044",
        align: "center"
    });	
	
	var vlessHealth = game.add.button(150, 250, 'subtract', vdecreaseHealth, this)
	var vmoreHealth = game.add.button(200, 250, 'add', vincreaseHealth, this)
	
}

function update() {
	healthbarText.setText(healthbar.valueRange.getCurrentValue());
	vhealthbarText.setText(vhealthbar.valueRange.getCurrentValue());
}

function increaseHealth() {
	healthbar.adjustValue(10);
}

function decreaseHealth() {
	healthbar.adjustValue(-10);
}

function vincreaseHealth() {
	vhealthbar.adjustValue(1);
}

function vdecreaseHealth() {
	vhealthbar.adjustValue(-1);
}