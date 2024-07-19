import Test from '@test-runner/tom'
import { strict as a } from 'assert'
import { setTimeout as sleep } from 'node:timers/promises'

const test = new Map()
const only = new Map()
const skip = new Map()

test.set('test.run(): event order, passing test', async function () {
  const actuals = []
  const test = new Test('one', () => actuals.push('body'))
  test.addEventListener('in-progress', test => actuals.push('start'))
  test.addEventListener('pass', test => actuals.push('pass'))
  test.addEventListener('end', test => actuals.push('end'))
  await test.run()
  await sleep(1)
  a.deepEqual(actuals, ['start', 'body', 'pass', 'end'])
})

test.set('test.run(): event order, failing test', async function () {
  const actuals = []
  const test = new Test('one', function () {
    actuals.push('body')
    throw new Error('broken')
  })
  test.addEventListener('in-progress', test => actuals.push('start'))
  test.addEventListener('fail', test => actuals.push('fail'))
  test.addEventListener('end', test => actuals.push('end'))
  try {
    await test.run()
  } catch (err) {
    a.equal(err.cause.message, 'broken')
  } finally {
    await sleep(1)
    a.deepEqual(actuals, ['start', 'body', 'fail', 'end'])
  }
})

test.set('test.run(): event order, failing test, rejected', async function () {
  const actuals = []
  const test = new Test('one', function () {
    actuals.push('body')
    return Promise.reject(new Error('broken'))
  })
  test.addEventListener('in-progress', test => actuals.push('start'))
  test.addEventListener('fail', test => actuals.push('fail'))
  test.addEventListener('end', test => actuals.push('end'))
  try {
    await test.run()
  } catch (err) {
    a.equal(err.cause.message, 'broken')
  } finally {
    await sleep(1)
    a.deepEqual(actuals, ['start', 'body', 'fail', 'end'])
  }
})

test.set('test.run(): pass event args, sync', async function () {
  const actuals = []
  const test = new Test('one', () => 1)
  test.addEventListener('pass', e => {
    const { target, data } = e.detail
    a.equal(target, test)
    a.equal(data, 1)
    actuals.push('pass')
  })
  await test.run()
  await sleep(1)
  a.deepEqual(actuals, ['pass'])
})

test.set('test.run(): pass event args, async', async function () {
  const actuals = []
  const test = new Test('one', async () => 1)
  test.addEventListener('pass', e => {
    const { target, data } = e.detail
    a.equal(target, test)
    a.equal(data, 1)
    actuals.push('pass')
  })
  await test.run()
  await sleep(1)
  a.deepEqual(actuals, ['pass'])
})

test.set('test.run(): fail event args', async function () {
  const actuals = []
  const test = new Test('one', function () {
    throw new Error('broken')
  })
  test.addEventListener('fail', e => {
    const { target, data } = e.detail
    a.equal(target, test)
    a.equal(data.cause.message, 'broken')
    actuals.push('fail')
  })
  try {
    await test.run()
  } catch (err) {
    a.equal(err.cause.message, 'broken')
  } finally {
    await sleep(1)
    a.deepEqual(actuals, ['fail'])
  }
})

test.set("no test function: ignore, don't start, skip, pass or fail event", async function () {
  const actuals = []
  const test = new Test('one')
  test.addEventListener('in-progress', test => actuals.push('start'))
  test.addEventListener('skip', test => actuals.push('skip'))
  test.addEventListener('pass', test => actuals.push('pass'))
  test.addEventListener('fail', test => actuals.push('fail'))
  test.addEventListener('end', test => actuals.push('end'))
  const result = await test.run()
  await sleep(1)
  a.equal(result, undefined)
  a.deepEqual(actuals, [])
})

/*
EventTarget doesn't propagate up like Obso did..
https://nodejs.org/docs/latest/api/events.html#nodejs-eventtarget-vs-dom-eventtarget
*/
skip.set('nested events: root should receive child events', async function () {
  const actuals = []
  const tom = new Test()
  const one = tom.test('one', () => 1)
  const two = one.test('two', () => 2)
  tom.addEventListener('pass', e => {
    const { target, data } = e.detail
    if (actuals.length === 0) {
      a.equal(target.name, 'one')
      a.equal(data, 1)
      actuals.push(1)
    } else {
      a.equal(target.name, 'two')
      a.equal(data, 2)
      actuals.push(2)
    }
  })
  await one.run()
  await two.run()
  await sleep(1)
  a.deepEqual(actuals, [1, 2])
})

export { test, only, skip }
