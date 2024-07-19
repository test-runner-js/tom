import Test from '@test-runner/tom'
import { strict as a } from 'assert'

const test = new Map()

test.set('test', async function () {
  const test = new Test(function () {})
  a.equal(test.type, 'test')
})

test.set('test 2', async function () {
  const test = new Test('one', function () {}, { timeout: 100 })
  a.equal(test.type, 'test')
})

test.set('implied todo', async function () {
  const test = new Test()
  a.equal(test.type, 'todo')
})

test.set('implied todo 2', async function () {
  const test = new Test({ timeout: 100 })
  a.equal(test.type, 'todo')
})

test.set('implied todo 3', async function () {
  const test = new Test('one', { timeout: 100 })
  a.equal(test.type, 'todo')
})

test.set('explicit todo', async function () {
  const tom = new Test('one', { timeout: 100 })
  const one = tom.todo()
  a.equal(tom.type, 'group')
  a.equal(one.type, 'todo')
})

test.set('implied group', async function () {
  const tom = new Test()
  tom.test(function () {})
  a.equal(tom.type, 'group')
})

test.set('implied group 2', async function () {
  const tom = new Test({ timeout: 100 })
  tom.test(function () {})
  a.equal(tom.type, 'group')
})

test.set('implied group 3', async function () {
  const tom = new Test('one', { timeout: 100 })
  tom.test(function () {})
  a.equal(tom.type, 'group')
})

test.set('explicit group', async function () {
  const tom = new Test('one', { timeout: 100 })
  const one = tom.group()
  a.equal(tom.type, 'group')
  a.equal(one.type, 'group')
})

export { test }
