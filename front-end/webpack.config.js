const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');
const path = require('path');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = () => {
  const env = dotenv.config().parsed;

  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true,
          },
        }],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg|otf)$/,
        loader: 'url-loader?limit=100000',
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        loaders: ['file-loader'],
      },
      ],
    },
    entry: './src/index.js',
    output: {
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'build'),
      filename: '[name].[contenthash].js',
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: path.resolve(__dirname, 'src/', 'index.html'),
        filename: 'index.html',
      }),
      new webpack.DefinePlugin(envKeys),
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[hash].css',
        // chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        chunkFilename: '[name].[chunkhash].css',
        ignoreOrder: true,
      }),
      new ErrorOverlayPlugin(),
    ],
    node: {
      fs: 'empty',
    },
    devServer: {
      historyApiFallback: true,
    },
    devtool: 'cheap-module-source-map',
    optimization: {
      splitChunks: {
        chunks: 'all',
        minChunks: 2,
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
      runtimeChunk: 'single',
    },
    performance: {
      hints: false,
    },
    stats: {
      warningsFilter: warn => warn.indexOf('Conflicting order between:') > -1,
    },
  };
};
