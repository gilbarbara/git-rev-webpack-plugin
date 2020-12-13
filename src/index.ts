import { Compiler } from 'webpack';
import { runGit } from './utils';

interface Options {
  path?: string;
  branchCommand?: string;
  hashCommand?: string;
  tagCommand?: string;
}

function GitRevPlugin(this: Options, options: Options = {}): void {
  this.path = options.path;

  this.branchCommand = options.branchCommand || 'rev-parse --abbrev-ref HEAD';
  this.hashCommand = options.hashCommand || 'rev-parse --short HEAD';
  this.tagCommand = options.tagCommand || 'describe --abbrev=0 --tags';
}

GitRevPlugin.prototype.apply = function apply(compiler: Compiler): void {
  const REGEXP_BRANCH = /\[git-branch\]/gi;
  const REGEXP_HASH = /\[git-hash\]/gi;
  const REGEXP_TAG = /\[git-tag\]/gi;

  const currentBranch = runGit(this.path, this.branchCommand);
  const currentHash = runGit(this.path, this.hashCommand);
  const currentTag = runGit(this.path, this.tagCommand);

  compiler.hooks.compilation.tap('compilation', compilation => {
    /* istanbul ignore  else */
    if (typeof compilation.hooks.processAssets !== 'undefined') {
      compilation.hooks.assetPath.tap('asset-path', path => {
        return path
          .replace(REGEXP_BRANCH, currentBranch)
          .replace(REGEXP_HASH, currentHash)
          .replace(REGEXP_TAG, currentTag);
      });
    } else {
      /* istanbul ignore next */
      compilation.mainTemplate.hooks.assetPath.tap('asset-path', (path: string) => {
        return path
          .replace(REGEXP_BRANCH, currentBranch)
          .replace(REGEXP_HASH, currentHash)
          .replace(REGEXP_TAG, currentTag);
      });
    }
  });
};

GitRevPlugin.prototype.branch = function branch(): string {
  return runGit(this.path, this.branchCommand);
};

GitRevPlugin.prototype.hash = function hash(long = false): string {
  return runGit(this.path, long ? this.hashCommand.replace(' --short', '') : this.hashCommand);
};

GitRevPlugin.prototype.tag = function tag(): string {
  return runGit(this.path, this.tagCommand);
};

export default GitRevPlugin;
