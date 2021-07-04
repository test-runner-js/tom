import Test from '../index.mjs'
import Tom from '@test-runner/tom'
import getAssert from 'isomorphic-assert'

async function start () {
  const tom = new Tom()
  const a = await getAssert()

  tom.test('new Test ({ todo: true })', async function () {
    const actuals = []
    const test = new Test(() => { actuals.push('one') }, { todo: true })
    a.equal(test.options.todo, true)
    await test.run()
    a.deepEqual(actuals, [])
  })

  tom.test('todo event fired', async function () {
    const actuals = []
    const tom = new Test()
    const test = tom.todo('one', () => 1)
    test.on('todo', () => {
      actuals.push('todo')
    })
    await test.run()
    a.deepEqual(actuals, ['todo'])
  })

  tom.test('testFn is not run', async function () {
    const actuals = []
    const tom = new Test()
    const test = tom.todo('one', () => { actuals.push('one') })
    await Promise.all([tom.run(), test.run()])
    a.deepEqual(actuals, [])
  })

  tom.test('no testFn', async function () {
    const actuals = []
    const tom = new Test()
    const test = tom.todo('one')
    test.on('todo', () => {
      actuals.push('todo')
    })
    await Promise.all([tom.run(), test.run()])
    a.deepEqual(actuals, ['todo'])
  })

  return tom
}

export default start()
