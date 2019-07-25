import { execSync } from 'child_process';
import { join } from 'path';

export function runGit(cwd, command) {
  const gitCommand = ['git', command].join(' ');
  const execOptions = { encoding: 'utf8', cwd };

  /* istanbul ignore else */
  if (cwd) {
    execOptions.cwd = join(cwd, '.git');
  }

  const insideGit = execSync('git rev-parse --is-inside-git-dir', execOptions);
  const insideWorkTree = execSync('git rev-parse --is-inside-work-tree', { ...execOptions, cwd });

  if (insideGit.indexOf('true') === -1 || insideWorkTree.indexOf('true') === -1) {
    // tslint:disable-next-line:no-console
    console.log('GitRevPlugin: project is not under git');
    return '';
  }

  const output = execSync(gitCommand, execOptions);

  return output.toString().replace(/[\s\r\n]+$/, '');
}
