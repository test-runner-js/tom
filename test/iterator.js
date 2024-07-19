import Test from '@test-runner/tom'
import { strict as a } from 'assert'

const test = new Map()

test.set('Simple tree', async function () {
  const root = new Test('root', function () {})
  const A = root.test('A', function () {})
  const B = root.test('B', function () {})
  const A1 = A.test('A1', function () {})
  const A2 = A.test('A2', function () {})
  const A1A = A1.test('A1A', function () {})
  const A1B = A1.test('A1B', function () {})
  const result = []
  for (const test of root) {
    result.push(test.name)
  }
  a.deepEqual(result, [
    'root', 'A',
    'A1', 'A1A',
    'A1B', 'A2',
    'B'
  ])
})

export { test }
