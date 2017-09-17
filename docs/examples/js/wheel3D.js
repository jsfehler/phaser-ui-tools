var menuWheel;

var game = new Phaser.Game(600, 400, Phaser.AUTO, 'wheel3D', { preload: preload, create: create, update: update });

function preload() {
	game.load.image("icon", "assets/wheel3D/icon.png");
    game.load.image("mmUp", "assets/wheel3D/mmUp.png");
    game.load.image("mmDown", "assets/wheel3D/mmDown.png");
}

function create() {

    // Example 1: Rotate around the Y axis

    // Build a list of sprites for the wheel.
    var menuListY = [];

    for (var i = 0; i < 12; i++) {
        var icon = game.add.sprite(0, 0, 'icon');
        menuListY.push(icon);
    }

    // Create the wheel.
    menuWheelY = new uiWidgets.Wheel3D(
        game,
        {"x": game.world.centerX - 100, "y": game.world.centerY},
        menuListY,
        0,
        90,
        "y",
        {"x":0, "y": -90, "z": 0}
    );

    menuWheelY.activate();

    // Scroll Buttons
    var scrollLeftButtonY = this.game.add.button(
        0,
        game.world.centerY,
        "mmUp",
        scrollTheWheel,
        this);
    scrollLeftButtonY.wheel = menuWheelY;
    scrollLeftButtonY.dir = 0;

    var scrollRightButtonY = this.game.add.button(
        0,
        game.world.centerY + 48,
        "mmDown",
        scrollTheWheel,
        this);
    scrollRightButtonY.wheel = menuWheelY;
    scrollRightButtonY.dir = 1;

    // Example 2: Rotate around the X axis
    var menuListX = [];

    for (var i = 0; i < 12; i++) {
        var icon = game.add.sprite(0, 0, 'icon');
        menuListX.push(icon);
    }

    // Create the wheel.
    menuWheelX = new uiWidgets.Wheel3D(
        game,
        {"x": game.world.centerX - 100, "y": 100},
        menuListX,
        0,
        90,
        "x",
        {"x": 90, "y": 0, "z": 0}
    );

    menuWheelX.activate();

    // Scroll Buttons
    var scrollLeftButtonX = this.game.add.button(
        0,
        0,
        "mmUp",
        scrollTheWheel,
        this);
    scrollLeftButtonX.wheel = menuWheelX;
    scrollLeftButtonX.dir = 0;

    var scrollRightButtonX = this.game.add.button(
        0,
        48,
        "mmDown",
        scrollTheWheel,
        this);
    scrollRightButtonX.wheel = menuWheelX;
    scrollRightButtonX.dir = 1;

    // Example 3: Rotate around the Z axis
    var menuListZ = [];

    for (var i = 0; i < 12; i++) {
        var icon = game.add.sprite(0, 0, 'icon');
        menuListZ.push(icon);
    }

    // Create the wheel.
    menuWheelZ = new uiWidgets.Wheel3D(
        game,
        {"x": game.world.centerX, "y": 100},
        menuListZ,
        0,
        90,
        "z",
        {"x": 0, "y": 0, "z": 90}
    );

    menuWheelZ.activate();

    // Scroll Buttons
    var scrollLeftButtonZ = this.game.add.button(
        game.world.width - 100,
        0,
        "mmUp",
        scrollTheWheel,
        this);
    scrollLeftButtonZ.wheel = menuWheelZ;
    scrollLeftButtonZ.dir = 0;

    var scrollRightButtonZ = this.game.add.button(
        game.world.width - 100,
        48,
        "mmDown",
        scrollTheWheel,
        this);
    scrollRightButtonZ.wheel = menuWheelZ;
    scrollRightButtonZ.dir = 1;


}

var scrollTheWheel = function (item) {
    if (item.dir === 0){
        item.wheel.moveBack();
    }
    if (item.dir === 1){
        item.wheel.moveForward();
    }
};

function update () {
    // Tint the active item, just for show.
    for (var i=0; i < 12; i++) {
        menuWheelY.sprites[i].tint = 0xFFFFFF;
        menuWheelX.sprites[i].tint = 0xFFFFFF;
        menuWheelZ.sprites[i].tint = 0xFFFFFF;
    }

    menuWheelY.active.tint = 0xdc21ff;
    menuWheelX.active.tint = 0xdc21ff;
    menuWheelZ.active.tint = 0xdc21ff;
}
