let exportKeyCodes;

if (Phaser.Keyboard === undefined) {
    exportKeyCodes = Phaser.Input.Keyboard.KeyCodes;
} else {
    exportKeyCodes = Phaser.Keyboard;
}

export const KeyCodes = exportKeyCodes;
