import Test from '../index.mjs'
import Tom from '../node_modules/test-object-model/dist/index.mjs'
import assert from 'assert'
const a = assert.strict

const tom = new Tom()

tom.test('valid test', async function () {
  const tom = new Test('one', () => 1)
  a.doesNotThrow(
    () => Test.validate(tom)
  )
})

tom.test('invalid test', async function () {
  const tom = {}
  a.throws(
    () => Test.validate(tom),
    /valid tom required/i
  )
})

tom.test('invalid test 2', async function () {
  a.throws(
    () => Test.validate(),
    /valid tom required/i
  )
})

export default tom
