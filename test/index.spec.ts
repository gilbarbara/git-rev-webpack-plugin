import { copySync, emptyDirSync, pathExistsSync, readFileSync, removeSync } from 'fs-extra';
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

  it('should return the correct data', () => {
    const gitRevPlugin = new GitRevPlugin({ path: targetProject });

    expect(gitRevPlugin.branch()).toBe('master');
    expect(gitRevPlugin.hash()).toBe('9a15b3b');
    expect(gitRevPlugin.hash(true)).toBe('9a15b3ba1f8c347f9db94bcfde9630ed4fdeb1b2');
    expect(gitRevPlugin.tag()).toBe('v2.0.0-beta');
  });

  it('should handle missing git tree', () => {
    const { log } = console;
    console.log = jest.fn();
    const gitRevPlugin = new GitRevPlugin({ path: '../../' });

    expect(gitRevPlugin.branch()).toBe('');
    expect(gitRevPlugin.hash()).toBe('');
    expect(gitRevPlugin.hash(true)).toBe('');
    expect(gitRevPlugin.tag()).toBe('');
    expect(console.log).toHaveBeenCalledTimes(4);

    console.log = log;
  });

  it('should handle webpack compilation', done => {
    const config = require(`${targetProjectConfig}`);

    config.context = targetProject;
    config.output.path = targetBuild;
    config.plugins = config.plugins.concat([
      new GitRevPlugin({
        path: targetProject,
      }),
    ]);

    webpack(config, (error, stats) => {
      if (error || stats?.hasErrors()) {
        done.fail(`Webpack failed:  ${error}`);
      }

      const html = readFileSync(join(targetBuild, 'index.html'), 'utf8');

      expect(pathExistsSync(join(targetBuild, 'main-9a15b3b.js'))).toBeTruthy();
      expect(pathExistsSync(join(targetBuild, 'main-9a15b3b.css'))).toBeTruthy();
      expect(pathExistsSync(join(targetBuild, 'outside-resource-9a15b3b.txt'))).toBeTruthy();
      expect(pathExistsSync(join(targetBuild, 'index.html'))).toBeTruthy();
      expect(
        html.indexOf('http://cdn.com/assets/master/v2.0.0-beta/main-9a15b3b.js') >= 0,
      ).toBeTruthy();

      done();
    });
  });
});
