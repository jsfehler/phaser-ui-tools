var menuWheel;

var game = new Phaser.Game(600, 400, Phaser.AUTO, 'wheel3D', { preload: preload, create: create });

function preload() {
	game.load.image("icon", "assets/wheel3D/icon.png");
    game.load.image("mmUp", "assets/wheel3D/mmUp.png");
    game.load.image("mmDown", "assets/wheel3D/mmDown.png");
}

function create() {

    // Build a list of sprites for the wheel.
    var menuList = [];

    for (var i = 0; i < 12; i++) {
        var icon = game.add.sprite(0, 0, 'icon');
        menuList.push(icon);
    }

    // Create the wheel.
    menuWheel = new uiWidgets.Wheel3D(
        game,
        {"x": game.world.centerX, "y": game.world.centerY},
        menuList,
        0,
        90,
        "z",
        {"x": 0, "y": 0, "z": 0}
    );

    menuWheel.activate();

    // Scroll Buttons
    var scrollLeftButton = this.game.add.button(
        game.width-74,
        game.world.centerY - 26,
        "mmUp",
        scrollTheWheel,
        this);
    scrollLeftButton.dir = 0;

    var scrollRightButton = this.game.add.button(
        game.width-74,
        game.world.centerY + 26,
        "mmDown",
        scrollTheWheel,
        this);
    scrollRightButton.dir = 1;

}

var scrollTheWheel = function (item) {
    if (item.dir === 0){
        menuWheel.moveBack();
    }
    if (item.dir === 1){
        menuWheel.moveForward();
    }
};
