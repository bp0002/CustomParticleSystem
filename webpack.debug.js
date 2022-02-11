const path = require('path');
const { optimize, Compilation } = require('webpack');
const { ConcatSource } = require("webpack-sources");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: {
        "particlesystem": './src/index.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'webpack_build/')
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    devtool : 'source-map',
    mode: 'production',
    // mode: 'development',
    optimization: {
        usedExports: true,
        minimize: true,
        minimizer: [
            new optimize.ModuleConcatenationPlugin(),
            new TerserPlugin({
                parallel: 4,
            }),
        ]
    },
};