[![view on npm](https://img.shields.io/npm/v/test-object-model.svg)](https://www.npmjs.org/package/test-object-model)
[![npm module downloads](https://img.shields.io/npm/dt/test-object-model.svg)](https://www.npmjs.org/package/test-object-model)
[![Build Status](https://travis-ci.org/test-runner-js/test-object-model.svg?branch=master)](https://travis-ci.org/test-runner-js/test-object-model)
[![Dependency Status](https://badgen.net/david/dep/test-runner-js/test-object-model)](https://david-dm.org/test-runner-js/test-object-model)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

***This documentation is a work in progress***.

# test-object-model

A TestObjectModel (TOM) instance is a tree structure containing a suite of tests. It is supplied as input to one of several runners:

* [test-runner](https://github.com/test-runner-js/cli)
* [web-runner](https://github.com/test-runner-js/web-runner)
* [esm-runner](https://github.com/test-runner-js/esm-runner)
* [mc-runner](https://github.com/test-runner-js/mc-runner)

## Synopsis

Create a TOM instance and add a simple test. For the sake of simplicity, the follow example defines a trivial `assert` function but you can use any assertion library you like.

```js
import Tom from 'test-object-model'
const tom = new Tom('Synopsis')

function assert(ok) {
  if (!ok) {
    throw new Error('Assertion error')
  }
}

tom.test('Quick maths', function () {
  const result = 2 + 2 - 1
  assert(result === 3)
})

export default tom
```

Save the above to file named `test.mjs`. You can now supply this as input to `esm-runner`.

```
$ esm-runner tmp/synopsis.mjs

Start: 1 tests loaded

 ✓ Synopsis Quick maths

Completed in 6ms. Pass: 1, fail: 0, skip: 0.
```

To confirm the code is isomorphic, you can test the same TOM in a headless browser instance (Chromium) using `web-runner`.

```
$ web-runner tmp/synopsis.mjs

Start: 1 tests loaded

 ✓ Synopsis Quick maths

Completed in 16ms. Pass: 1, fail: 0, skip: 0.
```

## Usage basics

Supply a name and test function to `tom.test`. If the function throws or rejects the test is considered a fail.

```js
tom.test('name', function () {
  // test
})
```

Skip a test.

```js
tom.skip('name', function () {
  // test
})
```

Skip all but this and any other tests marked as `only`.

```js
tom.only('name', function () {
  // test
})
```

Ignore a test.

```js
tom.test('name')
```

## Documentation

* [API reference](https://github.com/test-runner-js/test-object-model/blob/master/docs/API.md)

* * *

&copy; 2018-19 Lloyd Brookes \<75pound@gmail.com\>.
