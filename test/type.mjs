import Test from '../index.mjs'
import Tom from '@test-runner/tom'
import getAssert from 'isomorphic-assert'

async function start () {
  const tom = new Tom()
  const a = await getAssert()

  tom.test('test', async function () {
    const test = new Test(function () {})
    a.equal(test.type, 'test')
  })

  tom.test('test 2', async function () {
    const test = new Test('one', function () {}, { timeout: 100 })
    a.equal(test.type, 'test')
  })

  tom.test('implied todo', async function () {
    const test = new Test()
    a.equal(test.type, 'todo')
  })

  tom.test('implied todo 2', async function () {
    const test = new Test({ timeout: 100 })
    a.equal(test.type, 'todo')
  })

  tom.test('implied todo 3', async function () {
    const test = new Test('one', { timeout: 100 })
    a.equal(test.type, 'todo')
  })

  tom.test('explicit todo', async function () {
    const tom = new Test('one', { timeout: 100 })
    const one = tom.todo()
    a.equal(tom.type, 'group')
    a.equal(one.type, 'todo')
  })

  tom.test('implied group', async function () {
    const tom = new Test()
    tom.test(function () {})
    a.equal(tom.type, 'group')
  })

  tom.test('implied group 2', async function () {
    const tom = new Test({ timeout: 100 })
    tom.test(function () {})
    a.equal(tom.type, 'group')
  })

  tom.test('implied group 3', async function () {
    const tom = new Test('one', { timeout: 100 })
    tom.test(function () {})
    a.equal(tom.type, 'group')
  })

  tom.test('explicit group', async function () {
    const tom = new Test('one', { timeout: 100 })
    const one = tom.group()
    a.equal(tom.type, 'group')
    a.equal(one.type, 'group')
  })

  return tom
}

export default start()
