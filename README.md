[![view on npm](https://img.shields.io/npm/v/test-object-model.svg)](https://www.npmjs.org/package/test-object-model)
[![npm module downloads](https://img.shields.io/npm/dt/test-object-model.svg)](https://www.npmjs.org/package/test-object-model)
[![Build Status](https://travis-ci.org/test-runner-js/test-object-model.svg?branch=master)](https://travis-ci.org/test-runner-js/test-object-model)
[![Dependency Status](https://badgen.net/david/dep/test-runner-js/test-object-model)](https://david-dm.org/test-runner-js/test-object-model)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

# test-object-model

<a name="module_test-object-model"></a>

## test-object-model

* [test-object-model](#module_test-object-model)
    * [Test](#exp_module_test-object-model--Test) ⏏
        * [new Test([name], [testFn], [options])](#new_module_test-object-model--Test_new)
        * _instance_
            * [.name](#module_test-object-model--Test+name) : <code>string</code>
            * [.testFn](#module_test-object-model--Test+testFn) : <code>function</code>
            * [.index](#module_test-object-model--Test+index)
            * [.state](#module_test-object-model--Test+state)
            * [.ended](#module_test-object-model--Test+ended)
            * [.test()](#module_test-object-model--Test+test)
            * [.skip()](#module_test-object-model--Test+skip)
            * [.only()](#module_test-object-model--Test+only)
            * [.run()](#module_test-object-model--Test+run) ⇒ <code>Promise</code>
            * [.reset()](#module_test-object-model--Test+reset)
        * _static_
            * [.combine(tests, [name])](#module_test-object-model--Test.combine) ⇒ <code>Test</code>
        * _inner_
            * [~TestContext](#module_test-object-model--Test..TestContext)

<a name="exp_module_test-object-model--Test"></a>

### Test ⏏
**Kind**: Exported class  
<a name="new_module_test-object-model--Test_new"></a>

#### new Test([name], [testFn], [options])

| Param | Type |
| --- | --- |
| [name] | <code>string</code> | 
| [testFn] | <code>function</code> | 
| [options] | <code>object</code> | 
| [options.timeout] | <code>number</code> | 

<a name="module_test-object-model--Test+name"></a>

#### test.name : <code>string</code>
Test name

**Kind**: instance property of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test+testFn"></a>

#### test.testFn : <code>function</code>
Test function

**Kind**: instance property of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test+index"></a>

#### test.index
Position of this test within its parents children

**Kind**: instance property of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test+state"></a>

#### test.state
Test state: pending, start, skip, pass or fail.

**Kind**: instance property of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test+ended"></a>

#### test.ended
True if ended

**Kind**: instance property of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test+test"></a>

#### test.test()
Add a test.

**Kind**: instance method of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test+skip"></a>

#### test.skip()
Add a skipped test

**Kind**: instance method of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test+only"></a>

#### test.only()
Add an only test

**Kind**: instance method of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test+run"></a>

#### test.run() ⇒ <code>Promise</code>
Execute the stored test function.

**Kind**: instance method of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test+reset"></a>

#### test.reset()
Reset state

**Kind**: instance method of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test.combine"></a>

#### Test.combine(tests, [name]) ⇒ <code>Test</code>
Combine several TOM instances into a common root

**Kind**: static method of [<code>Test</code>](#exp_module_test-object-model--Test)  

| Param | Type |
| --- | --- |
| tests | <code>Array.&lt;Test&gt;</code> | 
| [name] | <code>string</code> | 

<a name="module_test-object-model--Test..TestContext"></a>

#### Test~TestContext
The test context, available as `this` within each test function.

**Kind**: inner class of [<code>Test</code>](#exp_module_test-object-model--Test)  

* * *

&copy; 2018-19 Lloyd Brookes \<75pound@gmail.com\>.