var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    var assetRoot = '../../assets/horizontal/';
    this.load.image("dummyButton", assetRoot + "sprite.png");
    this.load.image("track", assetRoot + 'track.png');
    this.load.spritesheet('bar', assetRoot + 'bar.png', { frameWidth: 44, frameHeight: 22 });
}

function create() {
    var viewport = new uiWidgets.Viewport(this, 75, 75, 260, 128);
    var row = new uiWidgets.Row(this, 0, 0);

    viewport.addNode(row);

    // Add things to the row.
    var dummy_sprite_a = this.add.image(0, 0, "dummyButton");
    var dummy_sprite_b = this.add.image(0, 0, "dummyButton");
    var dummy_sprite_c = this.add.image(0, 0, "dummyButton");
    var dummy_sprite_d = this.add.image(0, 0, "dummyButton");
    var dummy_sprite_e = this.add.image(0, 0, "dummyButton");
    var dummy_sprite_f = this.add.image(0, 0, "dummyButton");
    var dummy_sprite_g = this.add.image(0, 0, "dummyButton");
    var dummy_sprite_h = this.add.image(0, 0, "dummyButton");
    var dummy_sprite_i = this.add.image(0, 0, "dummyButton");

    row.addNode(dummy_sprite_a);
    row.addNode(dummy_sprite_b);
    row.addNode(dummy_sprite_c);
    row.addNode(dummy_sprite_d);
    row.addNode(dummy_sprite_e);
    row.addNode(dummy_sprite_f);
    row.addNode(dummy_sprite_g);
    row.addNode(dummy_sprite_h);
    row.addNode(dummy_sprite_i);

    var scrollbar = new uiWidgets.Scrollbar(
        this,
        viewport,
        true,
        false,
        "track",
        "bar",
        {'duration': 300, 'ease': Phaser.Math.Easing.Quadratic.Out}
    );

    Phaser.Display.Align.To.BottomCenter(scrollbar, viewport, 0, 128 + 10);

}

function update() {}
