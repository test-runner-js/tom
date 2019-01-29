import Test from '../index.mjs'
import a from 'assert'
import { halt } from './lib/util.mjs'

{ /* test.run(): event order, passing test */
  let counts = []
  const test = new Test('one', function () {
    counts.push('body')
    return true
  })
  test.on('start', test => counts.push('start'))
  test.on('pass', test => counts.push('pass'))
  test.on('end', test => counts.push('end'))
  test.run()
    .then(result => {
      a.strictEqual(result, true)
      a.deepStrictEqual(counts, [ 'start', 'body', 'pass', 'end' ])
    })
    .catch(halt)
}

{ /* test.run(): event order, failing test */
  let counts = []
  const test = new Test('one', function () {
    counts.push('body')
    throw new Error('broken')
  })
  test.on('start', test => counts.push('start'))
  test.on('fail', test => counts.push('fail'))
  test.on('end', test => counts.push('end'))
  test.run()
    .then(() => {
      throw new Error('should not reach here')
    })
    .catch(err => {
      a.strictEqual(err.message, 'broken')
      a.deepStrictEqual(counts, [ 'start', 'body', 'fail', 'end' ])
    })
    .catch(halt)
}

{ /* test.run(): event order, failing test, rejected */
  let counts = []
  const test = new Test('one', function () {
    counts.push('body')
    return Promise.reject(new Error('broken'))
  })
  test.on('start', test => counts.push('start'))
  test.on('fail', test => counts.push('fail'))
  test.on('end', test => counts.push('end'))
  test.run()
    .then(() => {
      throw new Error('should not reach here')
    })
    .catch(err => {
      a.strictEqual(err.message, 'broken')
      a.deepStrictEqual(counts, [ 'start', 'body', 'fail', 'end' ])
    })
    .catch(halt)
}

{ /* test.run(): pass event args */
  let counts = []
  const test = new Test('one', () => 1)
  test.on('pass', (t, result) => {
    a.strictEqual(t, test)
    a.strictEqual(result, 1)
  })
  test.run()
    .catch(halt)
}

{ /* test.run(): skip event args */
  let counts = []
  const tom = new Test()
  const test = tom.skip('one', () => 1)
  test.on('skip', (t, result) => {
    a.strictEqual(t, test)
    a.strictEqual(result, undefined)
  })
  test.run()
    .catch(halt)
}

{ /* test.run(): fail event args */
  let counts = []
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
  let counts = []
  const test = new Test('one')
  test.on('start', test => counts.push('start'))
  test.on('skip', test => counts.push('skip'))
  test.on('pass', test => counts.push('pass'))
  test.on('fail', test => counts.push('fail'))
  test.on('end', test => counts.push('end'))
  test.run()
    .then(result => {
      a.strictEqual(result, undefined)
      a.deepStrictEqual(counts, [])
    })
    .catch(halt)
}

{ /* nested events: root should receive child events */
  const counts = []
  const tom = new Test()
  const one = tom.test('one', () => 1)
  const two = one.test('two', () => 2)
  tom.on('pass', (test, result) => {
    if (counts.length === 0) {
      a.strictEqual(test.name, 'one')
      a.strictEqual(result, 1)
      counts.push(1)
    } else {
      a.strictEqual(test.name, 'two')
      a.strictEqual(result, 2)
      counts.push(2)
    }
  })
  one.run()
    .then(() => {
      two.run()
    })
    .then(() => a.deepStrictEqual(counts, [ 1, 2 ]))
}
