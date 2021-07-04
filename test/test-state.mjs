import Test from '../index.mjs'
import Tom from '@test-runner/tom'
import getAssert from 'isomorphic-assert'

async function start () {
  const tom = new Tom()
  const a = await getAssert()

  tom.test('test.run(): state, passing test', async function () {
    const actuals = []
    const test = new Test('one', function () {
      actuals.push(test.state)
    })
    actuals.push(test.state)
    a.strictEqual(test.ended, false)
    await test.run()
    actuals.push(test.state)
    a.deepStrictEqual(actuals, ['pending', 'in-progress', 'pass'])
    a.strictEqual(test.ended, true)
  })

  tom.test('test.run(): state, failing test', async function () {
    const actuals = []
    const test = new Test('one', function () {
      actuals.push(test.state)
      throw new Error('broken')
    })
    actuals.push(test.state)
    try {
      await test.run()
      actuals.push(test.state)
    } catch (err) {
      actuals.push(test.state)
    } finally {
      a.deepStrictEqual(actuals, ['pending', 'in-progress', 'fail'])
      a.strictEqual(test.ended, true)
    }
  })

  tom.test('test.run(): state, no test', async function () {
    const actuals = []
    const test = new Test('one')
    actuals.push(test.state)
    await test.run()
    actuals.push(test.state)
    a.deepStrictEqual(actuals, ['pending', 'ignored'])
  })

  tom.test('test.run(): ended, passing test', async function () {
    const test = new Test('one', function () {})
    a.strictEqual(test.ended, false)
    await test.run()
    a.strictEqual(test.ended, true)
  })

  tom.test('test.run(): ended, failing test', async function () {
    const test = new Test('one', function () {
      throw new Error('broken')
    })
    a.strictEqual(test.ended, false)
    try {
      await test.run()
      throw new Error('should not reach here')
    } catch (err) {
      a.ok(/broken/.test(err.message))
    } finally {
      a.strictEqual(test.ended, true)
    }
  })

  tom.test('test.run(): todo', async function () {
    const actuals = []
    const test = new Test('one', { todo: true })
    actuals.push(test.state)
    await test.run()
    actuals.push(test.state)
    a.deepStrictEqual(actuals, ['pending', 'todo'])
  })

  return tom
}

export default start()
