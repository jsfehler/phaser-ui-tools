let exportObject;

if (Phaser.Keyboard === undefined) {
    class Phaser3Keyboard {
        addDownEvent(key, event, context) {  // eslint-disable-line
            key.on('down', event, context);
        }

        removeDownEvent(key) {  // eslint-disable-line
            key.removeListener('down');
        }
    }

    exportObject = Phaser3Keyboard;
} else {
    class PhaserCEKeyboard {
        addDownEvent(key, event, context) {  // eslint-disable-line
            key.onDown.add(event, context);
        }

        removeDownEvent(key) {  // eslint-disable-line
            key.onDown.removeAll();
        }
    }

    exportObject = PhaserCEKeyboard;
}

export const Keyboard = exportObject;
