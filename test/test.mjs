import Tom from '../index.mjs'
import a from 'assert'

function halt (err) {
  console.log(err)
  process.exitCode = 1
}

{
  const test = new Tom('passing sync test', () => true)
  test.run()
    .then(result => {
      a.ok(result === true)
    })
    .catch(halt)
}

{
  const test = new Tom('failing sync test', function () {
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

{ /* duplicate test name */
  const tom = new Tom('tom')
  tom.test('one', () => 1)
  a.throws(
    () => tom.test('one', () => 1)
  )
}

{ /* deep duplicate test name */
  const tom = new Tom('tom')
  const child = tom.test('one', () => 1)
  a.throws(
    () => child.test('one', () => 1)
  )
}

{ /* mandatory name */
  a.throws(
    () => { const tom = new Tom() }
  )
  a.doesNotThrow(
    () => { const tom = new Tom('something') }
  )
}
