const { nodeResolve } = require('@rollup/plugin-node-resolve')

module.exports = [
  {
    input: 'index.mjs',
    output: {
      file: 'dist/index.mjs',
      format: 'esm'
    },
    external: ['assert', 'events', 'perf_hooks'],
    plugins: [nodeResolve({ preferBuiltins: true })]
  }
]
