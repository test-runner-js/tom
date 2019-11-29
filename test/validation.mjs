import Test from '../index.mjs'
import Tom from 'test-object-model'
import getAssert from 'isomorphic-assert'

async function start () {
  const tom = new Tom()
  const a = await getAssert()

  tom.test('valid test', async function () {
    const tom = new Test('one', () => 1)
    a.doesNotThrow(
      () => Test.validate(tom)
    )
  })

  tom.test('invalid test', async function () {
    const tom = {}
    a.throws(
      () => Test.validate(tom),
      /valid tom required/i
    )
  })

  tom.test('invalid test 2', async function () {
    a.throws(
      () => Test.validate(),
      /valid tom required/i
    )
  })

  return tom
}

export default start()
