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
    var assetRoot = '../../assets/modal/';
    game.load.image("modalBg", assetRoot + "background.png");
    game.load.spritesheet('button', assetRoot + 'button.png', 128, 48);
}

function create() {
  var openButton = new uiWidgets.TextButton(this.game, 100, 50, "button", createModal, this, 1, 0, 2, 1)
    .setText("Open", textStyle)
    .eventTextYAdjustment(3);

  console.log(openButton.x, openButton.button.x, openButton.text.x)

}

function createModal() {
  var closeButton = new uiWidgets.TextButton(this.game, 0, 0, "button", closeCallback, this, 1, 0, 2, 1)
    .setText("Close", textStyle)
    .eventTextYAdjustment(3);

  this.modal = new uiWidgets.Column(this.game, 100, 100, bg="modalBg", modal=true);
  this.modal.addNode(closeButton, paddingX=0, paddingY=10);
}

function closeCallback() {
    this.modal.dismiss();
}
