let exportObject;

if (Phaser.Sprite === undefined) {
    class Phaser3Sprite extends Phaser.GameObjects.Sprite {}

    exportObject = Phaser3Sprite;
} else {
    class PhaserCESprite extends Phaser.Sprite {}

    exportObject = PhaserCESprite;
}

export const Sprite = exportObject;
