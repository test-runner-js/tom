'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var StateMachine = _interopDefault(require('fsm-base'));
var a = _interopDefault(require('assert'));

function raceTimeout (ms, msg) {
  return new Promise((resolve, reject) => {
    const interval = setTimeout(() => {
      const err = new Error(msg || `Timeout expired [${ms}]`);
      reject(err);
    }, ms);
    if (interval.unref) interval.unref();
  })
}

/**
 * Creates a mixin for use in a class extends expression.
 * @module create-mixin
 */

/**
 * @alias module:create-mixin
 * @param {class} Src - The class containing the behaviour you wish to mix into another class.
 * @returns {function}
 */
function createMixin (Src) {
  return function (Base) {
    class Mixed extends Base {}
    for (const propName of Object.getOwnPropertyNames(Src.prototype)) {
      if (propName === 'constructor') continue
      Object.defineProperty(Mixed.prototype, propName, Object.getOwnPropertyDescriptor(Src.prototype, propName));
    }
    if (Src.prototype[Symbol.iterator]) {
      Object.defineProperty(Mixed.prototype, Symbol.iterator, Object.getOwnPropertyDescriptor(Src.prototype, Symbol.iterator));
    }
    return Mixed
  }
}

/**
 * @module composite-class
 */

const _children = new WeakMap();
const _parent = new WeakMap();

/**
 * A base class for building standard composite structures. Can also be mixed in.
 * @alias module:composite-class
 */
class Composite {
  /**
   * Children
   * @type {Array}
   */
  get children () {
    if (_children.has(this)) {
      return _children.get(this)
    } else {
      _children.set(this, []);
      return _children.get(this)
    }
  }

  set children (val) {
    _children.set(this, val);
  }


  /**
   * Parent
   * @type {Composite}
   */
  get parent () {
    return _parent.get(this)
  }
  set parent (val) {
    _parent.set(this, val);
  }

  /**
   * Add a child
   * @returns {Composite}
   */
  add (child) {
    if (!(isComposite(child))) throw new Error('can only add a Composite instance')
    child.parent = this;
    this.children.push(child);
    return child
  }

  /**
   * @param {Composite} child - the child node to append
   * @returns {Composite}
   */
  append (child) {
    if (!(child instanceof Composite)) throw new Error('can only add a Composite instance')
    child.parent = this;
    this.children.push(child);
    return child
  }

  /**
   * @param {Composite} child - the child node to prepend
   * @returns {Composite}
   */
  prepend (child) {
    if (!(child instanceof Composite)) throw new Error('can only add a Composite instance')
    child.parent = this;
    this.children.unshift(child);
    return child
  }

  /**
   * @param {Composite} child - the child node to remove
   * @returns {Composite}
   */
  remove (child) {
    return this.children.splice(this.children.indexOf(child), 1)
  }

  /**
   * depth level in the tree, 0 being root.
   * @returns {number}
   */
  level () {
    let count = 0;
    function countParent (composite) {
      if (composite.parent) {
        count++;
        countParent(composite.parent);
      }
    }
    countParent(this);
    return count
  }

  /**
   * @returns {number}
   */
  getDescendentCount () {
    return Array.from(this).length
  }

  /**
   * prints a tree using the .toString() representation of each node in the tree
   * @returns {string}
   */
  tree () {
    return Array.from(this).reduce((prev, curr) => {
      return prev += `${'  '.repeat(curr.level())}- ${curr}\n`
    }, '')
  }

  /**
   * Returns the root instance of this tree.
   * @returns {Composite}
   */
  root () {
    function getRoot (composite) {
      return composite.parent ? getRoot(composite.parent) : composite
    }
    return getRoot(this)
  }

  /**
   * default iteration strategy
   */
  * [Symbol.iterator] () {
    yield this;
    for (let child of this.children) {
      yield * child;
    }
  }

  /**
   * Used by node's `util.inspect`.
   */
  inspect (depth) {
    const clone = Object.assign({}, this);
    delete clone.parent;
    return clone
  }

  /**
   * Returns an array of ancestors
   * @return {Composite[]}
   */
  parents () {
    const output = [];
    function addParent (node) {
      if (node.parent) {
        output.push(node.parent);
        addParent(node.parent);
      }
    }
    addParent(this);
    return output
  }
}

function isComposite (item) {
  return item && item.children && item.add && item.level && item.root
}

/**
 * Test function class.
 * @param {string} name
 * @param {function} testFn
 * @param {object} [options]
 * @param {number} [options.timeout]
 */
