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
	  var assetRoot = '../../assets/wheel3D/';
  	this.load.image("icon", assetRoot + "icon.png");
    this.load.image("mmUp", assetRoot + "mmUp.png");
    this.load.image("mmDown", assetRoot + "mmDown.png");
}

function create() {

    var centerX = this.cameras.main.centerX;
    var centerY = this.cameras.main.centerY;

    // Example 1: Rotate around the Y axis

    // Build a list of sprites for the wheel.
    var menuListY = [];

    for (var i = 0; i < 12; i++) {
        var icon = this.add.sprite(0, 0, 'icon');
        menuListY.push(icon);
    }

    // Create the wheel.
    menuWheelY = new uiWidgets.Wheel3D(
        this,
        {"x": centerX - 100, "y": centerY},
        menuListY,
        0,
        90,
        "y",
        {"x":0, "y": -90, "z": 0}
    );

    // Tint the active item, just for show.
    menuWheelY.emitter.on('complete',
        function(wheel) {
            for (var i = 0; i < 12; i++) {
                wheel.sprites[i].tint = 0xFFFFFF;
            }
            wheel.active.tint = 0xdc21ff;
        }
    );

    menuWheelY.activate();

    // Scroll Buttons
    var scrollLeftButtonY = new uiWidgets.Button(
        this,
        0,
        centerY,
        "mmUp",
        scrollTheWheel,
        null,
    );
    scrollLeftButtonY.wheel = menuWheelY;
    scrollLeftButtonY.dir = 0;

    var scrollRightButtonY = new uiWidgets.Button(
        this,
        0,
        centerY + 48,
        "mmDown",
        scrollTheWheel,
        null,
    );
    scrollRightButtonY.wheel = menuWheelY;
    scrollRightButtonY.dir = 1;

    // Example 2: Rotate around the X axis
    var menuListX = [];

    for (var i = 0; i < 12; i++) {
        var icon = this.add.sprite(0, 0, 'icon');
        menuListX.push(icon);
    }

    // Create the wheel.
    menuWheelX = new uiWidgets.Wheel3D(
        this,
        {"x": centerX - 100, "y": 100},
        menuListX,
        0,
        90,
        "x",
        {"x": 90, "y": 0, "z": 0}
    );

    menuWheelX.emitter.on('complete',
        function(wheel) {
            for (var i = 0; i < 12; i++) {
                wheel.sprites[i].tint = 0xFFFFFF;
            }
            wheel.active.tint = 0xdc21ff;
        }
    );

    menuWheelX.activate();

    // Scroll Buttons
    var scrollLeftButtonX = new uiWidgets.Button(
        this,
        0,
        0,
        "mmUp",
        scrollTheWheel,
        null,
    );
    scrollLeftButtonX.wheel = menuWheelX;
    scrollLeftButtonX.dir = 0;

    var scrollRightButtonX = new uiWidgets.Button(
        this,
        0,
        48,
        "mmDown",
        scrollTheWheel,
        null,
    );
    scrollRightButtonX.wheel = menuWheelX;
    scrollRightButtonX.dir = 1;

    // Example 3: Rotate around the Z axis
    var menuListZ = [];

    for (var i = 0; i < 12; i++) {
        var icon = this.add.sprite(0, 0, 'icon');
        menuListZ.push(icon);
    }

    // Create the wheel.
    menuWheelZ = new uiWidgets.Wheel3D(
        this,
        {"x": centerX, "y": 100},
        menuListZ,
        0,
        90,
        "z",
        {"x": 0, "y": 0, "z": 90}
    );

    menuWheelZ.emitter.on('start',
        function(wheel) {
            for (var i = 0; i < 12; i++) {
                wheel.sprites[i].tint = 0xFFFFFF;
            }
            wheel.active.tint = 0xdc21ff;
        }
    );

    menuWheelZ.activate();

    // Scroll Buttons
    var scrollLeftButtonZ = new uiWidgets.Button(
        this,
        this.cameras.main.width - 100,
        0,
        "mmUp",
        scrollTheWheel,
        null,
    );
    scrollLeftButtonZ.wheel = menuWheelZ;
    scrollLeftButtonZ.dir = 0;

    var scrollRightButtonZ = new uiWidgets.Button(
        this,
        this.cameras.main.width - 100,
        48,
        "mmDown",
        scrollTheWheel,
        null,
    );
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
