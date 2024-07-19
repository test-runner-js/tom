import Test from '@test-runner/tom'
import { strict as a } from 'assert'

const test = new Map()

test.set('new Test ({ only: true })', async function () {
  const actuals = []
  const one = new Test(() => { actuals.push('one') }, { only: true })
  a.ok(one.options.only)
  await one.run()
  a.deepStrictEqual(actuals, ['one'])
})

test.set('.only()', async function () {
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

test.set('.only() first', async function () {
  const tom = new Test('tom')
  const one = tom.only('one', () => 1)
  const two = tom.test('two', () => 2)
  a.ok(!one.disabledByOnly)
  a.ok(one.options.only)
  a.ok(two.disabledByOnly)
  a.ok(!two.options.only)
})

test.set('deep only with skip', async function () {
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

export { test }

