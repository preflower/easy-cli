import path from 'path'
import prompts from 'prompts'
import chalk from 'chalk'

import { mergeTemplate, renderTemplate } from './utils/render-template'

async function init () {
  let result = {}

  try {
    result = await prompts(
      [
        {
          type: 'select',
          name: 'framework',
          message: '请选择框架',
          choices: [
            {
              title: 'Vanilla',
              value: undefined
            },
            {
              title: 'Vue',
              value: 'vue'
            }, {
              title: 'React',
              value: 'react'
            }
          ]
        },
        {
          type: 'multiselect',
          name: 'wanna',
          message: '请勾选需要的插件',
          choices: [
            {
              title: 'changesets',
              value: 'changesets'
            }, {
              title: 'lint',
              value: 'lint'
            }
          ]
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

  const { wanna, framework } = result

  const templateRoot = path.resolve(__dirname, 'template')

  const render = function render (templateName) {
    const templateDir = path.resolve(templateRoot, templateName)
    mergeTemplate(templateDir)
  }

  render('base')

  if (wanna.includes('changesets')) {
    render('changesets')
  }

  if (wanna.includes('lint')) {
    render('lint/base')

    if (framework === 'vue') {
      render('lint/vue')
    } else if (framework === 'react') {
      render('lint/react')
    }
  }

  renderTemplate(process.cwd())
}

init().catch(e => { console.log(e) })
