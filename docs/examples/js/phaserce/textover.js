var game = new Phaser.Game(
    400,
    300,
    Phaser.AUTO,
    'textover',
    {preload: preload, create: create},
    false,
    false,
);

var textStyle = {'fill': '#FFF', 'font': '16px Courier New'};

function preload() {
    var assetRoot = '../../assets/textover/';
    game.load.image("header", assetRoot + "header.png");
    game.load.spritesheet('button', assetRoot + 'button.png', 128, 48);
}

function create() {
    this.header = new uiWidgets.textSprite(this, 0, 0, "header").setText('Header', textStyle);

    var buttonOne = new uiWidgets.textButton(game, 0, 0, "button", newGameCallback, this, 1, 0, 2, 1)
      .setText("New Game", textStyle)
      .eventTextYAdjustment(3);
    var buttonTwo = new uiWidgets.textButton(game, 0, 0, "button", continueCallback, this, 1, 0, 2, 1)
      .setText("Continue", textStyle)
      .eventTextYAdjustment(3);
    var buttonThree = new uiWidgets.textButton(game, 0, 0, "button", optionsCallback, this, 1, 0, 2, 1)
      .setText("Options", textStyle)
      .eventTextYAdjustment(3);

    var column = new uiWidgets.Column(this, 200, 100);
    column.addNode(buttonOne, paddingX=0, paddingY=10);
    column.addNode(buttonTwo, paddingX=0, paddingY=10);
    column.addNode(buttonThree, paddingX=0, paddingY=10);

}

function newGameCallback() {
    this.header.text.setText('You clicked the New Game button');
}


function continueCallback() {
    this.header.text.setText('You clicked the Continue button');
}


function optionsCallback() {
    this.header.text.setText('You clicked the Options button');
}
