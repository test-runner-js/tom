import Test from '../index.mjs'
import Tom from '@test-runner/tom'
import getAssert from 'isomorphic-assert'

async function start () {
  const tom = new Tom()
  const a = await getAssert()

  tom.test('before option', async function () {
    const test = new Test('one', { before: true })
    a.equal(test.options.before, true)
  })

  tom.test('before method', async function () {
    const test = new Test()
    const one = test.before('one')
    a.equal(one.options.before, true)
  })

  tom.test('after option', async function () {
    const test = new Test('one', { after: true })
    a.equal(test.options.after, true)
  })

  tom.test('after method', async function () {
    const test = new Test()
    const one = test.after('one')
    a.equal(one.options.after, true)
  })

  return tom
}

export default start()
