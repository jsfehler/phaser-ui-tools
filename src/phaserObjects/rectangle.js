let exportObject;

if (Phaser.Rectangle === undefined) {
    exportObject = Phaser.Geom.Rectangle;
} else {
    exportObject = Phaser.Rectangle;
}

export const Rectangle = exportObject;
