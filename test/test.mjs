import Tom from '../index.mjs'
import a from 'assert'

function halt (err) {
  console.log(err)
  process.exitCode = 1
}

{ /* new Test() */
  const tom = new Tom('tom')
  a.strictEqual(tom.name, 'tom')
}

{ /* new Test(): has a default name */
  const tom = new Tom()
  a.ok(tom.name)
}

{ /* new Test(): default name and testFn */
  const testFn = function () {}
  const options = { timeout: 1 }
  const tom = new Tom(testFn, options)
  a.ok(tom.name)
  a.strictEqual(tom.testFn, testFn)
  a.strictEqual(tom.options.timeout, 1)
}

{ /* passing sync test */
  const test = new Tom('tom', () => true)
  test.run()
    .then(result => {
      a.ok(result === true)
    })
    .catch(halt)
}

{ /* failing sync test */
  const test = new Tom('tom', function () {
    throw new Error('failed')
  })
  test.run()
    .then(() => {
      a.ok(false, "shouldn't reach here")
    })
    .catch(err => {
      a.ok(/failed/.test(err.message))
    })
    .catch(halt)
}

{ /* passing async test */
  const test = new Tom('tom', function () {
    return Promise.resolve(true)
  })
  test.run().then(result => {
    a.ok(result === true)
  })
}

{ /* failing async test: rejected */
  const test = new Tom('tom', function () {
    return Promise.reject(new Error('failed'))
  })
  test.run()
    .then(() => {
      a.ok(false, "shouldn't reach here")
    })
    .catch(err => {
      a.ok(/failed/.test(err.message))
    })
    .catch(halt)
}

{ /* failing async test: timeout */
  const test = new Tom(
    'tom',
    function () {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 300)
      })
    },
    { timeout: 150 }
  )
  test.run()
    .then(() => a.ok(false, 'should not reach here'))
    .catch(err => {
      a.ok(/Timeout expired/.test(err.message))
    })
    .catch(halt)
}

{ /* passing async test: timeout 2 */
  const test = new Tom(
    'tom',
    function () {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve('ok'), 300)
      })
    },
    { timeout: 350 }
  )
  test.run()
    .then(result => {
      a.ok(result === 'ok')
    })
    .catch(halt)
}

{ /* test.run(): state, passing test */
  let counts = []
  const test = new Tom('one', function () {
    counts.push('start')
    return true
  })
  counts.push('pending')
  test.run()
    .then(result => {
      counts.push('pass')
      a.deepStrictEqual(counts, [ 'pending', 'start', 'pass' ])
    })
    .catch(halt)
}

{ /* test.run(): state, failing test */
  let counts = []
  const test = new Tom('one', function () {
    counts.push('start')
    throw new Error('broken')
  })
  counts.push('pending')
  test.run()
    .then(() => {
      throw new Error('should not reach here')
    })
    .catch(err => {
      counts.push('fail')
      a.deepStrictEqual(counts, [ 'pending', 'start', 'fail' ])
    })
    .catch(halt)
}

{ /* test.run(): event order, passing test */
  let counts = []
  const test = new Tom('one', function () {
    counts.push('body')
    return true
  })
  test.on('start', test => counts.push('start'))
  test.on('pass', test => counts.push('pass'))
  test.run()
    .then(result => {
      a.strictEqual(result, true)
      a.deepStrictEqual(counts, [ 'start', 'body', 'pass' ])
    })
    .catch(halt)
}

{ /* test.run(): event order, failing test */
  let counts = []
  const test = new Tom('one', function () {
    counts.push('body')
    throw new Error('broken')
  })
  test.on('start', test => counts.push('start'))
  test.on('fail', test => counts.push('fail'))
  test.run()
    .then(() => {
      throw new Error('should not reach here')
    })
    .catch(err => {
      a.strictEqual(err.message, 'broken')
      a.deepStrictEqual(counts, [ 'start', 'body', 'fail' ])
    })
    .catch(halt)
}

{ /* no test function: ignore, don't start, skip, pass or fail event */
  let counts = []
  const test = new Tom('one')
  test.on('start', test => counts.push('start'))
  test.on('skip', test => counts.push('skip'))
  test.on('pass', test => counts.push('pass'))
  test.on('fail', test => counts.push('fail'))
  test.run()
    .then(result => {
      a.strictEqual(result, undefined)
      a.strictEqual(test.state, 'pending')
      a.deepStrictEqual(counts, [])
    })
    .catch(halt)
}

{ /* nested events: root should receive child events */
  const counts = []
  const tom = new Tom()
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
