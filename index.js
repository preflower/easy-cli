import path from 'path'
import prompts from 'prompts'
import chalk from 'chalk'

import { mergeTemplate, renderTemplate, updateRepository } from './utils/render-template'

async function init () {
  let result = {}

  try {
    result = await prompts(
      [
        {
          name: 'framework',
          type: 'select',
          message: 'Pick Framework',
          choices: [
            { title: 'Vue2', value: 'vue2' },
            { title: 'Vue3', value: 'vue3' },
            { title: 'React', value: 'react' },
            { title: 'Bare', value: 'bare' }
          ]
        },
        {
          name: 'needTypescript',
          type: prev => prev !== 'vue2' ? 'toggle' : null,
          message: 'Add Typescript?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needPublish',
          type: 'toggle',
          message: 'Add npm publish?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
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
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }

  const { framework, needTypescript, needJsx, needPublish, repository } = result

  const templateRoot = path.resolve(__dirname, 'template')

  const render = function render (templateName) {
    const templateDir = path.resolve(templateRoot, templateName)
    mergeTemplate(templateDir)
  }

  render('base')
  if (framework === 'vue2') {
    render('vue2')
  } else if (framework === 'vue3') {
    if (needTypescript) {
      render('vue3-with-typescript')
    } else {
      render('vue3')
    }
  } else if (framework === 'react') {
    if (needTypescript) {
      render('react-with-typescript')
    } else {
      render('react')
    }
  } else {
    if (needTypescript) {
      render('typescript')
    } else {
      render('bare')
    }
  }
  if (needJsx) {
    render('jsx')
  }
  if (needPublish && repository) {
    render('npm')
    updateRepository(repository)
  }

  renderTemplate(process.cwd())
}

init().catch(e => { console.log(e) })
