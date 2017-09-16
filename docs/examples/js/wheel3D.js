var game = new Phaser.Game(600, 400, Phaser.AUTO, 'wheel3D', { preload: preload, create: create });

function preload() {
	game.load.image("icon", "assets/wheel3D/icon.png");
}

function create() {

    // Build a list of sprites for the wheel.
    var menuList = [];

    for (var i = 0; i < 12; i++) {
        var icon = game.add.sprite(0, 0, 'icon');
        menuList.push(icon);
    }

    // Create the wheel.
    var menuWheel = new uiWidgets.Wheel3D(
        game,
        {"x": game.world.centerX, "y": game.world.centerY},
        menuList,
        0,
        90,
        "z",
        {"x": 0, "y": 0, "z": 0}
    );

    menuWheel.activate();

}
