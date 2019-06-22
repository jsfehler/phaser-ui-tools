let exportObject;

if (Phaser.Graphics === undefined) {
    class ViewportMask3 extends Phaser.GameObjects.Graphics {
        constructor(game, x, y) {
            super(game, { x, y });

            this.game = game;
            this.x = x;
            this.y = y;
        }

        create(width, height) {
            this.fillStyle(0x800000, 1).fillRect(0, 0, width, height);

            return new Phaser.Display.Masks.GeometryMask(this.game, this);
        }
    }
    exportObject = ViewportMask3;
} else {
    class ViewportMaskCE extends Phaser.Graphics {
        create(width, height) {
            this.beginFill(0x0000ff);
            this.drawRect(this.x, this.y, width, height);
            this.endFill();

            return this;
        }
    }

    exportObject = ViewportMaskCE;
}

export const ViewportMask = exportObject;