class Test extends createMixin(Composite)(StateMachine) {
  constructor (name, testFn, options) {
    super ([
      { from: undefined, to: 'pending' },
      { from: 'pending', to: 'start' },
      { from: 'start', to: 'pass' },
      { from: 'start', to: 'fail' },
      { from: 'start', to: 'skip' }
    ]);
    this.name = name;
    this.testFn = testFn;
    this.index = 1;
    this.options = Object.assign({ timeout: 10000 }, options);
    this.state = 'pending';
  }

  toString () {
    return `${this.name}: ${this.state}`
  }

  test (name, testFn, options) {
    const test = new this.constructor(name, testFn, options);
    this.add(test);
    test.index = this.children.length;
    return test
  }

  skip (name, testFn, options) {
    const test = this.test(name, testFn, options);
    test.skip = true;
    return test
  }

  only (name, testFn, options) {
    const test = this.test(name, testFn, options);
    test.only = true;
    // this._only.push(test)
    return test
  }

  /**
   * Execute the stored test function.
   * @returns {Promise}
   */
  run () {
    this.state = 'start';
    if (this.testFn) {
      const testFnResult = new Promise((resolve, reject) => {
        try {
          const result = this.testFn.call(new TestContext({
            name: this.name,
            index: this.index
          }));
          this.state = 'pass';
          if (result && result.then) {
            result.then(resolve).catch(reject);
          } else {
            resolve(result);
          }
        } catch (err) {
          this.state = 'fail';
          reject(err);
        }
      });
      return Promise.race([ testFnResult, raceTimeout(this.options.timeout) ])
    } else {
      this.state = 'skip';
      return Promise.resolve()
    }
  }
}

/**
 * The test context, available as `this` within each test function.
 */
class TestContext {
  constructor (context) {
    this.name = context.name;
    this.index = context.index;
  }
}

function halt (err) {
  console.log(err);
  process.exitCode = 1;
}

{
  const test = new Test('passing sync test', () => true);
  test.run()
    .then(result => {
      a.ok(result === true);
    })
    .catch(halt);
}

{
  const test = new Test('failing sync test', function () {
    throw new Error('failed')
  });
  test.run()
    .then(() => {
      a.ok(false, "shouldn't reach here");
    })
    .catch(err => {
      a.ok(/failed/.test(err.message));
    })
    .catch(halt);
}

{
  const test = new Test('passing async test', function () {
    return Promise.resolve(true)
  });
  test.run().then(result => {
    a.ok(result === true);
  });
}

{
  const test = new Test('failing async test: rejected', function () {
    return Promise.reject(new Error('failed'))
  });
  test.run()
    .then(() => {
      a.ok(false, "shouldn't reach here");
    })
    .catch(err => {
      a.ok(/failed/.test(err.message));
    })
    .catch(halt);
}

{
  const test = new Test(
    'failing async test: timeout',
    function () {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 300);
      })
    },
    { timeout: 150 }
  );
  test.run()
    .then(() => a.ok(false, 'should not reach here'))
    .catch(err => {
      a.ok(/Timeout expired/.test(err.message));
    })
    .catch(halt);
}

{
  const test = new Test(
    'passing async test: timeout 2',
    function () {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve('ok'), 300);
      })
    },
    { timeout: 350 }
  );
  test.run()
    .then(result => {
      a.ok(result === 'ok');
    })
    .catch(halt);
}

{
  let count = 0;
  const test = new Test('test.run()', function () {
    count++;
    return true
  });
  test.run()
    .then(result => {
      a.strictEqual(result, true);
      a.strictEqual(count, 1);
    })
    .catch(halt);
}

{
  let counts = [];
  const test = new Test('test.run(): event order', function () {
    counts.push('body');
    return true
  });
  a.strictEqual(test.state, 'pending');
  test.on('start', test => counts.push('start'));
  test.on('pass', test => counts.push('pass'));
  test.run()
    .then(result => {
      a.strictEqual(result, true);
      a.strictEqual(counts.length, 3);
      a.deepStrictEqual(counts, [ 'start', 'body', 'pass' ]);
    })
    .catch(halt);
}

{
  let counts = [];
  const test = new Test('no test function: skip event');
  test.on('start', test => counts.push('start'));
  test.on('skip', test => counts.push('skip'));
  test.run()
    .then(result => {
      a.strictEqual(result, undefined);
      a.deepStrictEqual(counts, [ 'start', 'skip' ]);
    })
    .catch(halt);
}

{
  const tom = new Test();
  tom.test('one', () => 1);
  a.throws(
    () => tom.test('one', () => 1)
  );
}

{
  const root = new Test('new Test()');
}

{
  const root = new Test('test.tree()');
  console.log(root);
  root.add(new Test('one', () => true));
  const child = root.add(new Test('two', () => true));
  child.add(new Test('three', () => true));
  console.log(root.tree());
}
