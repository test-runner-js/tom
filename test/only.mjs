import Test from '../index.mjs'
import Tom from 'test-object-model'
import getAssert from 'isomorphic-assert'

async function start () {
  const tom = new Tom()
  const a = await getAssert()

  tom.test('new Test ({ only: true })', async function () {
    const actuals = []
    const one = new Test(() => { actuals.push('one') }, { only: true })
    a.strictEqual(one.markedOnly, true)
    await one.run()
    a.deepStrictEqual(actuals, ['one'])
  })

  tom.test('.only()', async function () {
    const tom = new Test('tom')
    const one = tom.test('one', () => 1)
    const two = tom.test('two', () => 2)
    a.strictEqual(one.markedSkip, false)
    a.strictEqual(two.markedSkip, false)
    a.strictEqual(one.markedOnly, false)
    a.strictEqual(two.markedOnly, false)
    const three = tom.only('three', () => 3)
    a.strictEqual(one.markedSkip, true)
    a.strictEqual(one.markedOnly, false)
    a.strictEqual(two.markedSkip, true)
    a.strictEqual(two.markedOnly, false)
    a.strictEqual(three.markedSkip, false)
    a.strictEqual(three.markedOnly, true)
    const four = tom.only('four', () => 4)
    a.strictEqual(one.markedSkip, true)
    a.strictEqual(one.markedOnly, false)
    a.strictEqual(two.markedSkip, true)
    a.strictEqual(two.markedOnly, false)
    a.strictEqual(three.markedSkip, false)
    a.strictEqual(three.markedOnly, true)
    a.strictEqual(four.markedSkip, false)
    a.strictEqual(four.markedOnly, true)
  })

  tom.test('.only() first', async function () {
    const tom = new Test('tom')
    const one = tom.only('one', () => 1)
    const two = tom.test('two', () => 2)
    a.strictEqual(one.markedSkip, false)
    a.strictEqual(one.markedOnly, true)
    a.strictEqual(two.markedSkip, true)
    a.strictEqual(two.markedOnly, false)
  })

  tom.test('deep only with skip', async function () {
    const tom = new Test()
    const one = tom.only('one', () => 1)
    const two = one.test('two', () => 2)
    const three = two.skip('three', () => 3)
    a.strictEqual(one.markedSkip, false)
    a.strictEqual(one.markedOnly, true)
    a.strictEqual(two.markedSkip, true)
    a.strictEqual(two.markedOnly, false)
    a.strictEqual(three.markedSkip, true)
    a.strictEqual(three.markedOnly, false)
  })

  return tom
}

export default start()
