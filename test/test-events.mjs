import Test from '../index.mjs'
import a from 'assert'
import { halt } from './lib/util.mjs'

{ /* test.run(): event order, passing test */
  let actuals = []
  const test = new Test('one', () => actuals.push('body'))
  test.on('start', test => actuals.push('start'))
  test.on('pass', test => actuals.push('pass'))
  test.on('end', test => actuals.push('end'))
  test.run()
    .then(() => a.deepStrictEqual(actuals, [ 'start', 'body', 'pass', 'end' ]))
    .catch(halt)
}

{ /* test.run(): event order, failing test */
  let actuals = []
  const test = new Test('one', function () {
    actuals.push('body')
    throw new Error('broken')
  })
  test.on('start', test => actuals.push('start'))
  test.on('fail', test => actuals.push('fail'))
  test.on('end', test => actuals.push('end'))
  test.run()
    .then(() => {
      throw new Error('should not reach here')
    })
    .catch(err => {
      a.strictEqual(err.message, 'broken')
      a.deepStrictEqual(actuals, [ 'start', 'body', 'fail', 'end' ])
    })
    .catch(halt)
}

{ /* test.run(): event order, failing test, rejected */
  let actuals = []
  const test = new Test('one', function () {
    actuals.push('body')
    return Promise.reject(new Error('broken'))
  })
  test.on('start', test => actuals.push('start'))
  test.on('fail', test => actuals.push('fail'))
  test.on('end', test => actuals.push('end'))
  test.run()
    .then(() => {
      throw new Error('should not reach here')
    })
    .catch(err => {
      a.strictEqual(err.message, 'broken')
      a.deepStrictEqual(actuals, [ 'start', 'body', 'fail', 'end' ])
    })
    .catch(halt)
}

{ /* test.run(): pass event args */
  let actuals = []
  const test = new Test('one', () => 1)
  test.on('pass', (t, result) => {
    a.strictEqual(t, test)
    a.strictEqual(result, 1)
  })
  test.run()
    .catch(halt)
}

{ /* test.run(): fail event args */
  let actuals = []
  const test = new Test('one', () => {
    throw new Error('broken')
  })
  test.on('fail', (t, err) => {
    a.strictEqual(t, test)
    a.strictEqual(err.message, 'broken')
  })
  test.run()
    .catch(err => {
      if (err.message !== 'broken') throw err
    })
    .catch(halt)
}

{ /* no test function: ignore, don't start, skip, pass or fail event */
  let actuals = []
  const test = new Test('one')
  test.on('start', test => actuals.push('start'))
  test.on('skip', test => actuals.push('skip'))
  test.on('pass', test => actuals.push('pass'))
  test.on('fail', test => actuals.push('fail'))
  test.on('end', test => actuals.push('end'))
  test.run()
    .then(result => {
      a.strictEqual(result, undefined)
      a.deepStrictEqual(actuals, [])
    })
    .catch(halt)
}

{ /* nested events: root should receive child events */
  const actuals = []
  const tom = new Test()
  const one = tom.test('one', () => 1)
  const two = one.test('two', () => 2)
  tom.on('pass', (test, result) => {
    if (actuals.length === 0) {
      a.strictEqual(test.name, 'one')
      a.strictEqual(result, 1)
      actuals.push(1)
    } else {
      a.strictEqual(test.name, 'two')
      a.strictEqual(result, 2)
      actuals.push(2)
    }
  })
  one.run()
    .then(() => two.run())
    .then(() => a.deepStrictEqual(actuals, [ 1, 2 ]))
    .catch(halt)
}
