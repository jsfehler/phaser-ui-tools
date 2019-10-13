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
    var assetRoot = '../../assets/vertical/';
    this.load.image("dummyButton", assetRoot + "sprite.png");
    this.load.image("track", assetRoot + "track.png");
    this.load.spritesheet('bar', assetRoot + 'bar.png', { frameWidth: 22, frameHeight: 44 });

}

function create() {

    // Create a viewport. A "window" with a limited area of view.
    var viewport = new uiWidgets.Viewport(this, 75, 75, 600, 260);

    // Create a column. Anything added to a column is placed under the previous thing added.
    var column = new uiWidgets.Column(this);

    // Put the column inside the viewport.
    viewport.addNode(column);

    // Add things to the column.
    var dummy_sprite_a = this.add.image(0, 0, "dummyButton");
    var dummy_sprite_b = this.add.image(0, 0, "dummyButton");
    var dummy_sprite_c = this.add.image(0, 0, "dummyButton");
    var dummy_sprite_d = this.add.image(0, 0, "dummyButton");
    var dummy_sprite_e = this.add.image(0, 0, "dummyButton");
    var dummy_sprite_f = this.add.image(0, 0, "dummyButton");

    column.addNode(dummy_sprite_a);
    column.addNode(dummy_sprite_b);
    column.addNode(dummy_sprite_c);
    column.addNode(dummy_sprite_d);
    column.addNode(dummy_sprite_e);
    column.addNode(dummy_sprite_f);

    // Create a scrollbar for the viewport.
    var scrollbar = new uiWidgets.Scrollbar(
        this,
        viewport,
        true,
        true,
        "track",
        "bar",
        {'duration': 300, 'ease': Phaser.Math.Easing.Quadratic.Out}
    );

    // Place scrollbar next to viewport.
    Phaser.Display.Align.To.RightCenter(scrollbar, viewport, 300 + 10, 0);

}
