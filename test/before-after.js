import Test from '@test-runner/tom'
import { strict as a } from 'assert'

const test = new Map()

test.set('before option', async function () {
  const test = new Test('one', { before: true })
  a.equal(test.options.before, true)
})

test.set('before method', async function () {
  const test = new Test()
  const one = test.before('one')
  a.equal(one.options.before, true)
})

test.set('after option', async function () {
  const test = new Test('one', { after: true })
  a.equal(test.options.after, true)
})

test.set('after method', async function () {
  const test = new Test()
  const one = test.after('one')
  a.equal(one.options.after, true)
})

export { test }
