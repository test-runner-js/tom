import Test from '../index.mjs'
import Tom from '../node_modules/test-object-model/dist/index.mjs'
import assert from 'assert'
const a = assert.strict

const tom = new Tom()

tom.test('both sync: one pass one fail', async function () {
  const actuals = []
  const one = new Test('one', () => true)
  const two = new Test('two', () => { throw new Error('broken') })
  one.on('pass', () => actuals.push('one-pass'))
  one.on('fail', () => actuals.push('one-fail'))
  two.on('pass', () => actuals.push('two-pass'))
  two.on('fail', () => actuals.push('two-fail'))
  try {
    await Promise.all([one.run(), two.run()])
  } catch (err) {
    a.ok(/broken/.test(err.message))
  } finally {
    a.deepEqual(actuals, ['one-pass', 'two-fail'])
  }
})

tom.test('both async: one pass one fail', async function () {
  const actuals = []
  const one = new Test('one', async () => true)
  const two = new Test('two', async () => { throw new Error('broken') })
  one.on('pass', () => actuals.push('one-pass'))
  one.on('fail', () => actuals.push('one-fail'))
  two.on('pass', () => actuals.push('two-pass'))
  two.on('fail', () => actuals.push('two-fail'))
  try {
    await Promise.all([one.run(), two.run()])
  } catch (err) {
    a.ok(/broken/.test(err.message))
  } finally {
    a.deepEqual(actuals, ['one-pass', 'two-fail'])
  }
})

tom.test('mixed sync/async: one pass one rejected', async function () {
  const actuals = []
  const one = new Test('one', () => true)
  const two = new Test('two', async () => { throw new Error('broken') })
  one.on('pass', () => actuals.push('one-pass'))
  one.on('fail', () => actuals.push('one-fail'))
  two.on('pass', () => actuals.push('two-pass'))
  two.on('fail', () => actuals.push('two-fail'))
  try {
    await Promise.all([one.run(), two.run()])
  } catch (err) {
    a.ok(/broken/.test(err.message))
  } finally {
    a.deepEqual(actuals, ['one-pass', 'two-fail'])
  }
})

tom.test('mixed sync/async: one fulfilled one fail', async function () {
  const actuals = []
  const one = new Test('one', async () => true)
  const two = new Test('two', () => { throw new Error('broken') })
  one.on('pass', () => actuals.push('one-pass'))
  one.on('fail', () => actuals.push('one-fail'))
  two.on('pass', () => actuals.push('two-pass'))
  two.on('fail', () => actuals.push('two-fail'))
  try {
    await Promise.all([one.run(), two.run()])
  } catch (err) {
    a.ok(/broken/.test(err.message))
  } finally {
    a.deepEqual(actuals, ['two-fail', 'one-pass'])
  }
})

export default tom
