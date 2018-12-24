import Tom from '../index.mjs'
import a from 'assert'

function halt (err) {
  console.log(err)
  process.exitCode = 1
}

{ /* test.tree() */
  const root = new Tom('tom')
  root.add(new Tom('one', () => true))
  const child = root.add(new Tom('two', () => true))
  child.add(new Tom('three', () => true))
  console.log(root.tree())
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

{ /* .skip() */
  const counts = []
  const tom = new Tom('tom')
  tom.on('start', () => counts.push('start'))
  tom.on('skip', () => counts.push('skip'))
  tom.run()
    .then(result => {
      a.strictEqual(result, undefined)
      a.deepStrictEqual(counts, [ 'start', 'skip' ])
    })
    .catch(halt)
}

{ /* child.skip() */
  const counts = []
  const tom = new Tom('tom')
  const child = tom.skip('one', () => 1)
  a.strictEqual(tom.children.length, 1)
  a.strictEqual(tom.children[0].name, 'one')
  tom.on('start', () => counts.push('start'))
  tom.on('skip', () => counts.push('skip'))
  child.run()
    .then(result => {
      a.strictEqual(result, undefined)
      a.deepStrictEqual(counts, [ 'start', 'skip' ])
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
  a.ok(tom.children[1]._skip)
  a.ok(!tom.children[2]._skip)
  a.ok(!tom.children[0]._only)
  a.ok(!tom.children[1]._only)
  a.ok(tom.children[2]._only)
}
