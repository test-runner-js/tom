import Test from '../index.mjs'
import a from 'assert'
import { halt } from './lib/util.mjs'

{ /* passing sync test */
  const test = new Test('tom', () => true)
  test.run()
    .then(result => {
      a.strictEqual(result, true)
      a.strictEqual(test.result, result)
    })
    .catch(halt)
}

{ /* failing sync test */
  const test = new Test('tom', function () {
    throw new Error('failed')
  })
  test.run()
    .then(() => {
      a.ok(false, "shouldn't reach here")
    })
    .catch(err => {
      a.ok(/failed/.test(err.message))
      a.strictEqual(test.result, undefined)
    })
    .catch(halt)
}

{ /* passing async test */
  const test = new Test('tom', async () => true)
  test.run()
    .then(result => {
      a.strictEqual(result, true)
      a.strictEqual(test.result, result)
    })
    .catch(halt)
}

{ /* failing async test: rejected */
  const test = new Test('tom', async function () {
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

{ /* no test function: ignore, don't start, skip, pass or fail event */
  const test = new Test('one')
  test.run()
    .then(result => {
      a.strictEqual(result, undefined)
      a.strictEqual(test.ended, false)
      a.strictEqual(test.state, 'ignored')
      a.strictEqual(test.result, result)
    })
    .catch(halt)
}
