require('babel-core/register');
import gulpWebpack from 'gulp-webpack';
import BowerWebpackPlugin from 'bower-webpack-plugin';
import path from 'path';

export default function (target, setting) {
  const SETTING = setting;
  let webpack = gulpWebpack.webpack;

  return {
    cache: true,
    progress: true,
    entry: {
      index: path.join(__dirname, `${SETTING.CORE}${SETTING.ALT_JS}/${target}/index.${SETTING.ALT_JS_ATTRIBUTE}`)
    },
    output: {
      filename: '[name].js'
    }, 
    devtool: 'sourcemap',
    debug: (SETTING.MODE === 'DEBUG' || SETTING.MODE === 'DEBUG_LOCAL') ? true : false,
    module: {
      loaders: [
        { test: /\.json$/, loader: "json" },
        { test: /\.css$/, loader: "style!css" },
        { test: /\.scss$/, loader: "style!css!sass?outputStyle=expanded&includePaths[]=" + (path.resolve(__dirname, './bower_components/bootstrap-sass-official')) },
        { test: /\.coffee$/, loader: 'coffee' },
        { test: /\.(coffee\.md|litcoffee)$/, loader: 'coffee?literate' },
        { test: /\.png$/, loader: "url?prefix=../images/&limit=5000" },
        { test: /\.jpg$/, loader: "url?prefix=../images/&limit=5000" },
        { test: /\.gif$/, loader: "url?prefix=../images/&limit=5000" },
        { test: /\.woff$/, loader: "url?prefix=font/&limit=5000" },
        { test: /\.eot$/, loader: "file?prefix=font/" },
        { test: /\.ttf$/, loader: "file?prefix=font/" },
        { test: /\.svg$/, loader: "file?prefix=font/" },
        { test: /\.wav$/, loader: "file" },
        { test: /\.mp3$/, loader: "file" },
        // { test: /angular\.js$/, loader: 'exports?angular' },
        { 
          test: /\.js$/,
          exclude: /node_modules/,
          // loader: ['babel?cacheDirectory']
          loader: 'babel'
        },
      ]
    },
    resolve: {
      root: [
        path.join(__dirname),
        path.join(__dirname, SETTING.APP_COMPONENTS),
        path.join(__dirname, SETTING.NODE_MODULES),
        // path.join(__dirname, SETTING.BOWER_COMPONENTS)
      ],
      moduleDirectories: [
        SETTING.APP_COMPONENTS,
        SETTING.NODE_MODULES,
        // SETTING.BOWER_COMPONENTS
      ],
      extensions: ['', '.js', '.coffee', '.babel.js']
    },
    resolveLoader: {
      root: [
        path.join(__dirname, SETTING.APP_COMPONENTS),
        path.join(__dirname, SETTING.NODE_MODULES),
        // path.join(__dirname, SETTING.BOWER_COMPONENTS)
      ]
    },
    plugins: (function() {
      let result = [
        // new BowerWebpackPlugin(),
        new webpack.ProvidePlugin({
          jQuery: 'jquery',
          $: 'jquery',
          _: 'lodash',
          Backbone: 'backbone',
          Modernizr: 'modernizr/modernizr',
          Device: 'devicejs'
        })
      ];
      
      if (SETTING.MODE === 'PRODUCTION') {
        Array.prototype.push.apply(result, [
          new webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('production')
            },
            'BUILD_MODE': JSON.stringify(SETTING.MODE)
          }),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.AggressiveMergingPlugin(),
          new webpack.optimize.UglifyJsPlugin({ output: {comments: false} }),
          new webpack.optimize.OccurenceOrderPlugin()
        ]);
      } else {
        Array.prototype.push.apply(result, [
          new webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('production')
            },
            'BUILD_MODE': JSON.stringify(SETTING.MODE)
          })
        ]);
      }
      return result;
    })()
  }
};