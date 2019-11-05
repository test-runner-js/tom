module.exports = [
  {
    input: 'index.mjs',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'Tom'
    },
    external: ['assert', 'events', 'fsm-base']
  },
  {
    input: 'index.mjs',
    output: {
      file: 'dist/index.mjs',
      format: 'esm'
    },
    external: ['assert', 'events', 'fsm-base']
  }
]
