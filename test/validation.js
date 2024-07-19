import Test from '@test-runner/tom'
import { strict as a } from 'assert'

const test = new Map()

test.set('valid test', async function () {
  const tom = new Test('one', () => 1)
  a.doesNotThrow(
    () => Test.validate(tom)
  )
})

test.set('invalid test', async function () {
  const tom = {}
  a.throws(
    () => Test.validate(tom),
    /valid tom required/i
  )
})

test.set('invalid test 2', async function () {
  a.throws(
    () => Test.validate(),
    /valid tom required/i
  )
})

export { test }
