[![view on npm](https://img.shields.io/npm/v/test-object-model.svg)](https://www.npmjs.org/package/test-object-model)
[![npm module downloads](https://img.shields.io/npm/dt/test-object-model.svg)](https://www.npmjs.org/package/test-object-model)
[![Build Status](https://travis-ci.org/test-runner-js/test-object-model.svg?branch=master)](https://travis-ci.org/test-runner-js/test-object-model)
[![Dependency Status](https://badgen.net/david/dep/test-runner-js/test-object-model)](https://david-dm.org/test-runner-js/test-object-model)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

# test-object-model

A test tree - used as input to one of several runners:

* [test-runner](https://github.com/test-runner-js/cli)
* [web-runner](https://github.com/test-runner-js/web-runner)
* [esm-runner](https://github.com/test-runner-js/esm-runner)
* [mc-runner](https://github.com/test-runner-js/mc-runner)

## Synopsis

Create a module which exports one or more tests.

```js
const Tom = require('test-object-model')
const assert = require('assert')

const tom = new Tom()

tom.test('Quick maths', function () {
  const result = 2 + 2 - 1
  assert.strictEqual(result, 3)
})

module.exports = tom
```

## Usage 

Create a simple test.

```js
tom.test('Quick maths', function () {
  // test
})
```

Skip a test.

```js
tom.skip('Quick maths', function () {
  // test
})
```

Skip all but this test.

```js
tom.only('Quick maths', function () {
  // test
})
```

Ignore a test.

```js
tom.skip('Quick maths')
```

Test context.

```js
tom.test('Quick maths', function () {
	const testName = this.name
	const testNumber = this.index
})
```

Pass the TOM as input into a test-runner.

## Documentation

* [API reference](https://github.com/test-runner-js/test-object-model/blob/master/docs/API.md)

* * *

&copy; 2018-19 Lloyd Brookes \<75pound@gmail.com\>.
