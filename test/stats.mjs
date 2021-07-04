import Test from '../index.mjs'
import sleep from 'sleep-anywhere/index.mjs'
import Tom from '@test-runner/tom'
import getAssert from 'isomorphic-assert'

async function start () {
  const tom = new Tom()
  const a = await getAssert()

  tom.test('tom.stats: async pass', async function () {
    const tom = new Test('test', async function () {
      await sleep(50)
    })
    await tom.run()
    a.ok(tom.stats.start > 0)
    a.ok(tom.stats.end > tom.stats.start)
    a.ok(tom.stats.duration > 40)
  })

  tom.test('tom.stats: async fail', async function () {
    const tom = new Test('test', async function () {
      await sleep(50)
      throw new Error('broken')
    })
    try {
      await tom.run()
      throw new Error('should not reach here')
    } catch (err) {
      a.ok(/broken/.test(err.message))
    } finally {
      a.ok(tom.stats.start > 0)
      a.ok(tom.stats.end > tom.stats.start)
      a.ok(tom.stats.duration > 40)
    }
  })

  tom.test('tom.stats: sync pass', async function () {
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

  tom.test('tom.stats: sync fail', async function () {
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
      a.ok(/broken/.test(err.message))
    } finally {
      a.ok(tom.stats.start > 0)
      a.ok(tom.stats.end > tom.stats.start)
      a.ok(tom.stats.duration > 0)
    }
  })

  return tom
}

export default start()
