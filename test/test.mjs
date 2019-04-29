import Test from '../index.mjs'
import a from 'assert'
import { halt } from './lib/util.mjs'

{ /* bug in test function */
  const test = new Test('one', function () {
    asdf()
  })

  test.run()
    .then(() => {
      throw new Error('should not reach here')
    })
    .catch(err => {
      a.strictEqual(test.state, 'fail')
      a.ok(/asdf is not defined/.test(err.message))
    })
    .catch(halt)
}
