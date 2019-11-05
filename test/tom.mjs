import Test from '../index.mjs'
import Tom from '../node_modules/test-object-model/dist/index.mjs'
import assert from 'assert'
const a = assert.strict

const tom = new Tom()

tom.test('duplicate test name', async function () {
  const tom = new Test()
  tom.test('one', () => 1)
  a.throws(
    () => tom.test('one', () => 1),
    /Duplicate name/
  )
})

tom.test('deep duplicate test name', async function () {
  const tom = new Test('tom')
  const child = tom.test('one', () => 1)
  a.throws(
    () => child.test('one', () => 1),
    /duplicate/i
  )
})

tom.test('.test() not chainable', async function () {
  const tom = new Test()
  const result = tom.test('one', () => 1)
  a.notStrictEqual(result, tom)
})

export default tom
