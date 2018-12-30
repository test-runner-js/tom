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
  tom.test('one', () => 1)
  tom.test('two', () => 2)
  a.ok(!tom.children[0]._skip)
  a.ok(!tom.children[1]._skip)
  a.ok(!tom.children[0]._only)
  a.ok(!tom.children[1]._only)
  tom.only('three', () => 3)
  a.ok(tom.children[0]._skip)
  a.ok(!tom.children[0]._only)
  a.ok(tom.children[1]._skip)
  a.ok(!tom.children[1]._only)
  a.ok(!tom.children[2]._skip)
  a.ok(tom.children[2]._only)
  tom.only('four', () => 4)
  a.ok(tom.children[0]._skip)
  a.ok(!tom.children[0]._only)
  a.ok(tom.children[1]._skip)
  a.ok(!tom.children[1]._only)
  a.ok(!tom.children[2]._skip)
  a.ok(tom.children[2]._only)
  a.ok(!tom.children[3]._skip)
  a.ok(tom.children[3]._only)
}
