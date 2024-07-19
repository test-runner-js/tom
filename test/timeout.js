import Test from '@test-runner/tom'
import { strict as a } from 'assert'
import { setTimeout as sleep } from 'node:timers/promises'

const test = new Map()

test.set('failing async test: timeout', async function () {
  const test = new Test(
    async () => sleep(300),
    { timeout: 150 }
  )
  return Promise.all([
    test.run()
      .then(() => a.ok(false, 'should not reach here'))
      .catch(err => {
        a.ok(/Timeout expired/.test(err.cause.message))
        a.equal(test.state, 'fail')
      }),
    sleep(350).then(() => {
      a.equal(test.state, 'fail')
    })
  ])
})

test.set('passing async test: timeout 2', async function () {
  const test = new Test(
    async () => sleep(300, 'ok'),
    { timeout: 350 }
  )
  return Promise.all([
    test.run().then(result => {
      a.equal(result, 'ok')
      a.equal(test.state, 'pass')
    }),
    sleep(400).then(() => {
      a.equal(test.state, 'pass')
    })
  ])
})

export { test }
