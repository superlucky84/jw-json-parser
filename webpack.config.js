const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/javascript/index.js',
  output: {
    path: __dirname + "/dist",
    filename: 'bundle.js',
    publicPath: '/',
    libraryTarget: 'umd'

  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        query: {
          presets: ['es2015','es2016'],
          cacheDirectory: false
        }
      },
			{
				test: /\.sass$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader!sass-loader'
				}),
			}

    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'bundle.css',
    })
  ]
};
