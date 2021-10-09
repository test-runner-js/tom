import Test from '../index.js'
import Tom from '@test-runner/tom'
import getAssert from 'isomorphic-assert'

async function start () {
  const tom = new Tom()
  const a = await getAssert()

  tom.test('passing sync test', async function () {
    const test = new Test('tom', () => true)
    const result = await test.run()
    a.strictEqual(result, true)
    a.strictEqual(test.result, result)
  })

  tom.test('failing sync test', async function () {
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

  tom.test('passing async test', async function () {
    const test = new Test('tom', async () => true)
    const result = await test.run()
    a.strictEqual(result, true)
    a.strictEqual(test.result, result)
  })

  tom.test('failing async test: rejected', async function () {
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

  tom.test("no test function: ignore, don't start, skip, pass or fail event", async function () {
    const test = new Test('one')
    const result = await test.run()
    a.strictEqual(result, undefined)
    a.strictEqual(test.ended, false)
    a.strictEqual(test.state, 'ignored')
    a.strictEqual(test.result, result)
  })

  return tom
}

export default start()
