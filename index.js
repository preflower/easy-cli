import fs from 'fs'
import path from 'path'
import prompts from 'prompts'
import chalk from 'chalk'

async function init () {
  const cwd = process.cwd
  process.cwd()

  let result = {}

  try {
    result = await prompts(
      [
        {
          name: 'framework',
          type: 'select',
          message: 'Pick Framework',
          choices: [
            { title: 'Vue', value: 'vue' },
            { title: 'React', value: 'react' },
            { title: 'Bare', value: 'bare' }
          ]
        },
        {
          name: 'needTypescript',
          message: 'Add Typescript?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needJsx',
          message: 'Add JSX Support?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needPublish',
          message: 'Add npm publish?',
          initial: false,
          active: 'Yes',
          inactive: 'No',
          onState: (state) => (isNeedPublishToNpm = state.value ?? false)
        },
        {
          name: 'repository',
          type: prev => prev ? 'text' : null,
          message: 'Repository:'
        }
      ],
      {
        onCancel: () => {
          throw new Error(chalk.red('✖') + ' Operation cancelled')
        }
      }
    )
  } catch(e) {
    console.log(e.message)
    process.exit(1)
  }
}
const {needTypescript, needJsx, needPublish, repository} = result



init().then(e => { console.log(e) })
