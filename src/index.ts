import { runGit } from './utils';

export interface IOptions {
  path?: string;
  branchCommand?: string;
  hashCommand?: string;
  tagCommand?: string;
}

export interface IMembers {
  path?: string;
  branchCommand: string;
  hashCommand: string;
  tagCommand: string;
  substitutionTypes: string[];
}

function GitRevPlugin(this: IMembers, options: IOptions = {}) {
  this.path = options.path;

  this.branchCommand = options.branchCommand || 'rev-parse --abbrev-ref HEAD';
  this.hashCommand = options.hashCommand || 'rev-parse --short HEAD';
  this.tagCommand = options.tagCommand || 'describe --abbrev=0 --tags';

  this.substitutionTypes = ['branch', 'hash', 'tag'];
}

GitRevPlugin.prototype.apply = function(compiler) {
  compiler.hooks.emit.tapAsync('GitRevPlugin', (compilation, callback) => {
    const { assets } = compilation;

    Object.keys(assets).forEach(d => {
      let key = d;

      this.substitutionTypes.forEach(type => {
        if (key.indexOf(`[git-${type}]`) >= 0) {
          const value = runGit(this.path, this[`${type}Command`]);
          const regex = new RegExp(`\\[git-${type}\\]`, 'gi');
          const nextKey = key.replace(regex, value);

          assets[nextKey] = assets[key];
          delete assets[key];

          key = nextKey;
        }
      });
    });

    callback();
  });
};

GitRevPlugin.prototype.branch = function() {
  return runGit(this.path, this.branchCommand);
};

GitRevPlugin.prototype.hash = function(long = false) {
  return runGit(this.path, long ? this.hashCommand.replace(' --short', '') : this.hashCommand);
};

GitRevPlugin.prototype.tag = function() {
  return runGit(this.path, this.tagCommand);
};

export default GitRevPlugin;
