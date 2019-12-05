import Test from '../index.mjs'
import Tom from 'test-object-model'
import getAssert from 'isomorphic-assert'

async function start () {
  const tom = new Tom()
  const a = await getAssert()

  tom.test('new Test ({ skip: true })', async function () {
    const actuals = []
    const skippedTest = new Test(() => { actuals.push('one') }, { skip: true })
    a.equal(skippedTest.disabledByOnly, false)
    await skippedTest.run()
    a.deepEqual(actuals, [])
  })

  tom.test('tom.skip(): event args', async function () {
    const actuals = []
    const tom = new Test()
    const skippedTest = tom.skip('one', () => 1)
    skippedTest.on('skipped', (test, result) => {
      a.equal(test, skippedTest)
      a.equal(result, undefined)
      actuals.push('skipped')
    })
    await skippedTest.run()
    a.deepEqual(actuals, ['skipped'])
  })

  tom.test('tom.skip(): only emit "skipped"', async function () {
    const actuals = []
    const tom = new Test()
    const skippedTest = tom.skip('one', () => 1)
    tom.on(function (eventName) { actuals.push(eventName) })
    await skippedTest.run()
    a.deepEqual(actuals, ['state', 'skipped'])
  })

  tom.test('tom.skip(): testFn is not run', async function () {
    const actuals = []
    const tom = new Test()
    const skippedTest = tom.skip('one', () => { actuals.push('one') })
    await Promise.all([tom.run(), skippedTest.run()])
    a.deepEqual(actuals, [])
  })

  tom.test('tom.skip(): multiple', async function () {
    const actuals = []
    const tom = new Test()
    const one = tom.skip('one', () => 1)
    const two = tom.skip('two', () => 2)
    tom.on(function (eventName) { actuals.push(eventName) })
    await Promise.all([tom.run(), one.run(), two.run()])
    a.deepEqual(actuals, [
      'state',
      'ignored',
      'state',
      'skipped',
      'state',
      'skipped'
    ])
  })

  tom.test('skippedTest.run(): skip event args', async function () {
    const actuals = []
    const tom = new Test()
    const test = tom.skip('one', () => 1)
    test.on('skipped', (t, result) => {
      a.equal(t, test)
      a.equal(result, undefined)
      actuals.push('skipped')
    })
    await test.run()
    a.deepEqual(actuals, ['skipped'])
  })

  return tom
}

export default start()
