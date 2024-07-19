import Test from '@test-runner/tom'
import { strict as a } from 'assert'
import { setTimeout as sleep } from 'node:timers/promises'

const test = new Map()

test.set('new Test ({ todo: true })', async function () {
  const actuals = []
  const test = new Test(() => { actuals.push('one') }, { todo: true })
  a.equal(test.options.todo, true)
  await test.run()
  a.deepEqual(actuals, [])
})

test.set('todo event fired', async function () {
  const actuals = []
  const tom = new Test()
  const test = tom.todo('one', () => 1)
  test.addEventListener('todo', () => {
    actuals.push('todo')
  })
  await test.run()
  await sleep(1)
  a.deepEqual(actuals, ['todo'])
})

test.set('testFn is not run', async function () {
  const actuals = []
  const tom = new Test()
  const test = tom.todo('one', () => { actuals.push('one') })
  await Promise.all([tom.run(), test.run()])
  a.deepEqual(actuals, [])
})

test.set('no testFn', async function () {
  const actuals = []
  const tom = new Test()
  const test = tom.todo('one')
  test.addEventListener('todo', () => {
    actuals.push('todo')
  })
  await Promise.all([tom.run(), test.run()])
  await sleep(1)
  a.deepEqual(actuals, ['todo'])
})

export { test }
