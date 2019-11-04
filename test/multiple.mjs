import Test from '../index.mjs'
import a from 'assert'
import { halt } from './lib/util.mjs'

{ /* both sync: one pass one fail */
  const actuals = []
  const one = new Test('one', () => true)
  const two = new Test('two', () => { throw new Error('broken') })
  one.on('pass', () => actuals.push('one-pass'))
  one.on('fail', () => actuals.push('one-fail'))
  two.on('pass', () => actuals.push('two-pass'))
  two.on('fail', () => actuals.push('two-fail'))
  Promise.all([one.run(), two.run()])
    .then(() => {
      throw new Error('should not reach here')
    })
    .catch(err => {
      a.ok(/broken/.test(err.message))
      a.deepStrictEqual(actuals, ['one-pass', 'two-fail'])
    })
    .catch(halt)
}

{ /* both async: one pass one fail */
  const actuals = []
  const one = new Test('one', async () => true)
  const two = new Test('two', async () => { throw new Error('broken') })
  one.on('pass', () => actuals.push('one-pass'))
  one.on('fail', () => actuals.push('one-fail'))
  two.on('pass', () => actuals.push('two-pass'))
  two.on('fail', () => actuals.push('two-fail'))
  Promise.all([one.run(), two.run()])
    .then(() => {
      throw new Error('should not reach here')
    })
    .catch(err => {
      a.ok(/broken/.test(err.message))
      a.deepStrictEqual(actuals, ['one-pass', 'two-fail'])
    })
    .catch(halt)
}

{ /* mixed sync/async: one pass one rejected */
  const actuals = []
  const one = new Test('one', () => true)
  const two = new Test('two', async () => { throw new Error('broken') })
  one.on('pass', () => actuals.push('one-pass'))
  one.on('fail', () => actuals.push('one-fail'))
  two.on('pass', () => actuals.push('two-pass'))
  two.on('fail', () => actuals.push('two-fail'))
  Promise.all([one.run(), two.run()])
    .then(() => {
      throw new Error('should not reach here')
    })
    .catch(err => {
      a.ok(/broken/.test(err.message))
      a.deepStrictEqual(actuals, ['one-pass', 'two-fail'])
    })
    .catch(halt)
}

{ /* mixed sync/async: one fulfilled one fail */
  const actuals = []
  const one = new Test('one', async () => true)
  const two = new Test('two', () => { throw new Error('broken') })
  one.on('pass', () => actuals.push('one-pass'))
  one.on('fail', () => actuals.push('one-fail'))
  two.on('pass', () => actuals.push('two-pass'))
  two.on('fail', () => actuals.push('two-fail'))
  Promise.all([one.run(), two.run()])
    .then(() => {
      throw new Error('should not reach here')
    })
    .catch(err => {
      a.ok(/broken/.test(err.message))
      a.deepStrictEqual(actuals, ['two-fail', 'one-pass'])
    })
    .catch(halt)
}
