const path = require('path');
const libraryName = 'library';
const outputFile = libraryName + '.js';

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.worker\.js$/, use: { loader: 'worker-loader' } }
    ]
  }
};