var game = new Phaser.Game(400, 300, Phaser.AUTO, 'hscrollbar', { preload: preload, create: create });

function preload() {
	game.load.image("dummyButton", "assets/horizontal/sprite.png");
	game.load.image("track", "assets/horizontal/track.png");
	game.load.spritesheet('bar', 'assets/horizontal/bar.png', 44, 22);
}

function create() {
	// Create a viewport. A "window" with a limited area of view.
	var viewport = new uiWidgets.Viewport(game, 75, 75, 260, 128);

	// Create a row. Anything added to a row is placed next to the previous thing added.
	var row = new uiWidgets.Row(game);

	// Put the row inside the viewport.
	viewport.addNode(row);

	// Add things to the row.
	var dummy_sprite_a = this.game.add.sprite(0, 0, "dummyButton");
	var dummy_sprite_b = this.game.add.sprite(0, 0, "dummyButton");
	var dummy_sprite_c = this.game.add.sprite(0, 0, "dummyButton");
	var dummy_sprite_d = this.game.add.sprite(0, 0, "dummyButton");
	var dummy_sprite_e = this.game.add.sprite(0, 0, "dummyButton");
	var dummy_sprite_f = this.game.add.sprite(0, 0, "dummyButton");
	var dummy_sprite_g = this.game.add.sprite(0, 0, "dummyButton");
	var dummy_sprite_h = this.game.add.sprite(0, 0, "dummyButton");
	var dummy_sprite_i = this.game.add.sprite(0, 0, "dummyButton");

	row.addNode(dummy_sprite_a);
	row.addNode(dummy_sprite_b);
	row.addNode(dummy_sprite_c);
	row.addNode(dummy_sprite_d);
	row.addNode(dummy_sprite_e);
	row.addNode(dummy_sprite_f);
	row.addNode(dummy_sprite_g);
	row.addNode(dummy_sprite_h);
	row.addNode(dummy_sprite_i);

	// Create a scrollbar for the viewport.
	var scrollbar = new uiWidgets.Scrollbar(
		game,
		viewport,
		true,
		false,
		"track",
		"bar",
		{'duration': 300, 'ease': Phaser.Easing.Quadratic.Out}
	);

	// Place scrollbar below viewport.
	scrollbar.alignTo(viewport, Phaser.BOTTOM_LEFT, 0, 10);
}
