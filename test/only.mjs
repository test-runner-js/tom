import Test from '../index.mjs'
import Tom from 'test-object-model'
import getAssert from 'isomorphic-assert'

async function start () {
  const tom = new Tom()
  const a = await getAssert()

  tom.test('new Test ({ only: true })', async function () {
    const actuals = []
    const one = new Test(() => { actuals.push('one') }, { only: true })
    a.ok(one.options.only)
    await one.run()
    a.deepStrictEqual(actuals, ['one'])
  })

  tom.test('.only()', async function () {
    const tom = new Test('tom')
    const one = tom.test('one', () => 1)
    const two = tom.test('two', () => 2)
    a.ok(!one.disabledByOnly)
    a.ok(!two.disabledByOnly)
    a.ok(!one.options.only)
    a.ok(!two.options.only)
    const three = tom.only('three', () => 3)
    a.ok(one.disabledByOnly)
    a.ok(!one.options.only)
    a.ok(two.disabledByOnly)
    a.ok(!two.options.only)
    a.ok(!three.disabledByOnly)
    a.ok(three.options.only)
    const four = tom.only('four', () => 4)
    a.ok(one.disabledByOnly)
    a.ok(!one.options.only)
    a.ok(two.disabledByOnly)
    a.ok(!two.options.only)
    a.ok(!three.disabledByOnly)
    a.ok(three.options.only)
    a.ok(!four.disabledByOnly)
    a.ok(four.options.only)
  })

  tom.test('.only() first', async function () {
    const tom = new Test('tom')
    const one = tom.only('one', () => 1)
    const two = tom.test('two', () => 2)
    a.ok(!one.disabledByOnly)
    a.ok(one.options.only)
    a.ok(two.disabledByOnly)
    a.ok(!two.options.only)
  })

  tom.test('deep only with skip', async function () {
    const tom = new Test()
    const one = tom.only('one', () => 1)
    const two = one.test('two', () => 2)
    const three = two.skip('three', () => 3)
    a.ok(!one.disabledByOnly)
    a.ok(one.options.only)
    a.ok(two.disabledByOnly)
    a.ok(!two.options.only)
    a.ok(three.disabledByOnly)
    a.ok(!three.options.only)
  })

  return tom
}

export default start()
