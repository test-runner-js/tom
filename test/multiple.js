import Test from '@test-runner/tom'
import { strict as a } from 'assert'

const test = new Map()
const only = new Map()

test.set('both sync: one pass one fail', async function () {
  const actuals = []
  const one = new Test('one', () => true)
  const two = new Test('two', () => { throw new Error('broken') })
  one.addEventListener('pass', () => actuals.push('one-pass'))
  one.addEventListener('fail', () => actuals.push('one-fail'))
  two.addEventListener('pass', () => actuals.push('two-pass'))
  two.addEventListener('fail', () => actuals.push('two-fail'))
  try {
    await one.run()
    await two.run()
    throw new Error('should not reach here')
  } catch (err) {
    a.ok(/broken/.test(err.cause.message))
    actuals.push('broken')
  } finally {
    a.deepEqual(actuals, ['one-pass', 'two-fail', 'broken'])
  }
})

test.set('both async: one pass one fail', async function () {
  const actuals = []
  const one = new Test('one', async () => true)
  const two = new Test('two', async () => { throw new Error('broken') })
  one.addEventListener('pass', () => actuals.push('one-pass'))
  one.addEventListener('fail', () => actuals.push('one-fail'))
  two.addEventListener('pass', () => actuals.push('two-pass'))
  two.addEventListener('fail', () => actuals.push('two-fail'))
  try {
    await Promise.all([one.run(), two.run()])
  } catch (err) {
    a.ok(/broken/.test(err.cause.message))
  } finally {
    a.deepEqual(actuals, ['one-pass', 'two-fail'])
  }
})

test.set('mixed sync/async: one pass one rejected', async function () {
  const actuals = []
  const one = new Test('one', () => true)
  const two = new Test('two', async () => { throw new Error('broken') })
  one.addEventListener('pass', () => actuals.push('one-pass'))
  one.addEventListener('fail', () => actuals.push('one-fail'))
  two.addEventListener('pass', () => actuals.push('two-pass'))
  two.addEventListener('fail', () => actuals.push('two-fail'))
  try {
    await Promise.all([one.run(), two.run()])
    throw new Error('should not reach here')
  } catch (err) {
    a.ok(/broken/.test(err.cause.message))
  } finally {
    a.deepEqual(actuals, ['one-pass', 'two-fail'])
  }
})

test.set('mixed sync/async: one fulfilled one fail', async function () {
  const actuals = []
  const one = new Test('one', async () => true)
  const two = new Test('two', () => { throw new Error('broken') })
  one.addEventListener('pass', () => actuals.push('one-pass'))
  one.addEventListener('fail', () => actuals.push('one-fail'))
  two.addEventListener('pass', () => actuals.push('two-pass'))
  two.addEventListener('fail', () => actuals.push('two-fail'))
  try {
    await Promise.all([one.run(), two.run()])
  } catch (err) {
    a.ok(/broken/.test(err.cause.message))
  } finally {
    a.deepEqual(actuals, ['two-fail', 'one-pass'])
  }
})

export { test, only }
