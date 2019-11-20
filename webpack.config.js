const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, 'helpfulskeleton'),
  entry:{
    index: "./index.js"
  },
  output: {
    path: path.resolve(__dirname, 'release'),
    publicPath: '/release/',
    filename:'[name].bundle.js'
  },
  module:{
    rules:[
      {
        test: /\.(ts|tsx)?$/,
        include: path.resolve(__dirname, 'helpfulskeleton'),
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  }
}
/*const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  mode: 'production',
  entry: [
    './src/index.js'
  ],
  //watch: true,
  output: {
    path: path.resolve(__dirname, 'release'),
    filename: '[name].min.js',
    library: 'tasks',
    libraryTarget: 'umd'
  },
  externals: {
    three: {
      root: 'THREE',
      commonjs: 'three',
      commonjs2: 'three'
    },
    axios: 'axios'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: { loader: 'awesome-typescript-loader' }
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static'
    // })
  ]
}*/

