import Test from '../index.mjs'
import sleep from 'sleep-anywhere/index.mjs'
import Tom from 'test-object-model'
import getAssert from 'isomorphic-assert'

async function start () {
  const tom = new Tom()
  const a = await getAssert()

  tom.test('duplicate test name', async function () {
    const tom = new Test()
    tom.test('one', () => 1)
    a.throws(
      () => tom.test('one', () => 1),
      /Duplicate name/
    )
  })

  tom.test('deep duplicate test name', async function () {
    const tom = new Test('tom')
    const child = tom.test('one', () => 1)
    a.throws(
      () => child.test('one', () => 1),
      /duplicate/i
    )
  })

  tom.test('.test() not chainable', async function () {
    const tom = new Test()
    const result = tom.test('one', () => 1)
    a.notStrictEqual(result, tom)
  })

  tom.test('bug in test function', async function () {
    const test = new Test('one', function () {
      asdf()
    })

    try {
      await test.run()
      throw new Error('should not reach here')
    } catch (err) {
      a.strictEqual(test.state, 'fail')
      a.ok(/asdf is not defined/.test(err.message))
    }
  })

  tom.test('tom.toString()', async function () {
    const tom = new Test('test name')
    const result = `toString: ${tom}`
    a.equal(result, 'toString: test name')
  })

  return tom
}

export default start()
