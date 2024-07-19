import Test from '@test-runner/tom'
import { strict as a } from 'assert'

const test = new Map()

test.set('test.context: name and index', async function () {
  const actuals = []
  const tom = new Test()
  const one = tom.test('one', function () {
    actuals.push(this.index)
    actuals.push(this.name)
  })
  const two = tom.test('two', function () {
    actuals.push(this.index)
    actuals.push(this.name)
  })
  await tom.run()
  await one.run()
  await two.run()
  a.deepEqual(actuals, [1, 'one', 2, 'two'])
})

test.set('test.context: data', async function () {
  const actuals = []
  const one = new Test('one', function () {
    this.data = {
      something: 'one',
      yeah: true
    }
    actuals.push(this.data)
  })
  await one.run()
  a.equal(actuals[0].something, one.context.data.something)
  a.equal(actuals[0].yeah, one.context.data.yeah)
})

export { test }
