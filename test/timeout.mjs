import Test from '../index.mjs'
import a from 'assert'
import { halt } from './lib/util.mjs'
import sleep from '../node_modules/sleep-anywhere/index.mjs'

{ /* failing async test: timeout */
  const test = new Test(
    async () => await sleep(300),
    { timeout: 150 }
  )
  test.run()
    .then(() => a.ok(false, 'should not reach here'))
    .catch(err => {
      a.ok(/Timeout expired/.test(err.message))
      a.strictEqual(test.state, 'fail')
    })
    .catch(halt)
  sleep(350)
    .then(() => a.strictEqual(test.state, 'fail'))
    .catch(halt)
}

{ /* passing async test: timeout 2 */
  const test = new Test(
    async () => sleep(300, 'ok'),
    { timeout: 350 }
  )
  test.run()
    .then(result => {
      a.strictEqual(result, 'ok')
      a.strictEqual(test.state, 'pass')
    })
    .catch(halt)
  sleep(400).then(() => a.strictEqual(test.state, 'pass'))
}
