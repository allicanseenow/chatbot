const webpack = require('webpack');
const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanwebpackPlugin = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const transpiledPath = path.resolve(__dirname, 'public', 'transpiled_javascripts');
console.log('transpi;e path', transpiledPath)

console.log('Fuck---------------         --------------              ----------------------           -------------   -----')

module.exports = {
  entry: {
    rooms: './public/javascripts/rooms.js',
    chat: './public/javascripts/chat.js',
    css_compiled: './public/stylesheets/css_compiled',
    landing: './public/javascripts/landing.js'
  },
  resolve: {
    // you can now require('file') instead of require('file.js')
    extensions: ['.js', '.json', '.css']
  },
  output: {
    // chunkFilename: '[name].bundle.js',
    filename: '[name].js',
    path: transpiledPath
  },
  devServer: {
    contentBase: './public/transpiled_javascripts'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'public', 'stylesheets'),
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' }
        ]
      },
      // {
      //   test: /\.scss$/,
      //   use: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     // scss-loader after postcss-loader
      //     use: ['css-loader', 'postcss-loader', 'scss-loader']
      //   })
      // },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          // test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  plugins: [
    new CleanwebpackPlugin([transpiledPath]),
    // new webpack.optimize.SplitChunksPlugin({
    //   // name: 'common' // Specify the common bundle's name.
    //
    // }),
    // new ExtractTextPlugin('styles.css')
    new UglifyJsPlugin({
      include: /\/includes/,
      exclude: /\/excludes/,
      uglifyOptions: {
        compress: {
          warnings: true,
        },
        ie8: false,
        output: {
          comments: false,
          beautify: false,
        },
        toplevel: true,
      },
      sourceMap: true,
    }),
    // new BrowserSyncPlugin({
    //   host: 'localhost',
    //   port: 3000,
    //   proxy: 'http://localhost:3100/'
    // }, {
    //   reload: false,
    // })
  ],
  // target: 'web',
  stats: {
    colors: true
  },
  devtool: 'inline-source-map',
  node: {
    fs: 'empty',
    net: 'empty'
  },
  watch: true
};
