## Modules

<dl>
<dt><a href="#module_test-object-model">test-object-model</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#TestContext">TestContext</a></dt>
<dd><p>The test context, available as <code>this</code> within each test function.</p>
</dd>
</dl>

<a name="module_test-object-model"></a>

## test-object-model

* [test-object-model](#module_test-object-model)
    * [Test](#exp_module_test-object-model--Test) ⏏
        * [new Test([name], [testFn], [options])](#new_module_test-object-model--Test_new)
        * _instance_
            * [.name](#module_test-object-model--Test+name) : <code>string</code>
            * [.testFn](#module_test-object-model--Test+testFn) : <code>function</code>
            * [.index](#module_test-object-model--Test+index) : <code>number</code>
            * [.state](#module_test-object-model--Test+state) : <code>string</code>
            * [.timeout](#module_test-object-model--Test+timeout) : <code>number</code>
            * [.ended](#module_test-object-model--Test+ended) : <code>boolean</code>
            * [.maxConcurrency](#module_test-object-model--Test+maxConcurrency) : <code>number</code>
            * [.test()](#module_test-object-model--Test+test) ⇒ [<code>Test</code>](#exp_module_test-object-model--Test)
            * [.skip()](#module_test-object-model--Test+skip) ⇒ [<code>Test</code>](#exp_module_test-object-model--Test)
            * [.only()](#module_test-object-model--Test+only) ⇒ [<code>Test</code>](#exp_module_test-object-model--Test)
            * [.run()](#module_test-object-model--Test+run) ⇒ <code>Promise</code>
            * [.reset()](#module_test-object-model--Test+reset)
        * _static_
            * [.combine(tests, [name])](#module_test-object-model--Test.combine) ⇒ <code>Test</code>

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

#### test.index : <code>number</code>
Position of this test within its parents children

**Kind**: instance property of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test+state"></a>

#### test.state : <code>string</code>
Test state: pending, start, skip, pass or fail.

**Kind**: instance property of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test+timeout"></a>

#### test.timeout : <code>number</code>
Timeout in ms

**Kind**: instance property of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test+ended"></a>

#### test.ended : <code>boolean</code>
True if the test has ended

**Kind**: instance property of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test+maxConcurrency"></a>

#### test.maxConcurrency : <code>number</code>
The max concurrency that asynchronous child jobs can run.

**Kind**: instance property of [<code>Test</code>](#exp_module_test-object-model--Test)  
**Default**: <code>10</code>  
<a name="module_test-object-model--Test+test"></a>

#### test.test() ⇒ [<code>Test</code>](#exp_module_test-object-model--Test)
Add a test.

**Kind**: instance method of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test+skip"></a>

#### test.skip() ⇒ [<code>Test</code>](#exp_module_test-object-model--Test)
Add a skipped test

**Kind**: instance method of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test+only"></a>

#### test.only() ⇒ [<code>Test</code>](#exp_module_test-object-model--Test)
Add an only test

**Kind**: instance method of [<code>Test</code>](#exp_module_test-object-model--Test)  
<a name="module_test-object-model--Test+run"></a>

#### test.run() ⇒ <code>Promise</code>
Execute the stored test function.

**Kind**: instance method of [<code>Test</code>](#exp_module_test-object-model--Test)  
**Fulfil**: <code>\*</code>  
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

<a name="TestContext"></a>

## TestContext
The test context, available as `this` within each test function.

**Kind**: global class  

* [TestContext](#TestContext)
    * [.name](#TestContext+name)
    * [.index](#TestContext+index)

<a name="TestContext+name"></a>

### testContext.name
The name given to this test.

**Kind**: instance property of [<code>TestContext</code>](#TestContext)  
<a name="TestContext+index"></a>

### testContext.index
The test index within the current set.

**Kind**: instance property of [<code>TestContext</code>](#TestContext)  
