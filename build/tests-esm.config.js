export default {
  input: 'test/tests.mjs',
  output: {
    file: 'dist/tests.mjs',
    format: 'esm'
  },
  external: [ 'assert', 'fsm-base' ]
}
