import Test from '@test-runner/tom'
import { strict as a } from 'assert'

const test = new Map()

test.set('test.run(): state, passing test', async function () {
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

test.set('test.run(): state, failing test', async function () {
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

test.set('test.run(): state, no test', async function () {
  const actuals = []
  const test = new Test('one')
  actuals.push(test.state)
  await test.run()
  actuals.push(test.state)
  a.deepStrictEqual(actuals, ['pending', 'ignored'])
})

test.set('test.run(): ended, passing test', async function () {
  const test = new Test('one', function () {})
  a.strictEqual(test.ended, false)
  await test.run()
  a.strictEqual(test.ended, true)
})

test.set('test.run(): ended, failing test', async function () {
  const test = new Test('one', function () {
    throw new Error('broken')
  })
  a.strictEqual(test.ended, false)
  try {
    await test.run()
    throw new Error('should not reach here')
  } catch (err) {
    a.ok(/broken/.test(err.cause.message))
  } finally {
    a.strictEqual(test.ended, true)
  }
})

test.set('test.run(): todo', async function () {
  const actuals = []
  const test = new Test('one', { todo: true })
  actuals.push(test.state)
  await test.run()
  actuals.push(test.state)
  a.deepStrictEqual(actuals, ['pending', 'todo'])
})

export { test }
