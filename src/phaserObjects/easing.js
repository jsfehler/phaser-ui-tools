let exportObject;

if (Phaser.Easing === undefined) {
    exportObject = Phaser.Math.Easing;
} else {
    exportObject = Phaser.Easing;
}

export const Easing = exportObject;
