var game = new Phaser.Game(600, 400, Phaser.AUTO, 'valuebar_column', { preload: preload, create: create, update: update });

function preload() {
    game.load.image("track", "assets/valuebar/track.png");
    game.load.spritesheet('bar', 'assets/valuebar/bar.png', 32, 32);
}

var healthbar;
var healthbarText;
var lessHealth;
var moreHealth;
var column;

function create() {

    // Create a quantitybar starting at 50.
    healthbar = new uiWidgets.ValueBar(
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

    healthbarText = game.add.text(50, 50, healthbar.valueRange.minValue, {
        font: "65px Arial",
        fill: "#ff0044",
        align: "center"
    });

    column = new uiWidgets.Column(game, 150, 150);
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
