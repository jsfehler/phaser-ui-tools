let exportObject;

/** Sort handler function */
function ascendingSortHandler(a, b) {
    if (a.z < b.z) {
        return -1;
    }

    return 1;
}

if (Phaser.Group === undefined) {
    // Emulate Phaser CE's worldPosition object
    class WorldPosition {
        constructor(parent) {
            this.parent = parent;
        }

        get x() {
            return this.parent.x;
        }

        get y() {
            return this.parent.y;
        }
    }

    class Phaser3Group extends Phaser.GameObjects.Container {
        constructor(game, x = 0, y = 0) {
            super(game, x, y);

            this.SORT_ASCENDING = -1;
            this.SORT_DESCENDING = 1;

            this.version = 3;

            // Emulate Phaser CE's GameObject.alignTo
            this.alignToMapping = {
                0: Phaser.Display.Align.To.TopLeft,
                1: Phaser.Display.Align.To.TopCenter,
                8: Phaser.Display.Align.To.RightCenter,
                11: Phaser.Display.Align.To.BottomCenter,
            };

            this.worldPosition = new WorldPosition(this);
        }

        get realHeight() {
            return this.getBounds().height;
        }

        get realWidth() {
            return this.getBounds().width;
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

        /** Implement a sort method that resembles Phaser CE. */
        sort(key, order = -1) {
            let handler = null;

            if (order === this.SORT_ASCENDING) {
                handler = ascendingSortHandler;
            } else {
                handler = ascendingSortHandler; // TODO: If needed, descending sort handler
            }

            super.sort(key, handler);
        }
    }

    exportObject = Phaser3Group;
} else {
    class PhaserCEGroup extends Phaser.Group {
        constructor(game) {
            super(game);

            this.SORT_ASCENDING = -1;
            this.SORT_DESCENDING = 1;
        }

        get realHeight() {
            return this.height;
        }

        get realWidth() {
            return this.width;
        }

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
