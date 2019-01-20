export default {
  input: 'index.mjs',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'Tom'
  },
  external: [ 'assert', 'events', 'fsm-base' ]
}
