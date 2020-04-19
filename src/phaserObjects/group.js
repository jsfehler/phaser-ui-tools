let exportObject;

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

            game.add.existing(this);

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

        /** Alias to match Phaser CE */
        get children() {
            return this.list;
        }

        get realHeight() {
            return this.getBounds().height - this.y;
        }

        get realWidth() {
            return this.getBounds().width - this.x;
        }

        getNodes() {
            return this.getAll();
        }

        // Can't align to Containers automatically
        alignToContainerBottom(previousNode, child) {
            // realWidth changes inside a Container

            let parentOffset = 0;
            if (this.parentContainer) {
                parentOffset = this.parentContainer.y;
            }

            const centerX = ((previousNode.getBounds().width - this.worldPosition.x) * 0.5);
            const bottomY = (previousNode.getBounds().height - this.worldPosition.y);

            let w = child.width;
            if (child instanceof Phaser3Group) {
                w = child.getBounds().width;
            }

            child.x = centerX - (w * 0.5); // eslint-disable-line
            child.y = previousNode.getBounds().y + bottomY - parentOffset; // eslint-disable-line
        }

        // Containers can't be aligned automatically
        alignContainerToBottom(previousNode, child) {
            const centerX = previousNode.x + (previousNode.getBounds().width * 0.5);
            const bottomY = (previousNode.getBounds().height - this.worldPosition.y);

            child.x = centerX - ((child.getBounds().width - this.worldPosition.x) * 0.5); // eslint-disable-line
            child.y = previousNode.getBounds().y + bottomY; //eslint-disable-line
        }

        /** Aligns child to the last object in the group.
        * @private
        */
        alignNodeToPrevious(child, align, paddingX, paddingY) {
            const nodes = this.getNodes();
            const previousNode = nodes[nodes.length - 2];

            if (previousNode instanceof Phaser3Group) {
                this.alignToContainerBottom(previousNode, child);
            } else if (child instanceof Phaser3Group && (previousNode !== undefined)) {
                this.alignContainerToBottom(previousNode, child);
            } else if (previousNode !== undefined) {
                this.alignToMapping[align](child, previousNode, paddingX, paddingY);
            }
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
