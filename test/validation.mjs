import Test from '../index.mjs'
import a from 'assert'
import { halt } from './lib/util.mjs'

{ /* valid test */
  const tom = new Test('one', () => 1)
  a.doesNotThrow(
    () => Test.validate(tom)
  )
}

{ /* invalid test */
  const tom = {}
  a.throws(
    () => Test.validate(tom),
    /valid tom required/i
  )
}

{ /* invalid test 2 */
  a.throws(
    () => Test.validate(),
    /valid tom required/i
  )
}
