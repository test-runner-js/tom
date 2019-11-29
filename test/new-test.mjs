import Test from '../index.mjs'
import Tom from 'test-object-model'
import getAssert from 'isomorphic-assert'

async function start () {
  const tom = new Tom()
  const a = await getAssert()

  tom.test('new Test(): default name, default options', async function () {
    const test = new Test()
    a.ok(test.name)
    a.strictEqual(test.testFn, undefined)
    a.strictEqual(test.timeout, 10000)
  })

  tom.test('new Test(name)', async function () {
    const test = new Test('name')
    a.strictEqual(test.name, 'name')
    a.strictEqual(test.testFn, undefined)
    a.strictEqual(test.timeout, 10000)
  })

  tom.test('new Test(name, testFn, options)', async function () {
    const testFn = function () {}
    const options = { timeout: 1 }
    const test = new Test('one', testFn, options)
    a.strictEqual(test.name, 'one')
    a.strictEqual(test.testFn, testFn)
    a.strictEqual(test.timeout, 1)
  })

  tom.test('new Test(testFn, options): default name and testFn', async function () {
    const testFn = function () {}
    const options = { timeout: 1 }
    const test = new Test(testFn, options)
    a.ok(test.name)
    a.strictEqual(test.testFn, testFn)
    a.strictEqual(test.timeout, 1)
  })

  tom.test('new Test(options): options only', async function () {
    const options = { timeout: 1 }
    const test = new Test(options)
    a.ok(test.name)
    a.strictEqual(test.testFn, undefined)
    a.strictEqual(test.timeout, 1)
  })

  tom.test('new Test(name, options)', async function () {
    const options = { timeout: 1 }
    const test = new Test('one', options)
    a.strictEqual(test.name, 'one')
    a.strictEqual(test.testFn, undefined)
    a.strictEqual(test.timeout, 1)
  })

  return tom
}

export default start()
