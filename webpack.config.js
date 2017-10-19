const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')

const debug = process.env.NODE_ENV !== 'production'
const rootPath = path.join(__dirname)
const srcPath = path.join(rootPath, 'src')

module.exports = {
  entry: {
    main: path.join(srcPath, 'index.js')
  },
  output: {
    path: path.join(rootPath, 'build'),
    filename: `js/[name]${!debug ? '.[chunkhash:6]' : ''}.js`,
    chunkFilename: 'js/[name].[id].[chunkhash:6].chunk.js',
    publicPath: '/',
    // libraryTarget: 'umd',
    pathinfo: debug
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        // include: srcPath
      },
      {
        exclude: [
          /\.(html|jade|pug)$/,
          /\.(js|jsx)$/,
          /\.(css|scss|sass)$/,
          /\.json$/
        ],
        loader: 'file-loader',
        options: {
          name: 'static/[name].[hash:6].[ext]'
        }
      },
      {
        test: /\.(jade|pug)$/,
        loader: 'pug-loader?pretty=\t'
      },
      {
        test: /\.(css|scss|sass)$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  require('autoprefixer')({
                    browsers: [
                      'last 2 versions'
                    ]
                  })
                ]
              }
            },
            'sass-loader'
          ]
        })
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.pug'),
      inject: false
    }),
    new ExtractTextPlugin({
      filename: `css/[name]${!debug ? '.[chunkhash:6]' : ''}.css`,
      allChunks: true
    }),
    new webpack.IgnorePlugin(/^electron$/)
  ],
  devtool: debug ? 'cheap-module-source-map' : '',
  bail: !debug
}
