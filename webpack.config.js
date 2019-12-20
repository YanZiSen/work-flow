const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')

console.log('filename', path.join(__dirname, '/src/index/index.js'))
console.log('dist', path.join(__dirname, '/dist'))

module.exports = {
  entry: {
    index: path.join(__dirname, '/src/index/index.js')
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: [{
          loader: 'babel-loader',
          options: {}
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/index/index.html'),
      inject: true,
      chunks: ['index']
    })
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  },
  mode: 'development',
  devtool: 'inline-source-map'
}