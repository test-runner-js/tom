import raceTimeout from './node_modules/race-timeout-anywhere/index.mjs'
import mixin from './node_modules/create-mixin/index.mjs'
import CompositeClass from './node_modules/composite-class/index.mjs'
import StateMachine from './node_modules/fsm-base/index.mjs'

/**
 * @module test-object-model
 */

/**
 * @param {string} [name]
 * @param {function} [testFn]
 * @param {object} [options]
 * @param {number} [options.timeout]
 * @alias module:test-object-model
 */
class Test extends mixin(CompositeClass)(StateMachine) {
  constructor (name, testFn, options) {
    if (typeof name === 'string') {
    } else if (typeof name === 'function') {
      options = testFn
      testFn = name
      name = ''
    } else if (typeof name === 'object') {
      options = name
      testFn = undefined
      name = ''
    }
    options = options || {}
    name = name || 'tom'
    super ([
      { from: undefined, to: 'pending' },
      { from: 'pending', to: 'in-progress' },
      { from: 'pending', to: 'skip' },
      { from: 'in-progress', to: 'pass' },
      { from: 'in-progress', to: 'fail' },
      /* reset */
      { from: 'in-progress', to: 'pending' },
      { from: 'pass', to: 'pending' },
      { from: 'fail', to: 'pending' },
      { from: 'skip', to: 'pending' },
    ])
    /**
     * Test name
     * @type {string}
     */
    this.name = name

    /**
     * Test function
     * @type {function}
     */
    this.testFn = testFn

    /**
     * Position of this test within its parents children
     */
    this.index = 1

    /**
     * Test state: pending, start, skip, pass or fail.
     */
    this.state = 'pending'
    this._markSkip = options._markSkip
    this._skip = null
    this._only = options.only
    this.options = Object.assign({ timeout: 10000 }, options)

    /**
     * True if ended
     */
    this.ended = false
  }

  toString () {
    return `${this.name}`
  }

  /**
   * Add a test.
   */
  test (name, testFn, options) {
    for (const child of this) {
      if (child.name === name) {
        throw new Error('Duplicate name: ' + name)
      }
    }
    const test = new this.constructor(name, testFn, options)
    this.add(test)
    test.index = this.children.length
    this._skipLogic()
    return test
  }

  /**
   * Add a skipped test
   */
  skip (name, testFn, options) {
    options = options || {}
    options._markSkip = true
    const test = this.test(name, testFn, options)
    return test
  }

  /**
   * Add an only test
   */
  only (name, testFn, options) {
    options = options || {}
    options.only = true
    const test = this.test(name, testFn, options)
    return test
  }

  _onlyExists () {
    return Array.from(this.root()).some(t => t._only)
  }

  _skipLogic () {
    if (this._onlyExists()) {
      for (const test of this.root()) {
        if (test._markSkip) {
          test._skip = true
        } else {
          test._skip = !test._only
        }
      }
    } else {
      for (const test of this.root()) {
        test._skip = test._markSkip
      }
    }
  }

  setState (state, target, data) {
    if (state === 'pass' || state === 'fail') {
      this.ended = true
    }
    super.setState(state, target, data)
    if (state === 'pass' || state === 'fail') {
      this.emit('end')
    }
  }

  /**
   * Execute the stored test function.
   * @returns {Promise}
   */
  run () {
    if (this.testFn) {
      if (this._skip) {
        this.setState('skip', this)
        return Promise.resolve()
      } else {
        this.state = 'in-progress'
        this.emit('start')
        const testFnResult = new Promise((resolve, reject) => {
          try {
            const result = this.testFn.call(new TestContext({
              name: this.name,
              index: this.index
            }))

            if (result && result.then) {
              result
                .then(testResult => {
                  this.setState('pass', this, testResult)
                  resolve(testResult)
                })
                .catch(err => {
                  this.setState('fail', this, err)
                  reject(err)
                })
            } else {
              this.setState('pass', this, result)
              resolve(result)
            }
          } catch (err) {
            this.setState('fail', this, err)
            reject(err)
          }
        })
        return Promise.race([ testFnResult, raceTimeout(this.options.timeout) ])
      }
    } else {
      return Promise.resolve()
    }
  }

  /**
   * Reset state
   */
  reset (deep) {
    if (deep) {
      for (const tom of this) {
        tom.reset()
      }
    } else {
      this.index = 1
      this.state = 'pending'
      this._skip = null
      this._only = null
    }
  }

  /**
   * Combine several TOM instances into a common root
   * @param {Array.<Test>} tests
   * @param {string} [name]
   * @return {Test}
   */
  static combine (tests, name) {
    if (tests.length > 1) {
      const test = new this(name)
      for (const subTom of tests) {
        test.add(subTom)
      }
      return test
    } else {
      return tests[0]
    }
  }
}

/**
 * The test context, available as `this` within each test function.
 */
class TestContext {
  constructor (context) {
    this.name = context.name
    this.index = context.index
  }
}

export default Test
