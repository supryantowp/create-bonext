import chalk from 'chalk'
import execa from 'execa'
import Listr from 'listr'
import { projectInstall } from 'pkg-install'

async function cloneGit(options) {
  const result = await execa(
    'gh',
    ['repo', 'clone', 'supryantowp/bonext', options.projectName],
    {
      cwd: options.targetDirectory,
    }
  )
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'))
  }
  return
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  }

  const tasks = new Listr(
    [
      {
        title: 'Clone git',
        task: () => cloneGit(options),
      },
      {
        title: 'Install dependencies',
        task: () =>
          projectInstall({
            cwd: options.targetDirectory,
          }),
        skip: () =>
          !options.runInstall
            ? 'Pass --install to automatically install dependencies'
            : undefined,
      },
    ],
    {
      exitOnError: false,
    }
  )

  await tasks.run()
  console.log('%s Project ready', chalk.green.bold('DONE'))
  return true
}
