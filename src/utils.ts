import { execSync } from 'child_process';

interface ExecOptions {
  cwd?: string;
  stdio?: ['pipe', 'pipe', 'ignore'];
}

export function runGit(cwd: string | undefined, command: string): string {
  const gitCommand = ['git', command].join(' ');
  const execOptions: ExecOptions = { stdio: ['pipe', 'pipe', 'ignore'] };

  /* istanbul ignore else */
  if (cwd) {
    execOptions.cwd = cwd;
  }

  try {
    execSync('git rev-parse --is-inside-work-tree', execOptions);
    const output = execSync(gitCommand, execOptions);

    return output.toString().replace(/[\s\r\n]+$/, '');
  } catch (error) {
    /* istanbul ignore else */
    if (error?.toString().indexOf('is-inside-work-tree') >= 0) {
      // eslint-disable-next-line no-console
      console.log('GitRevPlugin: project is not under git');
    }

    return '';
  }
}
