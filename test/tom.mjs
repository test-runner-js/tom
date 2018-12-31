import Tom from '../index.mjs'
import a from 'assert'

function halt (err) {
  console.log(err)
  process.exitCode = 1
}

{ /* duplicate test name */
  const tom = new Tom('tom')
  tom.test('one', () => 1)
  a.throws(
    () => tom.test('one', () => 1)
  )
}

{ /* deep duplicate test name */
  const tom = new Tom('tom')
  const child = tom.test('one', () => 1)
  a.throws(
    () => child.test('one', () => 1)
  )
}

{ /* child.skip() */
  const counts = []
  const tom = new Tom()
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
  const tom = new Tom()
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
  const tom = new Tom('tom')
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
  const tom = new Tom('tom')
  const one = tom.only('one', () => 1)
  const two = tom.test('two', () => 2)
  a.ok(!one._skip)
  a.ok(one._only)
  a.ok(two._skip)
  a.ok(!two._only)
}

{ /* deep only with skip */
  const tom = new Tom()
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
