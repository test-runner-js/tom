import Test from '../index.mjs'
import a from 'assert'
import { halt } from './lib/util.mjs'

{ /* test.run(): state, passing test */
  let counts = []
  const test = new Test('one', function () {
    counts.push(test.state)
  })
  counts.push(test.state)
  a.strictEqual(test.ended, false)
  test.run()
    .then(result => {
      counts.push(test.state)
      a.deepStrictEqual(counts, [ 'pending', 'in-progress', 'pass' ])
      a.strictEqual(test.ended, true)
    })
    .catch(halt)
}

{ /* test.run(): state, failing test */
  let counts = []
  const test = new Test('one', function () {
    counts.push(test.state)
    throw new Error('broken')
  })
  counts.push(test.state)
  test.run()
    .then(result => {
      counts.push(test.state)
    })
    .catch(err => {
      counts.push(test.state)
      a.deepStrictEqual(counts, [ 'pending', 'in-progress', 'fail' ])
      a.strictEqual(test.ended, true)
    })
    .catch(halt)
}

{ /* test.run(): state, no test */
  let counts = []
  const test = new Test('one')
  counts.push(test.state)
  test.run()
    .then(result => {
      counts.push(test.state)
      a.deepStrictEqual(counts, [ 'pending', 'ignored' ])
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
