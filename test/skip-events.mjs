import Test from '../index.mjs'
import a from 'assert'
import { halt } from './lib/util.mjs'

{ /* test.skip(): event args */
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

{ /* skippedTest.skip(): don't emit "start", emit "skip" */
  const actuals = []
  const tom = new Test()
  const skippedTest = tom.skip('one', () => 1)
  tom.on('start', () => actuals.push('start'))
  tom.on('skip', () => actuals.push('skip'))
  skippedTest.run()
    .then(() => {
      a.deepStrictEqual(actuals, [ 'skip' ])
    })
    .catch(halt)
}

{ /* child.skip(): testFn is not run */
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

{ /* child.skip(): multiple */
  const actuals = []
  const tom = new Test()
  const one = tom.skip('one', () => 1)
  const two = tom.skip('two', () => 2)
  tom.on('start', () => actuals.push('start'))
  tom.on('skip', () => actuals.push('skip'))
  Promise
    .all([ tom.run(), one.run(), two.run() ])
    .then(results => {
      a.deepStrictEqual(actuals, [ 'skip', 'skip' ])
    })
    .catch(halt)
}
