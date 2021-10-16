const path = require('path');

const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    mode: 'production',
    plugins: [new ESLintPlugin()],
    module: {
        rules: [
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
