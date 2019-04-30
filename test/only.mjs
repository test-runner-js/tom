import Test from '../index.mjs'
import a from 'assert'
import { halt } from './lib/util.mjs'

{ /* new Test ({ only: true }) */
  const actuals = []
  const one = new Test(() => { actuals.push('one' ) }, { only: true })
  a.strictEqual(one.markedOnly, true)
  one.run()
    .then(() => {
      a.deepStrictEqual(actuals, [ 'one' ])
    })
    .catch(halt)
}

{ /* .only() */
  const actuals = []
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
}

{ /* .only() first */
  const actuals = []
  const tom = new Test('tom')
  const one = tom.only('one', () => 1)
  const two = tom.test('two', () => 2)
  a.strictEqual(one.markedSkip, false)
  a.strictEqual(one.markedOnly, true)
  a.strictEqual(two.markedSkip, true)
  a.strictEqual(two.markedOnly, false)
}

{ /* deep only with skip */
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
}
