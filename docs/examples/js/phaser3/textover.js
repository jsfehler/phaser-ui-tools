var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    scene: {
        preload: preload,
        create: create,
    }
};

var game = new Phaser.Game(config);

var textStyle = {'fill': '#FFF', 'font': '16px Courier New'};

function preload() {
    var assetRoot = '../../assets/textover/';
    this.load.image("header", assetRoot + "header.png");
    this.load.spritesheet('button', assetRoot + 'button.png', { frameWidth: 128, frameHeight: 48 });
}

function create() {
    this.header = new uiWidgets.TextSprite(this, 0, 0, "header").setText('Header', textStyle).setOrigin(0.0, 0.0);

    var buttonOne = new uiWidgets.TextButton(this, 0, 0, "button", newGameCallback, this, 1, 0, 2, 1)
      .setText("New Game", textStyle)
      .eventTextYAdjustment(3);
    var buttonTwo = new uiWidgets.TextButton(this, 0, 0, "button", continueCallback, this, 1, 0, 2, 1)
      .setText("Continue", textStyle)
      .eventTextYAdjustment(3);
    var buttonThree = new uiWidgets.TextButton(this, 0, 0, "button", optionsCallback, this, 1, 0, 2, 1)
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
