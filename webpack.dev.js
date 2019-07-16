const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')


module.exports = merge(common, {
  entry: './src/index.js',
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: '[name].dev.bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
})