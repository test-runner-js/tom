import Test from '../index.mjs'
import Tom from 'test-object-model'
import assert from 'assert'
const a = assert.strict

const tom = new Tom()

tom.test('grouping', async function () {
  const root = new Test('root')
  const one = root.group('one')
  one.test('1.1', () => '1.1')
  const two = root.group('two')
  two.test('2.1', () => '2.1')
  const result = Array.from(root).map(t => [t.name, t.state])
  a.deepEqual(result, [
    [ 'root', 'pending' ],
    [ 'one', 'pending' ],
    [ '1.1', 'pending' ],
    [ 'two', 'pending' ],
    [ '2.1', 'pending' ]
  ])
})

export default tom
