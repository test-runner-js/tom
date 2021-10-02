import Test from '../index.js'
import Tom from '@test-runner/tom'
import getAssert from 'isomorphic-assert'

async function start () {
  const tom = new Tom()
  const a = await getAssert()

  tom.test('test.run(): event order, passing test', async function () {
    const actuals = []
    const test = new Test('one', () => actuals.push('body'))
    test.on('in-progress', test => actuals.push('start'))
    test.on('pass', test => actuals.push('pass'))
    test.on('end', test => actuals.push('end'))
    await test.run()
    a.deepEqual(actuals, ['start', 'body', 'pass', 'end'])
  })

  tom.test('test.run(): event order, failing test', async function () {
    const actuals = []
    const test = new Test('one', function () {
      actuals.push('body')
      throw new Error('broken')
    })
    test.on('in-progress', test => actuals.push('start'))
    test.on('fail', test => actuals.push('fail'))
    test.on('end', test => actuals.push('end'))
    try {
      await test.run()
    } catch (err) {
      a.equal(err.message, 'broken')
    } finally {
      a.deepEqual(actuals, ['start', 'body', 'fail', 'end'])
    }
  })

  tom.test('test.run(): event order, failing test, rejected', async function () {
    const actuals = []
    const test = new Test('one', function () {
      actuals.push('body')
      return Promise.reject(new Error('broken'))
    })
    test.on('in-progress', test => actuals.push('start'))
    test.on('fail', test => actuals.push('fail'))
    test.on('end', test => actuals.push('end'))
    try {
      await test.run()
    } catch (err) {
      a.equal(err.message, 'broken')
    } finally {
      a.deepEqual(actuals, ['start', 'body', 'fail', 'end'])
    }
  })

  tom.test('test.run(): pass event args, sync', async function () {
    const actuals = []
    const test = new Test('one', () => 1)
    test.on('pass', (t, result) => {
      a.equal(t, test)
      a.equal(result, 1)
      actuals.push('pass')
    })
    await test.run()
    a.deepEqual(actuals, ['pass'])
  })

  tom.test('test.run(): pass event args, async', async function () {
    const actuals = []
    const test = new Test('one', async () => 1)
    test.on('pass', (t, result) => {
      a.equal(t, test)
      a.equal(result, 1)
      actuals.push('pass')
    })
    await test.run()
    a.deepEqual(actuals, ['pass'])
  })

  tom.test('test.run(): fail event args', async function () {
    const actuals = []
    const test = new Test('one', function () {
      throw new Error('broken')
    })
    test.on('fail', (t, err) => {
      a.equal(t, test)
      a.equal(err.message, 'broken')
      actuals.push('fail')
    })
    try {
      await test.run()
    } catch (err) {
      a.equal(err.message, 'broken')
    } finally {
      a.deepEqual(actuals, ['fail'])
    }
  })

  tom.test("no test function: ignore, don't start, skip, pass or fail event", async function () {
    const actuals = []
    const test = new Test('one')
    test.on('in-progress', test => actuals.push('start'))
    test.on('skip', test => actuals.push('skip'))
    test.on('pass', test => actuals.push('pass'))
    test.on('fail', test => actuals.push('fail'))
    test.on('end', test => actuals.push('end'))
    const result = await test.run()
    a.equal(result, undefined)
    a.deepEqual(actuals, [])
  })

  tom.test('nested events: root should receive child events', async function () {
    const actuals = []
    const tom = new Test()
    const one = tom.test('one', () => 1)
    const two = one.test('two', () => 2)
    tom.on('pass', (test, result) => {
      if (actuals.length === 0) {
        a.equal(test.name, 'one')
        a.equal(result, 1)
        actuals.push(1)
      } else {
        a.equal(test.name, 'two')
        a.equal(result, 2)
        actuals.push(2)
      }
    })
    await one.run()
    await two.run()
    a.deepEqual(actuals, [1, 2])
  })

  return tom
}

export default start()
