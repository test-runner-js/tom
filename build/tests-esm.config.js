export default {
  input: 'test/tests.mjs',
  output: {
    file: 'tmp/test/tests.mjs',
    format: 'esm'
  },
  external: [ 'assert', 'fsm-base' ]
}
