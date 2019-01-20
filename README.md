[![view on npm](https://img.shields.io/npm/v/test-object-model.svg)](https://www.npmjs.org/package/test-object-model)
[![npm module downloads](https://img.shields.io/npm/dt/test-object-model.svg)](https://www.npmjs.org/package/test-object-model)
[![Build Status](https://travis-ci.org/test-runner-js/test-object-model.svg?branch=master)](https://travis-ci.org/test-runner-js/test-object-model)
[![Dependency Status](https://badgen.net/david/dep/test-runner-js/test-object-model)](https://david-dm.org/test-runner-js/test-object-model)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

# test-object-model

<a name="module_test-object-model"></a>

## test-object-model

* [test-object-model](#module_test-object-model)
    * [Tom](#exp_module_test-object-model--Tom) ⏏
        * [new Tom([name], [testFn], [options])](#new_module_test-object-model--Tom_new)
        * _instance_
            * [.name](#module_test-object-model--Tom+name) : <code>string</code>
            * [.testFn](#module_test-object-model--Tom+testFn) : <code>function</code>
            * [.index](#module_test-object-model--Tom+index)
            * [.state](#module_test-object-model--Tom+state)
            * [.test()](#module_test-object-model--Tom+test)
            * [.skip()](#module_test-object-model--Tom+skip)
            * [.only()](#module_test-object-model--Tom+only)
            * [.run()](#module_test-object-model--Tom+run) ⇒ <code>Promise</code>
            * [.reset()](#module_test-object-model--Tom+reset)
        * _static_
            * [.combine(toms, [name])](#module_test-object-model--Tom.combine) ⇒ <code>Tom</code>
        * _inner_
            * [~TestContext](#module_test-object-model--Tom..TestContext)

<a name="exp_module_test-object-model--Tom"></a>

### Tom ⏏
**Kind**: Exported class  
<a name="new_module_test-object-model--Tom_new"></a>

#### new Tom([name], [testFn], [options])

| Param | Type |
| --- | --- |
| [name] | <code>string</code> | 
| [testFn] | <code>function</code> | 
| [options] | <code>object</code> | 
| [options.timeout] | <code>number</code> | 

<a name="module_test-object-model--Tom+name"></a>

#### tom.name : <code>string</code>
Test name

**Kind**: instance property of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+testFn"></a>

#### tom.testFn : <code>function</code>
Test function

**Kind**: instance property of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+index"></a>

#### tom.index
Position of this test within its parents children

**Kind**: instance property of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+state"></a>

#### tom.state
Test state: pending, start, skip, pass or fail.

**Kind**: instance property of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+test"></a>

#### tom.test()
Add a test.

**Kind**: instance method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+skip"></a>

#### tom.skip()
Add a skipped test

**Kind**: instance method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+only"></a>

#### tom.only()
Add an only test

**Kind**: instance method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+run"></a>

#### tom.run() ⇒ <code>Promise</code>
Execute the stored test function.

**Kind**: instance method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+reset"></a>

#### tom.reset()
Reset state

**Kind**: instance method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom.combine"></a>

#### Tom.combine(toms, [name]) ⇒ <code>Tom</code>
Combine several TOM instances into a common root

**Kind**: static method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  

| Param | Type |
| --- | --- |
| toms | <code>Array.&lt;Tom&gt;</code> | 
| [name] | <code>string</code> | 

<a name="module_test-object-model--Tom..TestContext"></a>

#### Tom~TestContext
The test context, available as `this` within each test function.

**Kind**: inner class of [<code>Tom</code>](#exp_module_test-object-model--Tom)  

* * *

&copy; 2018-19 Lloyd Brookes \<75pound@gmail.com\>.