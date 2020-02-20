process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

const BUILD_PATH = '/build/';
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
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new MiniCssExtractPlugin({
            //filename: '../css/style.css',
            filename: '../css/[name].css'
        }),
        new UglifyJsPlugin({
            parallel: true,
            uglifyOptions: {
                compress: false,
                output: {
                    comments: false
                },
            }
        }),

        new webpack.optimize.AggressiveMergingPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.js?/,
                exclude: /node_modules\/(pdfjs-dist|lodash)\//,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: false,
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
                    }
                ]
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
