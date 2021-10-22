import fs from 'fs'
import path from 'path'

import deepMerge from './deep-merge'
import sortDependencies from './sort-dependencies'

const templates = {}

export function mergeTemplate (src, dest) {
  const stats = fs.statSync(src)

  if (stats.isDirectory()) {
    for (const file of fs.readdirSync(src)) {
      mergeTemplate(path.resolve(src, file), path.join(dest ?? '', file))
    }
  } else {
    const filename = dest ?? path.basename(src)
    const templateFile = fs.readFileSync(src)
    // merge file if it can be parsed, otherwise override it
    try {
      const mergedFile = JSON.parse(templateFile)
      templates[filename] = deepMerge(templates[filename] ?? {}, mergedFile)
    } catch {
      templates[filename] = templateFile
    }
  }
}

export function updateRepository (repository) {
  const pkg = templates['package.json']
  templates['package.json'] = JSON.parse(JSON.stringify(pkg).replace(/\$\{repository\}/g, repository))
}

export function renderTemplate (root) {
  const { 'package.json': newPackage, ...others } = templates

  let existPackage
  try {
    existPackage = JSON.parse(fs.readFileSync(path.resolve(root, 'package.json')))
  } catch {
    existPackage = {}
  }
  // remove existPackage built-in eslintConfig
  delete existPackage.eslintConfig
  const pkg = sortDependencies(deepMerge(existPackage, newPackage))
  fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(pkg, null, 2) + '\n')

  for (const filePath in others) {
    const dirname = path.dirname(filePath)
    let data = others[filePath]
    if (Object.prototype.toString.call(data) === '[object Object]') {
      data = JSON.stringify(data, null, 2) + '\n'
    }
    const dest = path.resolve(root, filePath)
    if (dirname !== '.') {
      fs.mkdirSync(path.resolve(root, dirname), { recursive: true })
    }
    fs.writeFileSync(dest, data)
  }
}
