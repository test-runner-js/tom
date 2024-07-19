import Test from '@test-runner/tom'
import { strict as a } from 'assert'
import { setTimeout as sleep } from 'node:timers/promises'

const test = new Map()

test.set('tom.stats: async pass', async function () {
  const tom = new Test('test', async function () {
    await sleep(50)
  })
  await tom.run()
  a.ok(tom.stats.start > 0)
  a.ok(tom.stats.end > tom.stats.start)
  a.ok(tom.stats.duration > 40)
})

test.set('tom.stats: async fail', async function () {
  const tom = new Test('test', async function () {
    await sleep(50)
    throw new Error('broken')
  })
  try {
    await tom.run()
    throw new Error('should not reach here')
  } catch (err) {
    a.ok(/broken/.test(err.cause.message))
  } finally {
    a.ok(tom.stats.start > 0)
    a.ok(tom.stats.end > tom.stats.start)
    a.ok(tom.stats.duration > 40)
  }
})

test.set('tom.stats: sync pass', async function () {
  const tom = new Test('test', function () {
    let str = ''
    for (let i = 0; i < 1000; i++) {
      str += 'kill some time'
    }
  })
  await tom.run()
  a.ok(tom.stats.start > 0)
  a.ok(tom.stats.end > tom.stats.start)
  a.ok(tom.stats.duration > 0)
})

test.set('tom.stats: sync fail', async function () {
  const tom = new Test('test', function () {
    let str = ''
    for (let i = 0; i < 1000; i++) {
      str += 'kill some time'
    }
    throw new Error('broken')
  })
  try {
    await tom.run()
    throw new Error('should not reach here')
  } catch (err) {
    a.ok(/broken/.test(err.cause.message))
  } finally {
    a.ok(tom.stats.start > 0)
    a.ok(tom.stats.end > tom.stats.start)
    a.ok(tom.stats.duration > 0)
  }
})

export { test }
