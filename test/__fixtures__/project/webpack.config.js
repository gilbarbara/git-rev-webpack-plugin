module.exports = {
  entry: './index.js',
  output: {
    publicPath: 'http://cdn.com/assets/[git-branch]/[git-tag]/[git-hash]',
    filename: '[name]-[git-branch]-[git-hash]-[git-tag].js',
  },
  module: {
    rules: [
      {
        test: /\.(txt)$/,
        use: 'file-loader?name=[name]-[git-branch]-[git-tag].[ext]',
      },
    ],
  },
};
