import Test from '../index.mjs'
import Tom from '../node_modules/test-object-model/dist/index.mjs'
import assert from 'assert'
const a = assert.strict

const tom = new Tom()

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

export default tom
