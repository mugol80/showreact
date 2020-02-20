const webpack = require('webpack');
const path = require('path');
const BUILD_PATH = '/build-dev/';
const BUILD_DIR = path.resolve(__dirname, './public/' + BUILD_PATH + '/js');
const APP_DIR = path.resolve(__dirname, './react');
const SRC_DIR = path.resolve(__dirname, './src');

const config = {
    entry: {
        app: ["@babel/polyfill", APP_DIR + '/index.js'],
        loadingPage: ["@babel/polyfill/noConflict", SRC_DIR + '/loadingPage/loadingPage.js'],
    },
    output: {
        path: BUILD_DIR,
        publicPath: BUILD_PATH + 'js/',
        filename: '[name].js',
        //filename: (chunkData) => {
        //    return chunkData.chunk.name === 'app' ? 'bundle.js': '[name].bundle.js';
        //},
    },
    module: {
        rules: [
            {
                test: /\.js?/,
                include: APP_DIR,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                include: [APP_DIR, SRC_DIR]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader",
                    options: {
                        sourceMap: true,
                        modules: {
                            mode: 'local',
                            localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
                        },
                        importLoaders: 2
                    }
                }, {
                    loader: 'resolve-url-loader'
                }, {
                    loader: "sass-loader",
                    options: {
                        sourceMap: true // required for resolve-url-loader
                    }
                }]
            },
            { // Serve webfonts as dataurls, if larger than "limit", serve them as file instead
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'mimetype=application/font-woff',
                    outputPath: '../fonts/',
                    publicPath: BUILD_PATH + '/fonts/',
                    name: '[name]-[hash:base64:5].[ext]'
                }
            },
            { // Serve ttf, eot and svg as static files
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            outputPath: '../images',
                            publicPath: BUILD_PATH + '/images/',
                        }
                    }
                ]
            }
        ]
    }
};

module.exports = config;

