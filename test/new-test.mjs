import Test from '../index.mjs'
import Tom from 'test-object-model'
import getAssert from 'isomorphic-assert'

async function start () {
  const tom = new Tom()
  const a = await getAssert()

  tom.test('new Test(): default name, default options', async function () {
    const test = new Test()
    a.ok(test.name)
    a.equal(test.testFn, undefined)
    a.equal(test.options.timeout, 10000)
  })

  tom.test('new Test(name)', async function () {
    const test = new Test('name')
    a.equal(test.name, 'name')
    a.equal(test.testFn, undefined)
    a.equal(test.options.timeout, 10000)
  })

  tom.test('new Test(name, testFn, options)', async function () {
    const testFn = function () {}
    const options = { timeout: 1 }
    const test = new Test('one', testFn, options)
    a.equal(test.name, 'one')
    a.equal(test.testFn, testFn)
    a.equal(test.options.timeout, options.timeout)
  })

  tom.test('new Test(testFn, options): default name and testFn', async function () {
    const testFn = function () {}
    const options = { timeout: 1 }
    const test = new Test(testFn, options)
    a.ok(test.name)
    a.equal(test.testFn, testFn)
    a.equal(test.options.timeout, options.timeout)
  })

  tom.test('new Test(options): options only', async function () {
    const options = { timeout: 1 }
    const test = new Test(options)
    a.ok(test.name)
    a.equal(test.testFn, undefined)
    a.equal(test.options.timeout, options.timeout)
  })

  tom.test('new Test(name, options)', async function () {
    const options = { timeout: 1 }
    const test = new Test('one', options)
    a.equal(test.name, 'one')
    a.equal(test.testFn, undefined)
    a.equal(test.options.timeout, options.timeout)
  })

  tom.test('new Test(undefined, options)', async function () {
    const options = { timeout: 1 }
    const test = new Test(undefined, options)
    a.equal(test.name, 'tom')
    a.equal(test.testFn, undefined)
    a.equal(test.options.timeout, options.timeout)
  })

  return tom
}

export default start()
