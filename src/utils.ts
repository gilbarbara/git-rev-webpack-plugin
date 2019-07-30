import { execSync } from 'child_process';

export interface IOptions {
  path?: string;
  branchCommand?: string;
  hashCommand?: string;
  tagCommand?: string;
}

export interface IVariables {
  path?: string;
  branchCommand: string;
  hashCommand: string;
  tagCommand: string;
}

interface IExecOptions {
  cwd?: string;
}

export function runGit(cwd: string | undefined, command: string) {
  const gitCommand = ['git', command].join(' ');
  const execOptions: IExecOptions = {};

  /* istanbul ignore else */
  if (cwd) {
    execOptions.cwd = cwd;
  }

  try {
    execSync('git rev-parse --is-inside-work-tree', execOptions);
    const output = execSync(gitCommand, execOptions);

    return output.toString().replace(/[\s\r\n]+$/, '');
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log('GitRevPlugin: project is not under git');
    return '';
  }
}
