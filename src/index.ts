import { IOptions, IVariables, runGit } from './utils';
import { Compiler } from 'webpack';

function GitRevPlugin(this: IVariables, options: IOptions = {}) {
  this.path = options.path;

  this.branchCommand = options.branchCommand || 'rev-parse --abbrev-ref HEAD';
  this.hashCommand = options.hashCommand || 'rev-parse --short HEAD';
  this.tagCommand = options.tagCommand || 'describe --abbrev=0 --tags';
}

GitRevPlugin.prototype.apply = function(compiler: Compiler) {
  const REGEXP_BRANCH = /\[git-branch\]/gi;
  const REGEXP_HASH = /\[git-hash\]/gi;
  const REGEXP_TAG = /\[git-tag\]/gi;

  const currentBranch = runGit(this.path, this.branchCommand);
  const currentHash = runGit(this.path, this.hashCommand);
  const currentTag = runGit(this.path, this.tagCommand);

  compiler.hooks.compilation.tap('GitRevPlugin', compilation => {
    const { mainTemplate } = compilation;

    // @ts-ignore
    mainTemplate.hooks.assetPath.tap('GitRevPlugin', (path, data) => {
      const content = typeof path === 'function' ? path(data) : path;

      return content
        .replace(REGEXP_BRANCH, currentBranch)
        .replace(REGEXP_HASH, currentHash)
        .replace(REGEXP_TAG, currentTag);
    });
  });
};

GitRevPlugin.prototype.branch = function() {
  return runGit(this.path, this.branchCommand);
};

GitRevPlugin.prototype.hash = function(long: boolean = false) {
  return runGit(this.path, long ? this.hashCommand.replace(' --short', '') : this.hashCommand);
};

GitRevPlugin.prototype.tag = function() {
  return runGit(this.path, this.tagCommand);
};

export = GitRevPlugin;
