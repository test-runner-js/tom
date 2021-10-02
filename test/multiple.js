import Test from '../index.js'
import Tom from '@test-runner/tom'
import getAssert from 'isomorphic-assert'

async function start () {
  const tom = new Tom()
  const a = await getAssert()

  tom.test('both sync: one pass one fail', async function () {
    const actuals = []
    const one = new Test('one', () => true)
    const two = new Test('two', () => { throw new Error('broken') })
    one.on('pass', () => actuals.push('one-pass'))
    one.on('fail', () => actuals.push('one-fail'))
    two.on('pass', () => actuals.push('two-pass'))
    two.on('fail', () => actuals.push('two-fail'))
    try {
      await one.run()
      await two.run()
      throw new Error('should not reach here')
    } catch (err) {
      a.ok(/broken/.test(err.message))
      actuals.push('broken')
    } finally {
      a.deepEqual(actuals, ['one-pass', 'two-fail', 'broken'])
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
      throw new Error('should not reach here')
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

  return tom
}

export default start()
