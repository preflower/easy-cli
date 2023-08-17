import path from 'path'
import prompts from 'prompts'
import chalk from 'chalk'

import { mergeTemplate, renderTemplate } from './utils/render-template.js'

const __dirname = path.resolve()

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
          type: 'toggle',
          name: 'lint',
          message: '是否使用格式校验工具?',
          initial: true,
          active: '是',
          inactive: '否'
        },
        {
          type: prev => prev === true ? 'select' : null,
          name: 'stylelint',
          message: '请选择CSS扩展',
          choices: [
            {
              title: 'CSS',
              value: undefined
            },
            {
              title: 'SASS',
              value: 'sass'
            }, {
              title: 'LESS',
              value: 'less'
            }
          ]
        },
        {
          type: 'multiselect',
          name: 'plugins',
          message: '请勾选需要的插件',
          choices: [
            {
              title: 'changesets',
              value: 'changesets'
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

  const { framework, lint, stylelint, plugins } = result

  const templateRoot = path.resolve(__dirname, 'template')

  const render = function render (templateName) {
    const templateDir = path.resolve(templateRoot, templateName)
    mergeTemplate(templateDir)
  }

  render('base')

  if (lint) {
    render('eslint/base')

    if (framework === 'vue') {
      render('eslint/vue')
    } else if (framework === 'react') {
      render('eslint/react')
    }

    if (stylelint === 'less') {
      render('stylelint/less')
    } else {
      render('stylelint/sass')
    }
  }

  if (plugins.includes('changesets')) {
    render('changesets')
  }

  renderTemplate(process.cwd())
}

init().catch(e => { console.log(e) })
