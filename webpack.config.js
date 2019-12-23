const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')

console.log('filename', path.join(__dirname, '/src/index/index.js'))
console.log('dist', path.join(__dirname, '/dist'))

module.exports = {
  entry: {
    index: path.join(__dirname, '/src/index/index.js'),
    shape: path.join(__dirname, '/src/shape/index.js'),
    event: path.join(__dirname, '/src/event/index.js')
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
      },
      {
        test: /\.styl/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'stylus-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/index/index.html'),
      inject: true,
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/shape/index.html'),
      inject: true,
      chunks: ['shape']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/event/index.html'),
      inject: true,
      chunks: ['event']
    })
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  },
  mode: 'development',
  devtool: 'inline-source-map'
}