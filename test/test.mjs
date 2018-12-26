import Tom from '../index.mjs'
import a from 'assert'

function halt (err) {
  console.log(err)
  process.exitCode = 1
}

{ /* new Test() */
  const root = new Tom('tom')
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

{
  const test = new Tom('passing async test', function () {
    return Promise.resolve(true)
  })
  test.run().then(result => {
    a.ok(result === true)
  })
}

{
  const test = new Tom('failing async test: rejected', function () {
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

{
  const test = new Tom(
    'failing async test: timeout',
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

{
  const test = new Tom(
    'passing async test: timeout 2',
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

{
  let count = 0
  const test = new Tom('test.run()', function () {
    count++
    return true
  })
  test.run()
    .then(result => {
      a.strictEqual(result, true)
      a.strictEqual(count, 1)
    })
    .catch(halt)
}

{ /* test.run(): event order */
  let counts = []
  const test = new Tom('one', function () {
    counts.push('body')
    return true
  })
  a.strictEqual(test.state, 'pending')
  test.on('start', test => counts.push('start'))
  test.on('pass', test => counts.push('pass'))
  test.run()
    .then(result => {
      a.strictEqual(result, true)
      a.strictEqual(counts.length, 3)
      a.deepStrictEqual(counts, [ 'start', 'body', 'pass' ])
    })
    .catch(halt)
}

{ /* no test function: skip event */
  let counts = []
  const test = new Tom('one')
  test.on('start', test => counts.push('start'))
  test.on('skip', test => counts.push('skip'))
  test.run()
    .then(result => {
      a.strictEqual(result, undefined)
      a.deepStrictEqual(counts, [ 'start', 'skip' ])
    })
    .catch(halt)
}

{ /* nested events */
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
      debugger
      two.run()
    })
    .then(() => a.deepStrictEqual(counts, [ 1, 2 ]))
}
