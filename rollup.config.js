import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'cjs',
    banner: '#!/usr/bin/env node'
  },
  plugins: [commonjs(), nodeResolve()]
}
