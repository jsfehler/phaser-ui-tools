let exportObject;

if (Phaser.Tween === undefined) {
    class Phaser3Tween {
        constructor(game) {
            this.game = game;
        }

        add(target, properties, duration, ease, onComplete, onUpdate, onStart, onCompleteScope, onUpdateScope, onStartScope) {
            const config = {
                targets: target,
                duration,
                ease,
                onComplete,
                onUpdate,
                onStart,
                onCompleteScope,
                onUpdateScope,
                onStartScope,
            };
            const params = Object.assign(config, properties);
            this.game.tweens.add(params);
        }
    }

    exportObject = Phaser3Tween;
} else {
    class PhaserCETween {
        constructor(game) {
            this.game = game;
        }

        add(target, properties, duration, ease, onComplete, onUpdate, onStart, onCompleteScope, onUpdateScope, onStartScope) {
            const tween = this.game.add.tween(target).to(
                properties,
                duration,
                ease,
                true,
            );

            // Add the necessary events to the tween.
            if (onUpdate) {
                tween.onUpdateCallback(onUpdate, onUpdateScope);
            }

            if (onComplete) {
                tween.onComplete.add(onComplete, onCompleteScope);
            }

            if (onStart) {
                tween.onStart.add(onStart, onStartScope);
            }
        }
    }

    exportObject = PhaserCETween;
}

export const Tween = exportObject;
