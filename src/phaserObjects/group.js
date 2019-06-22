let exportObject;

if (Phaser.Group === undefined) {
    class Phaser3Group extends Phaser.GameObjects.Container {
        constructor(game, x = 0, y = 0) {
            super(game, x, y);

            // Emulate Phaser CE's GameObject.alignTo
            this.alignToMapping = {
                0: Phaser.Display.Align.To.TopLeft,
                1: Phaser.Display.Align.To.TopCenter,
                8: Phaser.Display.Align.To.RightCenter,
                11: Phaser.Display.Align.To.BottomCenter,
            };
        }

        getNodes() {
            return this.getAll();
        }

        /** Aligns child to the last object in the group.
        * @private
        */
        alignNodeToPrevious(child, align, paddingX, paddingY) {
            const nodes = this.getNodes();
            const previousNode = nodes[nodes.length - 2];

            if (previousNode !== undefined) {
                this.alignToMapping[align](child, previousNode, paddingX, paddingY);
            }
        }
    }

    exportObject = Phaser3Group;
} else {
    class PhaserCEGroup extends Phaser.Group {
        getNodes() {
            return this.children;
        }

        /** Aligns child to the last object in the group.
        * @private
        */
        alignNodeToPrevious(child, align, paddingX, paddingY) {
            const nodes = this.getNodes();
            const previousNode = nodes[nodes.length - 2];

            if (previousNode !== undefined) {
                child.alignTo(previousNode, align, paddingX, paddingY);
            }
        }
    }

    exportObject = PhaserCEGroup;
}

export const Group = exportObject;
