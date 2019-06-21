let exportObject;

if (Phaser.Group === undefined) {
    class Phaser3Group extends Phaser.GameObjects.Container {}

    exportObject = Phaser3Group;
} else {
    class PhaserCEGroup extends Phaser.Group {}

    exportObject = PhaserCEGroup;
}

export const Group = exportObject;
