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
	  var assetRoot = '../../assets/wheel3D_close/';

    var frameSize = { frameWidth: 32, frameHeight: 32 };
  	this.load.spritesheet('taka', assetRoot + 'taka.png', frameSize);
    this.load.spritesheet('kuwagata', assetRoot + 'kuwagata.png', frameSize);
    this.load.spritesheet('lion', assetRoot + 'lion.png', frameSize);
    this.load.spritesheet('sai', assetRoot + 'sai.png', frameSize);
    this.load.spritesheet('shachi', assetRoot + 'shachi.png', frameSize);

    this.load.spritesheet('kujaku', assetRoot + 'kujaku.png', frameSize);
    this.load.spritesheet('kamakiri', assetRoot + 'kamakiri.png', frameSize);
    this.load.spritesheet('tora', assetRoot + 'tora.png', frameSize);
    this.load.spritesheet('unagi', assetRoot + 'unagi.png', frameSize);
    this.load.spritesheet('gorilla', assetRoot + 'gorilla.png', frameSize);

    this.load.spritesheet('condor', assetRoot + 'condor.png', frameSize);
    this.load.spritesheet('batta', assetRoot + 'batta.png', frameSize);
    this.load.spritesheet('cheetah', assetRoot + 'cheetah.png', frameSize);
    this.load.spritesheet('tako', assetRoot + 'tako.png', frameSize);
    this.load.spritesheet('zou', assetRoot + 'zou.png', frameSize);

    this.load.spritesheet('toggle', assetRoot + 'checkbox.png', frameSize);
}

function getAnimConfig(anims, key) {
    var config = {
        key: key,
        frames: anims.generateFrameNumbers(key, { start: 0, end: 3, first: 0 }),
        frameRate: 6,
        repeat: -1,
    };

    anims.create(config);
}

function wheelOnComplete(wheel) {
    for (var i = 0; i < wheel.sprites.length; i++) {
        wheel.sprites[i].alpha = 0.15;
        wheel.sprites[i].scale = 2.5;
        wheel.sprites[i].anims.stop();
    }
    wheel.active.alpha = 1;
    wheel.active.scale = 1;
    wheel.active.anims.play(wheel.active.animName);
}

function wheelOnClose(wheel) {
  for (var i = 0; i < wheel.sprites.length; i++) {
      wheel.sprites[i].alpha = 1;
      wheel.sprites[i].scale = 1;
      wheel.sprites[i].anims.stop();
  }
}

var open = false;

function toggleWheels() {
    if (open === false) {
        headWheel.activate();
        torsoWheel.activate();
        legsWheel.activate();
        open = true;
    } else {


        headWheel.close();
        torsoWheel.close();
        legsWheel.close();
        open = false;
    }
}

function create() {
    var centerX = this.cameras.main.centerX;
    var centerY = this.cameras.main.centerY;

    var button = new uiWidgets.Button(
        this,
        32,
        32,
        "toggle",
        toggleWheels,
        null,
    );

    // Head
    var headMedalNames = ['taka', 'kuwagata', 'lion', 'sai', 'shachi'];
    var headMedals = [];

    for (var i = 0; i < headMedalNames.length; i++) {
        var name = headMedalNames[i];
        getAnimConfig(this.anims, name);
        var sprite = this.add.sprite(centerX, centerY, name);
        sprite.animName = name;
        headMedals.push(sprite);
    }

    // Create the wheel.
    headWheel = new uiWidgets.Wheel3D(
        this,
        {"x": centerX + 90, "y": centerY - 90},
        headMedals,
        0,
        90,
        "x",
        {"x":-90, "y": 0, "z": 0}
    );

    // Reduce alpha and stop animations on non-active items.
    headWheel.emitter.on('start', wheelOnComplete);
    headWheel.emitter.on('close', wheelOnClose);


    // Torso
    var torsoMedalNames = ['kujaku', 'kamakiri', 'tora', 'unagi', 'gorilla'];
    var torsoMedals = [];

    for (var i = 0; i < torsoMedalNames.length; i++) {
        var name = torsoMedalNames[i];
        getAnimConfig(this.anims, name);
        var sprite = this.add.sprite(centerX, centerY, name);
        sprite.animName = name;
        torsoMedals.push(sprite);
    }

    // Create the wheel.
    torsoWheel = new uiWidgets.Wheel3D(
        this,
        {"x": centerX, "y": 50},
        torsoMedals,
        0,
        180,
        "y",
        {"x":0, "y": -90, "z": 0}
    );

    // Reduce alpha and stop animations on non-active items.
    torsoWheel.emitter.on('start', wheelOnComplete);
    torsoWheel.emitter.on('close', wheelOnClose);


    // Legs
    var legMedalNames = ['condor', 'batta', 'cheetah', 'tako', 'zou'];
    var legMedals = [];

    for (var i = 0; i < legMedalNames.length; i++) {
        var name = legMedalNames[i];
        getAnimConfig(this.anims, name);
        var sprite = this.add.sprite(centerX, centerY, name);
        sprite.animName = name;
        legMedals.push(sprite);
    }

    // Create the wheel.
    legsWheel = new uiWidgets.Wheel3D(
        this,
        {"x": centerX, "y": 250},
        legMedals,
        0,
        90,
        "y",
        {"x":0, "y": -90, "z": 0}
    );

    // Reduce alpha and stop animations on non-active items.
    legsWheel.emitter.on('start', wheelOnComplete);
    legsWheel.emitter.on('close', wheelOnClose);

    var prevItemCallback = function (group, context) {
        cursor.y = group.selected.xy.y;
    };

    var nextItemCallback = function (group, context) {
        cursor.y = group.selected.xy.y;
    };

    cursor = this.add.sprite(100, 42, 'pointer');

    // Create a KeyboardGroup and add the Bars to it.
    keyboardGroup = new uiWidgets.KeyboardGroup(this, true, this);
    keyboardGroup.addNode(headWheel);
    keyboardGroup.addNode(torsoWheel);
    keyboardGroup.addNode(legsWheel);

    keyboardGroup.emitter.on('previous', prevItemCallback);
    keyboardGroup.emitter.on('next', nextItemCallback);
}
