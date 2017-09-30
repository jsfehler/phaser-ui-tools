var game = new Phaser.Game(600, 400, Phaser.AUTO, 'quantitybar', { preload: preload, create: create});

function preload() {
    game.load.image("track", "assets/quantitybar/horizontal/track.png");
    game.load.spritesheet('bar', 'assets/quantitybar/horizontal/bar.png', 260, 32);

    game.load.image("vtrack", "assets/quantitybar/vertical/track.png");
    game.load.spritesheet('vbar', 'assets/quantitybar/vertical/bar.png', 32, 260);

    game.load.image("add", "assets/quantitybar/add.png");
    game.load.image("subtract", "assets/quantitybar/subtract.png");
}

var healthbar,
    healthbarText,
    vhealthbar,
    vhealthbarText,
    rhealthbar,
    rhealthbarText,
    rvhealthbar,
    rvhealthbarText,
    decreaseHealth,
    increaseHealth,
    vdecreaseHealth,
    vincreaseHealth,
    rdecreaseHealth,
    rincreaseHealth,
    rvdecreaseHealth,
    rvincreaseHealth,
    textStyle;

function create() {

    textStyle = {
        font: "65px Arial",
        fill: "#ff0044",
        align: "center"
    };

    // Create a quantitybar starting at 50.
    healthbar = new uiWidgets.QuantityBar(
        game,
        {"x": 50, "y": 10},
        {"startValue": 50, maxValue: 100},
        false,
        false,
        "track",
        "bar",
        {'duration': 400, 'ease': Phaser.Easing.Quadratic.Out}
    );

    // Display the quantitybar's value.
	healthbarText = game.add.text(50, 50, healthbar.valueRange.startValue, textStyle);

    // Add buttons to modify the value.
    var lessHealth = game.add.button(150, 10, 'subtract', decreaseHealth, this);
    var moreHealth = game.add.button(200, 10, 'add', increaseHealth, this);

    // Create a reverse quantitybar starting at 50.
    rhealthbar = new uiWidgets.QuantityBar(
        game,
        {"x": 350, "y": 10},
        {"startValue": 30, maxValue: 100},
        false,
        true,
        "track",
        "bar",
        {'duration': 400, 'ease': Phaser.Easing.Quadratic.Out}
    );

	rhealthbarText = game.add.text(350, 50, healthbar.valueRange.startValue, textStyle);

    var rlessHealth = game.add.button(450, 10, 'subtract', rdecreaseHealth, this);
    var rmoreHealth = game.add.button(500, 10, 'add', rincreaseHealth, this);

    // Create a vertical quantitybar starting at 50.
    vhealthbar = new uiWidgets.QuantityBar(
        game,
        {"x": 30, "y": 130},
        {"startValue": 32, maxValue: 100},
        true,
        false,
        "vtrack",
        "vbar",
        {'duration': 400, 'ease': Phaser.Easing.Quadratic.Out}
    );

	vhealthbarText = game.add.text(100, 150, vhealthbar.valueRange.startValue, textStyle);

    var vlessHealth = game.add.button(100, 250, 'subtract', vdecreaseHealth, this);
    var vmoreHealth = game.add.button(150, 250, 'add', vincreaseHealth, this);

    // Create a reverse vertical quantitybar starting at 50.
    rvhealthbar = new uiWidgets.QuantityBar(
        game,
        {"x": 250, "y": 130},
        {"startValue": 30, maxValue: 100},
        true,
        true,
        "vtrack",
        "vbar",
        {'duration': 400, 'ease': Phaser.Easing.Quadratic.Out}
    );

	rvhealthbarText = game.add.text(300, 150, rvhealthbar.valueRange.startValue, textStyle);

    var vlessHealth = game.add.button(300, 250, 'subtract', rvdecreaseHealth, this);
    var vmoreHealth = game.add.button(350, 250, 'add', rvincreaseHealth, this);

}

function increaseHealth() {
    healthbar.adjustBar(10);
    healthbarText.setText(healthbar.valueRange.getCurrentValue());
}

function decreaseHealth() {
    healthbar.adjustBar(-10);
    healthbarText.setText(healthbar.valueRange.getCurrentValue());
}

function vincreaseHealth() {
    vhealthbar.adjustBar(1);
    vhealthbarText.setText(vhealthbar.valueRange.getCurrentValue());
}

function vdecreaseHealth() {
    vhealthbar.adjustBar(-1);
    vhealthbarText.setText(vhealthbar.valueRange.getCurrentValue());
}

function rincreaseHealth() {
    rhealthbar.adjustBar(10);
    rhealthbarText.setText(rhealthbar.valueRange.getCurrentValue());
}

function rdecreaseHealth() {
    rhealthbar.adjustBar(-10);
    rhealthbarText.setText(rhealthbar.valueRange.getCurrentValue());
}

function rvincreaseHealth() {
    rvhealthbar.adjustBar(10);
    rvhealthbarText.setText(rvhealthbar.valueRange.getCurrentValue());
}

function rvdecreaseHealth() {
    rvhealthbar.adjustBar(-10);
    rvhealthbarText.setText(rvhealthbar.valueRange.getCurrentValue());
}
