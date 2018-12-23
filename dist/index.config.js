export default {
  input: 'index.mjs',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'Test'
  },
  external: [ 'assert', 'events', 'fsm-base' ]
}
