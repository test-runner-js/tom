import Test from '../index.mjs'
import a from 'assert'
import { halt } from './lib/util.mjs'

{ /* test.run(): state, passing test */
  let actuals = []
  const test = new Test('one', function () {
    actuals.push(test.state)
  })
  actuals.push(test.state)
  a.strictEqual(test.ended, false)
  test.run()
    .then(result => {
      actuals.push(test.state)
      a.deepStrictEqual(actuals, [ 'pending', 'in-progress', 'pass' ])
      a.strictEqual(test.ended, true)
    })
    .catch(halt)
}

{ /* test.run(): state, failing test */
  let actuals = []
  const test = new Test('one', function () {
    actuals.push(test.state)
    throw new Error('broken')
  })
  actuals.push(test.state)
  test.run()
    .then(result => {
      actuals.push(test.state)
    })
    .catch(err => {
      actuals.push(test.state)
      a.deepStrictEqual(actuals, [ 'pending', 'in-progress', 'fail' ])
      a.strictEqual(test.ended, true)
    })
    .catch(halt)
}

{ /* test.run(): state, no test */
  let actuals = []
  const test = new Test('one')
  actuals.push(test.state)
  test.run()
    .then(result => {
      actuals.push(test.state)
      a.deepStrictEqual(actuals, [ 'pending', 'ignored' ])
    })
    .catch(halt)
}

{ /* test.run(): ended, passing test */
  const test = new Test('one', function () {})
  a.strictEqual(test.ended, false)
  test.run()
    .then(result => {
      a.strictEqual(test.ended, true)
    })
    .catch(halt)
}

{ /* test.run(): ended, failing test */
  const test = new Test('one', function () {
    throw new Error('broken')
  })
  a.strictEqual(test.ended, false)
  test.run()
    .catch(err => {
      a.strictEqual(test.ended, true)
    })
    .catch(halt)
}
