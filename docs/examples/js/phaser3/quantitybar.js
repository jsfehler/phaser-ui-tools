var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    scene: {
        preload: preload,
        create: create,
    }
};

var game = new Phaser.Game(config);

function preload() {
    var assetRoot = '../../assets/quantitybar/';
    this.load.image("track", assetRoot + "horizontal/track.png");
    this.load.spritesheet('bar', assetRoot + 'horizontal/bar.png', { frameWidth: 260, frameHeight: 32 });

    this.load.image("vtrack", assetRoot + "vertical/track.png");
    this.load.spritesheet('vbar', assetRoot + 'vertical/bar.png', { frameWidth: 32, frameHeight: 260 });

    this.load.image("add", assetRoot + "add.png");
    this.load.image("subtract", assetRoot + "subtract.png");
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
        this,
        {"x": 50, "y": 10},
        {"startValue": 50, maxValue: 100},
        false,
        false,
        "track",
        "bar",
        {'duration': 400, 'ease': Phaser.Math.Easing.Quadratic.Out}
    );

    // Display the quantitybar's value.
	healthbarText = this.add.text(50, 50, healthbar.valueRange.startValue, textStyle);

    // Add buttons to modify the value.
    var lessHealth = new uiWidgets.Button(this, 150, 10, 'subtract', decreaseHealth, this);
    var moreHealth = new uiWidgets.Button(this, 200, 10, 'add', increaseHealth, this);

    // Create a reverse quantitybar starting at 30.
    rhealthbar = new uiWidgets.QuantityBar(
        this,
        {"x": 350, "y": 10},
        {"startValue": 30, maxValue: 100},
        false,
        true,
        "track",
        "bar",
        {'duration': 400, 'ease': Phaser.Math.Easing.Quadratic.Out}
    );

    rhealthbarText = this.add.text(350, 50, rhealthbar.valueRange.startValue, textStyle);

    var rlessHealth = new uiWidgets.Button(this, 450, 10, 'subtract', rdecreaseHealth, this);
    var rmoreHealth = new uiWidgets.Button(this, 500, 10, 'add', rincreaseHealth, this);

    // Create a vertical quantitybar starting at 50.
    vhealthbar = new uiWidgets.QuantityBar(
        this,
        {"x": 30, "y": 130},
        {"startValue": 32, maxValue: 100},
        true,
        false,
        "vtrack",
        "vbar",
        {'duration': 400, 'ease': Phaser.Math.Easing.Quadratic.Out}
    );

    vhealthbarText = this.add.text(100, 150, vhealthbar.valueRange.startValue, textStyle);

    var vlessHealth = new uiWidgets.Button(this, 100, 250, 'subtract', vdecreaseHealth, this);
    var vmoreHealth = new uiWidgets.Button(this, 150, 250, 'add', vincreaseHealth, this);

    // Create a reverse vertical quantitybar starting at 50.
    rvhealthbar = new uiWidgets.QuantityBar(
        this,
        {"x": 250, "y": 130},
        {"startValue": 30, maxValue: 100},
        true,
        true,
        "vtrack",
        "vbar",
        {'duration': 400, 'ease': Phaser.Math.Easing.Quadratic.Out}
    );

    rvhealthbarText = this.add.text(300, 150, rvhealthbar.valueRange.startValue, textStyle);

    var vlessHealth = new uiWidgets.Button(this, 300, 250, 'subtract', rvdecreaseHealth, this);
    var vmoreHealth = new uiWidgets.Button(this, 350, 250, 'add', rvincreaseHealth, this);

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
