var path = require('path');
var clientSrcPath = path.join(__dirname, 'src');
var buildPath = path.join(__dirname, 'dist');
var webpack = require('webpack');
//var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    bundle: path.join(clientSrcPath, 'public', 'client-start.js'),
    vendor: [
        'vue',
        'element-ui',
        'vue-filter',
        'axios',
        'element-ui/lib/locale/lang/en',
    ]
  },
  output: {
    path: buildPath,
    publicPath: '/dist/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this nessessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
      new webpack.optimize.CommonsChunkPlugin({ name: 'vendor',  filename: 'vendor.js', minChunks: Infinity}),
      //new HtmlWebpackPlugin()
    //   new webpack.optimize.CommonsChunkPlugin({
    //       names: ['vendor', 'manifest']
    //   })
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
