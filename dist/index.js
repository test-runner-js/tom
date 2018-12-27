(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Test = factory());
}(this, function () { 'use strict';

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
   * @module obso
   */

  /**
   * @alias module:obso
   */
  class Emitter {
    /**
     * Emit an event.
     * @param {string} [eventName] - the event name to emit, omitting the name will catch all events.
     * @param ...args {*} - args to pass to the event handler
     */
    emit (eventName, ...args) {
      if (this._listeners && this._listeners.length > 0) {
        const toRemove = [];

        /* invoke each relevant listener */
        for (const listener of this._listeners) {
          const handlerArgs = args.slice();
          if (listener.eventName === '__ALL__') {
            handlerArgs.unshift(eventName);
          }

          if (listener.eventName === '__ALL__' || listener.eventName === eventName) {
            listener.handler.call(this, ...handlerArgs);

            /* remove once handler */
            if (listener.once) toRemove.push(listener);
          }
        }

        toRemove.forEach(listener => {
          this._listeners.splice(this._listeners.indexOf(listener), 1);
        });
      }

      /* bubble event up */
      if (this.parent) this.parent.emitTarget(eventName, this, ...args);
    }

    emitTarget (eventName, target, ...args) {
      if (this._listeners && this._listeners.length > 0) {
        const toRemove = [];

        /* invoke each relevant listener */
        for (const listener of this._listeners) {
          const handlerArgs = args.slice();
          if (listener.eventName === '__ALL__') {
            handlerArgs.unshift(eventName);
          }

          if (listener.eventName === '__ALL__' || listener.eventName === eventName) {
            listener.handler.call(target, ...handlerArgs);

            /* remove once handler */
            if (listener.once) toRemove.push(listener);
          }
        }

        toRemove.forEach(listener => {
          this._listeners.splice(this._listeners.indexOf(listener), 1);
        });
      }

      /* bubble event up */
      if (this.parent) this.parent.emitTarget(eventName, target || this, ...args);
    }

     /**
      * Register an event listener.
      * @param {string} eventName - the event name to watch
      * @param {function} handler - the event handler
      * @param {object} [options]
      * @param {boolean} [options.once]
      */
    on (eventName, handler, options) {
      createListenersArray(this);
      options = options || {};
      if (arguments.length === 1 && typeof eventName === 'function') {
        handler = eventName;
        eventName = '__ALL__';
      }
      this._listeners.push({ eventName, handler: handler, once: options.once });
    }

    /**
     * Remove an event listener.
     * @param eventName {string} - the event name
     * @param handler {function} - the event handler
     */
    removeEventListener (eventName, handler) {
      if (!this._listeners || this._listeners.length === 0) return
      const index = this._listeners.findIndex(function (listener) {
        return listener.eventName === eventName && listener.handler === handler
      });
      if (index > -1) this._listeners.splice(index, 1);
    }

    /**
     * Once.
     * @param {string} eventName - the event name to watch
     * @param {function} handler - the event handler
     */
    once (eventName, handler) {
      /* TODO: the once option is browser-only */
      this.on(eventName, handler, { once: true });
    }

    /**
     * Propagate.
     * @param {string} eventName - the event name to propagate
     * @param {object} from - the emitter to propagate from
     */
    propagate (eventName, from) {
      from.on(eventName, (...args) => this.emit(eventName, ...args));
    }
  }

  /**
   * Alias for `on`.
   */
  Emitter.prototype.addEventListener = Emitter.prototype.on;

  function createListenersArray (target) {
    if (target._listeners) return
    Object.defineProperty(target, '_listeners', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: []
    });
  }

  /**
   * Takes any input and guarantees an array back.
   *
   * - converts array-like objects (e.g. `arguments`) to a real array
   * - converts `undefined` to an empty array
   * - converts any another other, singular value (including `null`) into an array containing that value
   * - ignores input which is already an array
   *
   * @module array-back
   * @example
   * > const arrayify = require('array-back')
   *
   * > arrayify(undefined)
   * []
   *
   * > arrayify(null)
   * [ null ]
   *
   * > arrayify(0)
   * [ 0 ]
   *
   * > arrayify([ 1, 2 ])
   * [ 1, 2 ]
   *
   * > function f(){ return arrayify(arguments); }
   * > f(1,2,3)
   * [ 1, 2, 3 ]
   */

  function isObject (input) {
    return typeof input === 'object' && input !== null
  }

  function isArrayLike (input) {
    return isObject(input) && typeof input.length === 'number'
  }

  /**
   * @param {*} - the input value to convert to an array
   * @returns {Array}
   * @alias module:array-back
   */
  function arrayify (input) {
    if (Array.isArray(input)) {
      return input
    } else {
      if (input === undefined) {
        return []
      } else if (isArrayLike(input)) {
        return Array.prototype.slice.call(input)
      } else {
        return [ input ]
      }
    }
  }

  /**
   * @module fsm-base
   * @typicalname stateMachine
   */

  const _state = new WeakMap();

  /**
   * @class
   * @alias module:fsm-base
   * @extends {Emitter}
   */
  class StateMachine extends Emitter {
    constructor (validMoves) {
      super();
      this._validMoves = arrayify(validMoves).map(move => {
        if (!Array.isArray(move.from)) move.from = [ move.from ];
        if (!Array.isArray(move.to)) move.to = [ move.to ];
        return move
      });
    }

    /**
     * The current state
     * @type {string} state
     * @throws `INVALID_MOVE` if an invalid move made
     */
    get state () {
      return _state.get(this)
    }

    set state (state) {
      this.setState(state);
    }

    /**
     * Set the current state. The second arg onward will be sent as event args.
     * @param {string} state
     */
    setState (state, ...args) {
      /* nothing to do */
      if (this.state === state) return

      const validTo = this._validMoves.some(move => move.to.indexOf(state) > -1);
      if (!validTo) {
        const msg = `Invalid state: ${state}`;
        const err = new Error(msg);
        err.name = 'INVALID_MOVE';
        throw err
      }

      let moved = false;
      const prevState = this.state;
      this._validMoves.forEach(move => {
        if (move.from.indexOf(this.state) > -1 && move.to.indexOf(state) > -1) {
          _state.set(this, state);
          moved = true;
          /**
           * fired on every state change
           * @event module:fsm-base#state
           * @param state {string} - the new state
           * @param prev {string} - the previous state
           */
          this.emit('state', state, prevState);

          /**
           * fired on every state change
           * @event module:fsm-base#&lt;state value&gt;
           */
          this.emit(state, ...args);
        }
      });
      if (!moved) {
        let froms = this._validMoves
          .filter(move => move.to.indexOf(state) > -1)
          .map(move => move.from.map(from => `'${from}'`))
          .reduce(flatten);
        const msg = `Can only move to '${state}' from ${froms.join(' or ') || '<unspecified>'} (not '${prevState}')`;
        const err = new Error(msg);
        err.name = 'INVALID_MOVE';
        throw err
      }
    }
  }

  function flatten (prev, curr) {
    return prev.concat(curr)
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
      name = name || 'tom';
      if (!name) throw new Error('name required')
      super ([
        { from: undefined, to: 'pending' },
        { from: 'pending', to: 'start' },
        { from: 'start', to: 'pass' },
        { from: 'start', to: 'fail' },
        { from: 'start', to: 'skip' },
        { from: 'start', to: 'pending' },
        { from: 'pass', to: 'pending' },
        { from: 'fail', to: 'pending' },
        { from: 'skip', to: 'pending' },
      ]);
      this.name = name;
      this.testFn = testFn;
      this.options = Object.assign({ timeout: 10000 }, options);
      this.index = 1;
      this.state = 'pending';
      this._skip = null;
      this._only = null;
    }

    toString () {
      return `${this.name}`
    }

    test (name, testFn, options) {
      for (const child of this) {
        if (child.name === name) {
          throw new Error('Duplicate name: ' + name)
        }
      }
      const test = new this.constructor(name, testFn, options);
      this.add(test);
      test.index = this.children.length;
      return test
    }

    skip (name, testFn, options) {
      const test = this.test(name, testFn, options);
      test._skip = true;
      return test
    }

    only (name, testFn, options) {
      for (const test of this) {
        if (!test._only) {
          test._skip = true;
        }
      }
      const test = this.test(name, testFn, options);
      test._only = true;
      return test
    }

    /**
     * Execute the stored test function.
     * @returns {Promise}
     */
    run () {
      this.state = 'start';
      if (!this._skip && this.testFn) {
        const testFnResult = new Promise((resolve, reject) => {
          try {
            const result = this.testFn.call(new TestContext({
              name: this.name,
              index: this.index
            }));

            if (result && result.then) {
              result
                .then(testResult => {
                  this.setState('pass', this, testResult);
                  resolve(testResult);
                })
                .catch(reject);
            } else {
              this.setState('pass', this, result);
              resolve(result);
            }
          } catch (err) {
            this.setState('fail', this, err);
            reject(err);
          }
        });
        return Promise.race([ testFnResult, raceTimeout(this.options.timeout) ])
      } else if (this._skip) {
        this.setState('skip', this);
        return Promise.resolve()
      } else {
        return Promise.resolve()
      }
    }

    reset (deep) {
      if (deep) {
        for (const tom of this) {
          tom.reset();
        }
      } else {
        this.index = 1;
        this.state = 'pending';
        this._skip = null;
        this._only = null;
      }
    }

    static combine (toms, name) {
      if (toms.length > 1) {
        const tom = new this(name);
        for (const subTom of toms) {
          tom.add(subTom);
        }
        return tom
      } else {
        return toms[0]
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

  return Test;

}));
