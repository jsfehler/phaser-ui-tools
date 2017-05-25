var game = new Phaser.Game(800, 600, Phaser.AUTO, 'vscrollbar', { preload: preload, create: create });

function preload() {
	game.load.image("dummyButton", "assets/vertical/sprite.png");
	game.load.image("track", "assets/vertical/track.png");
	game.load.spritesheet('bar', 'assets/vertical/bar.png', 22, 44);
}

function create() {

	var viewport = new uiWidgets.Viewport(game, 75, 75, 600, 260);
	var column = new uiWidgets.Column(game);
	viewport.addNode(column);

	var dummy_sprite_a = this.game.add.sprite(0, 0, "dummyButton");
	var dummy_sprite_b = this.game.add.sprite(0, 0, "dummyButton");
	var dummy_sprite_c = this.game.add.sprite(0, 0, "dummyButton");
	var dummy_sprite_d = this.game.add.sprite(0, 0, "dummyButton");
	var dummy_sprite_e = this.game.add.sprite(0, 0, "dummyButton");
	var dummy_sprite_f = this.game.add.sprite(0, 0, "dummyButton");
	
	column.addNode(dummy_sprite_a);
	column.addNode(dummy_sprite_b);
	column.addNode(dummy_sprite_c);
	column.addNode(dummy_sprite_d);
	column.addNode(dummy_sprite_e);
	column.addNode(dummy_sprite_f);
	
	var scrollbar = new uiWidgets.Scrollbar(
		game,
		viewport,
		true,
		true,
		true,
		"track",
		"bar"
	);
	
}
