import Test from '@test-runner/tom'
import { strict as a } from 'assert'

const test = new Map()

test.set('duplicate test name', async function () {
  const tom = new Test()
  tom.test('one', () => 1)
  a.throws(
    () => tom.test('one', () => 1),
    /Duplicate name/
  )
})

test.set('deep duplicate test name', async function () {
  const tom = new Test('tom')
  const child = tom.test('one', () => 1)
  a.throws(
    () => child.test('one', () => 1),
    /duplicate/i
  )
})

test.set('.test() not chainable', async function () {
  const tom = new Test()
  const result = tom.test('one', () => 1)
  a.notStrictEqual(result, tom)
})

test.set('bug in test function', async function () {
  const test = new Test('one', function () {
    asdf()
  })

  try {
    await test.run()
    throw new Error('should not reach here')
  } catch (err) {
    a.strictEqual(test.state, 'fail')
    a.ok(/asdf is not defined/.test(err.cause.message))
  }
})

test.set('tom.toString()', async function () {
  const tom = new Test('test name')
  const result = `toString: ${tom}`
  a.equal(result, 'toString: test name')
})

export { test }
