import Test from '../index.mjs'
import Tom from '../node_modules/test-object-model/dist/index.mjs'
import assert from 'assert'
const a = assert.strict

const tom = new Tom()

tom.test('bug in test function', async function () {
  const test = new Test('one', function () {
    asdf()
  })

  try {
    await test.run()
    throw new Error('should not reach here')
  } catch (err) {
    a.strictEqual(test.state, 'fail')
    a.ok(/asdf is not defined/.test(err.message))
  }
})

export default tom
