import Test from '@test-runner/tom'
import { strict as a } from 'assert'

const test = new Map()

test.set('passing sync test', async function () {
  const test = new Test('tom', () => true)
  const result = await test.run()
  a.strictEqual(result, true)
  a.strictEqual(test.result, result)
})

test.set('failing sync test', async function () {
  const failedErr = new Error('failed')
  const test = new Test('tom', function () {
    throw failedErr
  })
  try {
    await test.run()
    throw new Error('should not reach here')
  } catch (err) {
    a.ok(/failed/.test(err.cause.message))
    a.strictEqual(err.isTestFail, true)
  } finally {
    a.strictEqual(test.result, failedErr)
  }
})

test.set('passing async test', async function () {
  const test = new Test('tom', async () => true)
  const result = await test.run()
  a.strictEqual(result, true)
  a.strictEqual(test.result, result)
})

test.set('failing async test: rejected', async function () {
  const failedErr = new Error('failed')
  const test = new Test('tom', async function () {
    throw failedErr
  })
  try {
    await test.run()
    throw new Error('should not reach here')
  } catch (err) {
    a.ok(/failed/.test(err.cause.message))
    a.strictEqual(err.isTestFail, true)
    a.strictEqual(test.result, err.cause)
  }
})

test.set("no test function: ignore, don't start, skip, pass or fail event", async function () {
  const test = new Test('one')
  const result = await test.run()
  a.strictEqual(result, undefined)
  a.strictEqual(test.ended, false)
  a.strictEqual(test.state, 'ignored')
  a.strictEqual(test.result, result)
})

export { test }
