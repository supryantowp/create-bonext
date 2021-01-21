import arg from 'arg'
import inquirer from 'inquirer'
import { createProject } from './main'

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install',
    },
    {
      argv: rawArgs.slice(2),
    }
  )
  return {
    projectName: args._[0],
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    runInstall: args['--install'] || false,
  }
}

async function promptForMissingOptions(options) {
  const defaultProjectName = 'My Project'
  if (options.skipPrompts) {
    return {
      ...options,
      projectName: options.projectName || defaultProjectName,
    }
  }

  const questions = []
  if (!options.projectName) {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'Input your project name:',
      default: defaultProjectName,
    })
  }

  const answers = await inquirer.prompt(questions)

  return {
    ...options,
    git: options.git || answers.git,
    projectName: options.projectName || answers.projectName,
  }
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args)
  options = await promptForMissingOptions(options)
  await createProject(options)
}
