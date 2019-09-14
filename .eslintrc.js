module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "indent": ["error", 4],
        "linebreak-style": 0,
        "no-plusplus": ["error", {"allowForLoopAfterthoughts": true}],
        "import/prefer-default-export": "off",
        "max-len": ["error", {"ignoreComments": true}],
        "object-curly-newline": ["error", {"ObjectPattern": {"multiline": true}}],
        "no-lonely-if": "off",
        "max-len": "off",
        "max-classes-per-file": "off",
    },
    "parserOptions": {
        "sourceType": "module",
    },
    "globals": {
        "Phaser": true,
    }
};
