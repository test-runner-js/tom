import Test from '../index.mjs'
import Tom from 'test-object-model'
import getAssert from 'isomorphic-assert'
import sleep from 'sleep-anywhere/index.mjs'

async function start () {
  const tom = new Tom()
  const a = await getAssert()

  tom.test('failing async test: timeout', async function () {
    const test = new Test(
      async () => sleep(300),
      { timeout: 150 }
    )
    return Promise.all([
      test.run()
        .then(() => a.ok(false, 'should not reach here'))
        .catch(err => {
          a.ok(/Timeout expired/.test(err.message))
          a.equal(test.state, 'fail')
        }),
      sleep(350).then(() => {
        a.equal(test.state, 'fail')
      })
    ])
  })

  tom.test('passing async test: timeout 2', async function () {
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

  return tom
}

export default start()
