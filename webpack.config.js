const path = require('path');

module.exports = {
    mode: 'production',
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(js)$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    entry: './src/entry.js',
    output: {
        library: 'uiWidgets',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        filename: 'phaser-ui-tools.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
