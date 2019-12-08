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
    var assetRoot = '../../assets/modal/';
    this.load.image("modalBg", assetRoot + "background.png");
    this.load.spritesheet('button', assetRoot + 'button.png', { frameWidth: 128, frameHeight: 48 });
}

function create() {
    var openButton = new uiWidgets.TextButton(this, 100, 50, "button", createModal, this, 1, 0, 2, 1)
      .setText("Open", textStyle)
      .eventTextYAdjustment(3);
}

function createModal() {
  var closeButton = new uiWidgets.TextButton(this, 0, 0, "button", closeCallback, this, 1, 0, 2, 1)
    .setText("Close", textStyle)
    .eventTextYAdjustment(3);

  this.modal = new uiWidgets.Column(this, 100, 100, bg="modalBg", modal=true);
  this.modal.addNode(closeButton, paddingX=0, paddingY=10);
}

function closeCallback() {
    this.modal.dismiss();
}
