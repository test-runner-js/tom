import Test from '../index.mjs'
import a from 'assert'
import { halt } from './lib/util.mjs'

{ /* new Test ({ skip: true }) */
  const actuals = []
  const skippedTest = new Test(() => { actuals.push('one' ) }, { skip: true })
  a.strictEqual(skippedTest.markedSkip, true)
  skippedTest.run()
    .then(() => {
      a.deepStrictEqual(actuals, [])
    })
    .catch(halt)
}

{ /* tom.skip(): event args */
  let actuals = []
  const tom = new Test()
  const skippedTest = tom.skip('one', () => 1)
  skippedTest.on('skip', (test, result) => {
    a.strictEqual(test, skippedTest)
    a.strictEqual(result, undefined)
  })
  skippedTest.run()
    .catch(halt)
}

{ /* tom.skip(): only emit "skipped" */
  const actuals = []
  const tom = new Test()
  const skippedTest = tom.skip('one', () => 1)
  tom.on(function (eventName) { actuals.push(eventName) })
  skippedTest.run()
    .then(() => {
      a.deepStrictEqual(actuals, [ 'state', 'skipped' ])
    })
    .catch(halt)
}

{ /* tom.skip(): testFn is not run */
  const actuals = []
  const tom = new Test()
  const skippedTest = tom.skip('one', () => { actuals.push('one' ) })
  Promise
    .all([ tom.run(), skippedTest.run() ])
    .then(() => {
      a.deepStrictEqual(actuals, [])
    })
    .catch(halt)
}

{ /* tom.skip(): multiple */
  const actuals = []
  const tom = new Test()
  const one = tom.skip('one', () => 1)
  const two = tom.skip('two', () => 2)
  tom.on(function (eventName) { actuals.push(eventName) })
  Promise
    .all([ tom.run(), one.run(), two.run() ])
    .then(() => {
      a.deepStrictEqual(actuals, [
        'state',
        'ignored',
        'state',
        'skipped',
        'state',
        'skipped'
      ])
    })
    .catch(halt)
}

{ /* skippedTest.run(): skip event args */
  let actuals = []
  const tom = new Test()
  const test = tom.skip('one', () => 1)
  test.on('skip', (t, result) => {
    a.strictEqual(t, test)
    a.strictEqual(result, undefined)
  })
  test.run()
    .catch(halt)
}

