# git-rev-webpack-plugin

[Webpack](http://webpack.github.io/) plugin for using git branch, hash (from the last commit) and tag as substitutions in output.filename and output.chunkFilename.

## Getting Started

Install it as a dev dependency.

```bash
npm install --save-dev git-rev-webpack-plugin
```

Add the plugin to your `webpack` config. For example:

```js
const GitRevPlugin = require('git-rev-webpack-plugin');

module.exports = {
  plugins: [
    new GitRevPlugin(),
  ],
  output: {
    filename: '[name]-[git-branch]-[git-tag]-[git-hash].js',
  },
};
```

Alternatively you can save the instance to re-use it:

```js
const GitRevPlugin = require('git-rev-webpack-plugin');

const gitRevPlugin = new GitRevPlugin();

module.exports = {
  plugins: [
    gitRevPlugin,
    new webpack.DefinePlugin({
      GITHASH: JSON.stringify(gitRevPlugin.hash()),
    }),
  ],
};
```



##  Options

- `branchCommand`: The git command to get the branch.  
  Defaults to: `rev-parse --abbrev-ref HEAD`
- `hashCommand`: The git command to get the commit short hash.  
  Defaults to: `rev-parse --short HEAD`
- `tagCommand`: The git command to get the latest tag.  
  Defaults to: `describe --abbrev=0 —tags`
- `path`: The path to the project if not the current cwd.



## API

- `branch()`: Get the branch
- `hash(long)`: Get the hash
- `tag()`: Get the tag



## Credits

This is based on [git-revision-webpack-plugin](https://github.com/pirelenito/git-revision-webpack-plugin).