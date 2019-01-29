import Test from '../index.mjs'
import a from 'assert'
import { halt } from './lib/util.mjs'

{ /* duplicate test name */
  const tom = new Test()
  tom.test('one', () => 1)
  a.throws(
    () => test.test('one', () => 1)
  )
}

{ /* deep duplicate test name */
  const tom = new Test('tom')
  const child = tom.test('one', () => 1)
  a.throws(
    () => child.test('one', () => 1),
    /duplicate/i
  )
}

{ /* child.skip() */
  const counts = []
  const tom = new Test()
  const child = tom.skip('one', () => 1)
  tom.on('start', () => counts.push('start'))
  tom.on('skip', () => counts.push('skip'))
  child.run()
    .then(result => {
      a.strictEqual(result, undefined)
      a.deepStrictEqual(counts, [ 'skip' ])
    })
    .catch(halt)
}

{ /* child.skip(): multiple */
  const counts = []
  const tom = new Test()
  const one = tom.skip('one', () => 1)
  const two = tom.skip('two', () => 2)
  tom.on('start', () => counts.push('start'))
  tom.on('skip', () => counts.push('skip'))
  Promise
    .all([ tom.run(), one.run(), two.run() ])
    .then(results => {
      a.deepStrictEqual(results, [ undefined, undefined, undefined ])
      a.deepStrictEqual(counts, [ 'skip', 'skip' ])
    })
    .catch(halt)
}

{ /* .only() */
  const counts = []
  const tom = new Test('tom')
  const one = tom.test('one', () => 1)
  const two = tom.test('two', () => 2)
  a.ok(!one._skip)
  a.ok(!two._skip)
  a.ok(!one._only)
  a.ok(!two._only)
  const three = tom.only('three', () => 3)
  a.ok(one._skip)
  a.ok(!one._only)
  a.ok(two._skip)
  a.ok(!two._only)
  a.ok(!three._skip)
  a.ok(three._only)
  const four = tom.only('four', () => 4)
  a.ok(one._skip)
  a.ok(!one._only)
  a.ok(two._skip)
  a.ok(!two._only)
  a.ok(!three._skip)
  a.ok(three._only)
  a.ok(!four._skip)
  a.ok(four._only)
}

{ /* .only() first */
  const counts = []
  const tom = new Test('tom')
  const one = tom.only('one', () => 1)
  const two = tom.test('two', () => 2)
  a.ok(!one._skip)
  a.ok(one._only)
  a.ok(two._skip)
  a.ok(!two._only)
}

{ /* deep only with skip */
  const tom = new Test()
  const one = tom.only('one', () => 1)
  const two = one.test('two', () => 2)
  const three = two.skip('three', () => 3)
  a.ok(!one._skip)
  a.ok(one._only)
  a.ok(two._skip)
  a.ok(!two._only)
  a.ok(three._skip)
  a.ok(!three._only)
}
