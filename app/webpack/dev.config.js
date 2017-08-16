const path = require('path')
const webpack = require('webpack')
const config = require('config')

module.exports = {
  context: __dirname,
  entry: [
    'babel-polyfill',
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    '../frontend/index.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/assets',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devtool: '#source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(config.env),
      'API_HOST': JSON.stringify(config.server.apiHost)
    })
  ],
  resolve: {
    alias: {
      '~core': path.resolve('./app/frontend/core')
    }
  }
}