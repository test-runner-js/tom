const resolve = require('rollup-plugin-node-resolve')

module.exports = [
  {
    input: 'index.mjs',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'Tom'
    },
    external: ['assert', 'events'],
    plugins: [resolve({ preferBuiltins: true })]
  },
  {
    input: 'index.mjs',
    output: {
      file: 'dist/index.mjs',
      format: 'esm'
    },
    external: ['assert', 'events'],
    plugins: [resolve({ preferBuiltins: true })]
  }
]
