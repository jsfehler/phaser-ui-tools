let exportObject;

if (Phaser.Graphics === undefined) {
    class ViewportMask3 extends Phaser.GameObjects.Graphics {
        constructor(game, x, y) {
            super(game, { x, y });

            this.game = game;
            this.x = x;
            this.y = y;
        }

        create(x, y, width, height) {
            this.fillStyle(0xffffff);
            this.beginPath();
            this.fillRect(x, y, width, height);

            const m = this.createGeometryMask();
            m.x = m.geometryMask.x;
            m.y = m.geometryMask.y;
            m.width = width;
            m.height = height;

            return m;
        }
    }
    exportObject = ViewportMask3;
} else {
    class ViewportMaskCE extends Phaser.Graphics {
        get scaleX() {
            return this.scale.x;
        }

        set scaleX(value) {
            this.scale.x = value;
        }

        get scaleY() {
            return this.scale.y;
        }

        set scaleY(value) {
            this.scale.y = value;
        }

        create(x, y, width, height) {
            this.beginFill(0x0000ff);
            this.drawRect(x, y, width, height);
            this.endFill();

            // Match the internals of Phaser3
            this.geometryMask = this;

            return this;
        }
    }

    exportObject = ViewportMaskCE;
}

export const ViewportMask = exportObject;
