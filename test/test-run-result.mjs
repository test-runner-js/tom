import Test from '../index.mjs'
import Tom from '../node_modules/test-object-model/dist/index.mjs'
import assert from 'assert'
const a = assert.strict

const tom = new Tom()

tom.test('passing sync test', async function () {
  const test = new Test('tom', () => true)
  const result = await test.run()
  a.strictEqual(result, true)
  a.strictEqual(test.result, result)
})

tom.test('failing sync test', async function () {
  const err = new Error('failed')
  const test = new Test('tom', function () {
    throw err
  })
  try {
    await test.run()
    throw new Error('should not reach here')
  } catch (err) {
    a.ok(/failed/.test(err.message))
  } finally {
    a.strictEqual(test.result, err)
  }
})

tom.test('passing async test', async function () {
  const test = new Test('tom', async () => true)
  const result = await test.run()
  a.strictEqual(result, true)
  a.strictEqual(test.result, result)
})

tom.test('failing async test: rejected', async function () {
  const err = new Error('failed')
  const test = new Test('tom', async function () {
    throw err
  })
  try {
    await test.run()
    throw new Error('should not reach here')
  } catch (err) {
    a.ok(/failed/.test(err.message))
    a.ok(test.result === err)
  }
})

tom.test("no test function: ignore, don't start, skip, pass or fail event", async function () {
  const test = new Test('one')
  const result = await test.run()
  a.strictEqual(result, undefined)
  a.strictEqual(test.ended, false)
  a.strictEqual(test.state, 'ignored')
  a.strictEqual(test.result, result)
})

export default tom
