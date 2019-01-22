import Test from '../index.mjs'
import a from 'assert'

function halt (err) {
  console.log(err)
  process.exitCode = 1
}

{ /* test.run(): state, passing test */
  let counts = []
  const test = new Test('one', function () {
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
  const test = new Test('one', function () {
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

{ /* no test function: ignore, don't start, skip, pass or fail event */
  const test = new Test('one')
  test.run()
    .then(result => {
      a.strictEqual(result, undefined)
      a.strictEqual(test.state, 'pending')
    })
    .catch(halt)
}
