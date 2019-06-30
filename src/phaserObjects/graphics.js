let exportObject;

if (Phaser.Graphics === undefined) {
    exportObject = Phaser.GameObjects.Graphics;
} else {
    class PhaserCEGraphics extends Phaser.Graphics {
        constructor(game, options) {
            super(game, options.x, options.y);
        }

        fillStyle(colour, alpha) {
            this.beginFill(colour, alpha);
        }

        fillRect(x, y, width, height) {
            this.drawRect(x, y, width, height);
            this.endFill();
        }
    }

    exportObject = PhaserCEGraphics;
}

export const Graphics = exportObject;
