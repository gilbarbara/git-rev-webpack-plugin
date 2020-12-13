const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './index.js',
  output: {
    publicPath: 'http://cdn.com/assets/[git-branch]/[git-tag]',
    filename: '[name]-[git-hash].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[git-hash].css',
      chunkFilename: '[id]-[git-hash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(txt)$/,
        use: 'file-loader?name=[name]-[git-hash].[ext]',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
