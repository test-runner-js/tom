import Test from '@test-runner/tom'
import { strict as a } from 'assert'
import { setTimeout as sleep } from 'node:timers/promises'

const test = new Map()
const only = new Map()
const skip = new Map()

test.set('new Test ({ skip: true })', async function () {
  const actuals = []
  const skippedTest = new Test(() => { actuals.push('one') }, { skip: true })
  a.equal(skippedTest.disabledByOnly, false)
  await skippedTest.run()
  a.deepEqual(actuals, [])
})

test.set('tom.skip(): event args', async function () {
  const actuals = []
  const tom = new Test()
  const skippedTest = tom.skip('one', () => 1)
  skippedTest.addEventListener('skipped', e => {
    const { target, data } = e.detail
    a.equal(target, skippedTest)
    a.equal(data, undefined)
    actuals.push('skipped')
  })
  await skippedTest.run()
  await sleep(1)
  a.deepEqual(actuals, ['skipped'])
})

/*
TODO: continue to support Obso's "catch-all events" handler?
SEE: https://github.com/75lb/obso?tab=readme-ov-file#emitteroneventname-handler-options
 */
skip.set('tom.skip(): only emit "skipped"', async function () {
  const actuals = []
  const tom = new Test()
  const skippedTest = tom.skip('one', () => 1)
  tom.addEventListener(function (eventName) { actuals.push(eventName) })
  await skippedTest.run()
  await sleep(1)
  a.deepEqual(actuals, ['state', 'skipped'])
})

test.set('tom.skip(): testFn is not run', async function () {
  const actuals = []
  const tom = new Test()
  const skippedTest = tom.skip('one', () => { actuals.push('one') })
  await Promise.all([tom.run(), skippedTest.run()])
  await sleep(1)
  a.deepEqual(actuals, [])
})

skip.set('tom.skip(): multiple', async function () {
  const actuals = []
  const tom = new Test()
  const one = tom.skip('one', () => 1)
  const two = tom.skip('two', () => 2)
  tom.addEventListener(function (eventName) { actuals.push(eventName) })
  await Promise.all([tom.run(), one.run(), two.run()])
  await sleep(1)
  a.deepEqual(actuals, [
    'state',
    'ignored',
    'state',
    'skipped',
    'state',
    'skipped'
  ])
})

test.set('skippedTest.run(): skip event args', async function () {
  const actuals = []
  const tom = new Test()
  const test = tom.skip('one', () => 1)
  test.addEventListener('skipped', e => {
    const { target, data } = e.detail
    a.equal(target, test)
    a.equal(data, undefined)
    actuals.push('skipped')
  })
  await test.run()
  await sleep(1)
  a.deepEqual(actuals, ['skipped'])
})

export { test, only }
