import Test from '../index.mjs'
import a from 'assert'
import { halt } from './lib/util.mjs'

{ /* duplicate test name */
  const tom = new Test()
  tom.test('one', () => 1)
  a.throws(
    () => test.test('one', () => 1)
  )
}

{ /* deep duplicate test name */
  const tom = new Test('tom')
  const child = tom.test('one', () => 1)
  a.throws(
    () => child.test('one', () => 1),
    /duplicate/i
  )
}

{ /* .test() not chainable */
  const tom = new Test()
  const result = tom.test('one', () => 1)
  a.notStrictEqual(result, tom)
}
