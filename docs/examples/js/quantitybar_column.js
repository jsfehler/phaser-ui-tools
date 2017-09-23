var game = new Phaser.Game(600, 400, Phaser.AUTO, 'quantitybar_column', { preload: preload, create: create, update: update });

function preload() {
    game.load.image("track", "assets/quantitybar/horizontal/track.png");
    game.load.image('bar', 'assets/quantitybar/horizontal/bar.png');

    game.load.image("add", "assets/quantitybar/add.png");
    game.load.image("subtract", "assets/quantitybar/subtract.png");
}

var healthbar;
var healthbarText;
var lessHealth;
var moreHealth;
var column;

function create() {

    // Create a quantitybar starting at 50.
    healthbar = new uiWidgets.QuantityBar(
        game,
        {"x": 0, "y": 0},
        {"startValue": 50, maxValue: 100},
        false,
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

    lessHealth = game.add.button(150, 10, 'subtract', decreaseHealth, this);
    moreHealth = game.add.button(200, 10, 'add', increaseHealth, this);

    column = new uiWidgets.Column(game, 30, 0);
    column.addNode(healthbar);
    column.addNode(healthbarText);
    console.log("a", healthbar.track.x, healthbar.track.worldPosition.x)
    console.log("b", healthbar.bar.x, healthbar.bar.worldPosition.x)
    console.log("c", healthbar.x, healthbar.worldPosition.x)
    //console.log(healthbar.bar.mask.x, healthbar.bar.mask.worldPosition.x)
    //healthbar.bar.mask.x = 30
        //healthbar.bar.mask.y = 30

}

function update() {
    healthbarText.setText(healthbar.valueRange.getCurrentValue());
}

function increaseHealth() {
    healthbar.adjustBar(10);

}

function decreaseHealth() {
    healthbar.adjustBar(-10);
}
