import Test from '@test-runner/tom'
import { strict as a } from 'assert'

const test = new Map()

test.set('grouping', async function () {
  const root = new Test('root')
  const one = root.group('one')
  one.test('1.1', () => '1.1')
  const two = root.group('two')
  two.test('2.1', () => '2.1')
  const result = Array.from(root).map(t => [t.name, t.state])
  a.deepEqual(result, [
    ['root', 'pending'],
    ['one', 'pending'],
    ['1.1', 'pending'],
    ['two', 'pending'],
    ['2.1', 'pending']
  ])
})

export { test }
