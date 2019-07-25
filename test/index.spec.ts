/* tslint:disable:no-console */
import { copySync } from 'fs-extra/lib/copy-sync';
import { emptyDirSync } from 'fs-extra/lib/empty';
import { pathExistsSync } from 'fs-extra/lib/path-exists';
import { removeSync } from 'fs-extra/lib/remove';
import { join } from 'path';
import webpack from 'webpack';

import GitRevPlugin from '../src';

const sourceProject = join(__dirname, './__fixtures__/project');
const sourceGitRepository = join(__dirname, './__fixtures__/git-repository');

const targetProject = join(__dirname, '../.tmp/project');
const targetProjectConfig = join(targetProject, 'webpack.config.js');
const targetGitRepository = join(__dirname, '../.tmp/project/.git');
const targetBuild = join(__dirname, '../.tmp/build');

describe('GitRevPlugin', () => {
  beforeEach(() => {
    emptyDirSync(targetProject);
    copySync(sourceProject, targetProject);

    emptyDirSync(targetGitRepository);
    copySync(sourceGitRepository, targetGitRepository);

    removeSync(targetBuild);
  });

  it('should handle methods', () => {
    const gitRevPlugin = new GitRevPlugin({ path: targetProject });

    expect(gitRevPlugin.branch()).toBe('master');
    expect(gitRevPlugin.hash()).toBe('9a15b3b');
    expect(gitRevPlugin.hash(true)).toBe('9a15b3ba1f8c347f9db94bcfde9630ed4fdeb1b2');
    expect(gitRevPlugin.tag()).toBe('v2.0.0-beta');
  });

  it('should handle missing git tree', () => {
    const { log } = console;
    console.log = jest.fn();
    const gitRevPlugin = new GitRevPlugin();

    expect(gitRevPlugin.branch()).toBe('');
    expect(gitRevPlugin.hash()).toBe('');
    expect(gitRevPlugin.hash(true)).toBe('');
    expect(gitRevPlugin.tag()).toBe('');
    expect(console.log).toHaveBeenCalledTimes(4);

    console.log = log;
  });

  it('should handle webpack compilation', done => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const config = require(`${targetProjectConfig}`);

    config.context = targetProject;
    config.output.path = targetBuild;
    config.plugins = [
      new GitRevPlugin({
        path: targetProject,
      }),
    ];

    webpack(config, (error, stats) => {
      // Stats Object
      if (error || stats.hasErrors()) {
        console.log(error);
      }

      expect(pathExistsSync(join(targetBuild, 'main-master-9a15b3b-v2.0.0-beta.js'))).toBeTruthy();
      expect(
        pathExistsSync(join(targetBuild, 'outside-resource-master-v2.0.0-beta.txt')),
      ).toBeTruthy();

      done();
    });
  });
});
