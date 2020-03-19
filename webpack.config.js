const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: __dirname + '/src/client.jsx',
  module: {
    rules: [
      {
        test: /\.js[x]*$/,
        //exclude: /(node_modules\/[a-z]|@[a-hj-z]|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          }
        }
      }
    ]
  },
  node: {
    //I copied this section from someone else's version that worked for WebTorrent, definately need fs, unclear if need others.
    //global: true,
    crypto: 'empty',
    fs: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false,
    console: false
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            unused: false,
            collapse_vars: false // debug has a problem in production without this.
          }

          // compress: false  or alternatively remove compression, it only makes about a 5% difference
        }
      })
    ]
  },
  output: {
    filename: 'client.js',
    path: __dirname + '/dist'
  },
  // plugins: [HTMLWebpackPluginConfig]

  plugins: [
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'source-map'
};
