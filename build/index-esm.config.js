export default {
  input: 'index.mjs',
  output: {
    file: 'dist/index.mjs',
    format: 'esm'
  },
  external: [ 'assert', 'events', 'fsm-base' ]
}
