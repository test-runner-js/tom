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
    * [Tom](#exp_module_test-object-model--Tom) ⏏
        * [new Tom([name], [testFn], [options])](#new_module_test-object-model--Tom_new)
        * _instance_
            * [.state](#module_test-object-model--Tom+state) : <code>string</code>
            * [.name](#module_test-object-model--Tom+name) : <code>string</code>
            * [.testFn](#module_test-object-model--Tom+testFn) : <code>function</code>
            * [.index](#module_test-object-model--Tom+index) : <code>number</code>
            * [.ended](#module_test-object-model--Tom+ended) : <code>boolean</code>
            * [.result](#module_test-object-model--Tom+result) : <code>\*</code>
            * [.disabledByOnly](#module_test-object-model--Tom+disabledByOnly) : <code>boolean</code>
            * [.options](#module_test-object-model--Tom+options)
            * [.context](#module_test-object-model--Tom+context) : <code>TextContext</code>
            * [.type](#module_test-object-model--Tom+type) ⇒ <code>string</code>
            * [.toSkip](#module_test-object-model--Tom+toSkip) ⇒ <code>booolean</code>
            * [.stats](#module_test-object-model--Tom+stats) : <code>object</code>
                * [.start](#module_test-object-model--Tom+stats.start) : <code>number</code>
                * [.end](#module_test-object-model--Tom+stats.end) : <code>number</code>
                * [.duration](#module_test-object-model--Tom+stats.duration) : <code>number</code>
            * [.toString()](#module_test-object-model--Tom+toString) ⇒ <code>string</code>
            * [.group(name, options)](#module_test-object-model--Tom+group) ⇒ [<code>Tom</code>](#exp_module_test-object-model--Tom)
            * [.test(name, testFn, options)](#module_test-object-model--Tom+test) ⇒ [<code>Tom</code>](#exp_module_test-object-model--Tom)
            * [.skip()](#module_test-object-model--Tom+skip) ⇒ [<code>Tom</code>](#exp_module_test-object-model--Tom)
            * [.only()](#module_test-object-model--Tom+only) ⇒ [<code>Tom</code>](#exp_module_test-object-model--Tom)
            * [.before()](#module_test-object-model--Tom+before) ⇒ [<code>Tom</code>](#exp_module_test-object-model--Tom)
            * [.todo()](#module_test-object-model--Tom+todo) ⇒ [<code>Tom</code>](#exp_module_test-object-model--Tom)
            * [.after()](#module_test-object-model--Tom+after) ⇒ [<code>Tom</code>](#exp_module_test-object-model--Tom)
            * [.run()](#module_test-object-model--Tom+run) ⇒ <code>Promise</code>
            * [.reset()](#module_test-object-model--Tom+reset)
            * ["skipped" (test)](#module_test-object-model--Tom+event_skipped)
            * ["todo" (test)](#module_test-object-model--Tom+event_todo)
            * ["in-progress" (test)](#module_test-object-model--Tom+event_in-progress)
            * ["pass" (test, result)](#module_test-object-model--Tom+event_pass)
            * ["fail" (test, err)](#module_test-object-model--Tom+event_fail)
            * ["ignored" (test)](#module_test-object-model--Tom+event_ignored)
        * _static_
            * [.combine(tests, [name])](#module_test-object-model--Tom.combine) ⇒ <code>Tom</code>
            * [.validate(tom)](#module_test-object-model--Tom.validate) ⇒ <code>boolean</code>

<a name="exp_module_test-object-model--Tom"></a>

### Tom ⏏
**Kind**: Exported class  
<a name="new_module_test-object-model--Tom_new"></a>

#### new Tom([name], [testFn], [options])

| Param | Type | Description |
| --- | --- | --- |
| [name] | <code>string</code> | The test name. |
| [testFn] | <code>function</code> | A function which will either succeed, reject or throw. |
| [options] | <code>object</code> | Test config. |
| [options.timeout] | <code>number</code> | A time limit for the test in ms. |
| [options.maxConcurrency] | <code>number</code> | The max concurrency that child tests will be able to run. For example, specifying `2` will allow child tests to run two at a time. Defaults to `10`. |
| [options.skip] | <code>boolean</code> | Skip this test. |
| [options.only] | <code>boolean</code> | Only run this test. |
| [options.before] | <code>boolean</code> | Run this test before its siblings. |
| [options.after] | <code>boolean</code> | Run this test after its siblings. |
| [options.todo] | <code>boolean</code> | Mark this test as incomplete. |
| [options.group] | <code>boolean</code> | Mark this test as a group. |

<a name="module_test-object-model--Tom+state"></a>

#### tom.state : <code>string</code>
Test state. Can be one of `pending`, `in-progress`, `skipped`, `ignored`, `todo`, `pass` or `fail`.

**Kind**: instance property of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+name"></a>

#### tom.name : <code>string</code>
Test name

**Kind**: instance property of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+testFn"></a>

#### tom.testFn : <code>function</code>
A function which will either succeed, reject or throw.

**Kind**: instance property of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+index"></a>

#### tom.index : <code>number</code>
Position of this test within its parents children

**Kind**: instance property of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+ended"></a>

#### tom.ended : <code>boolean</code>
True if the test has ended.

**Kind**: instance property of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+result"></a>

#### tom.result : <code>\*</code>
If the test passed, the value returned by the test function. If it failed, the exception thrown or rejection reason.

**Kind**: instance property of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+disabledByOnly"></a>

#### tom.disabledByOnly : <code>boolean</code>
True if one or more different tests are marked as `only`.

**Kind**: instance property of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+options"></a>

#### tom.options
The options set when creating the test.

**Kind**: instance property of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+context"></a>

#### tom.context : <code>TextContext</code>
The text execution context.

**Kind**: instance property of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+type"></a>

#### tom.type ⇒ <code>string</code>
Returns `test`, `group` or `todo`.

**Kind**: instance property of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+toSkip"></a>

#### tom.toSkip ⇒ <code>booolean</code>
Returns `true` if this test was marked to be skipped by usage of `skip` or `only`.

**Kind**: instance property of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+stats"></a>

#### tom.stats : <code>object</code>
Test execution stats

**Kind**: instance namespace of [<code>Tom</code>](#exp_module_test-object-model--Tom)  

* [.stats](#module_test-object-model--Tom+stats) : <code>object</code>
    * [.start](#module_test-object-model--Tom+stats.start) : <code>number</code>
    * [.end](#module_test-object-model--Tom+stats.end) : <code>number</code>
    * [.duration](#module_test-object-model--Tom+stats.duration) : <code>number</code>

<a name="module_test-object-model--Tom+stats.start"></a>

##### stats.start : <code>number</code>
Start time.

**Kind**: static property of [<code>stats</code>](#module_test-object-model--Tom+stats)  
<a name="module_test-object-model--Tom+stats.end"></a>

##### stats.end : <code>number</code>
End time.

**Kind**: static property of [<code>stats</code>](#module_test-object-model--Tom+stats)  
<a name="module_test-object-model--Tom+stats.duration"></a>

##### stats.duration : <code>number</code>
Test execution duration.

**Kind**: static property of [<code>stats</code>](#module_test-object-model--Tom+stats)  
<a name="module_test-object-model--Tom+toString"></a>

#### tom.toString() ⇒ <code>string</code>
Returns the test name.

**Kind**: instance method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+group"></a>

#### tom.group(name, options) ⇒ [<code>Tom</code>](#exp_module_test-object-model--Tom)
Add a test group.

**Kind**: instance method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Test name. |
| options | <code>objects</code> | Config. |

<a name="module_test-object-model--Tom+test"></a>

#### tom.test(name, testFn, options) ⇒ [<code>Tom</code>](#exp_module_test-object-model--Tom)
Add a test.

**Kind**: instance method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Test name. |
| testFn | <code>function</code> | Test function. |
| options | <code>objects</code> | Config. |

<a name="module_test-object-model--Tom+skip"></a>

#### tom.skip() ⇒ [<code>Tom</code>](#exp_module_test-object-model--Tom)
Add a skipped test

**Kind**: instance method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+only"></a>

#### tom.only() ⇒ [<code>Tom</code>](#exp_module_test-object-model--Tom)
Add an only test

**Kind**: instance method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+before"></a>

#### tom.before() ⇒ [<code>Tom</code>](#exp_module_test-object-model--Tom)
Add a test which must run and complete before the others.

**Kind**: instance method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+todo"></a>

#### tom.todo() ⇒ [<code>Tom</code>](#exp_module_test-object-model--Tom)
Add a test but don't run it and mark as incomplete.

**Kind**: instance method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+after"></a>

#### tom.after() ⇒ [<code>Tom</code>](#exp_module_test-object-model--Tom)
Add a test which must run and complete after the others.

**Kind**: instance method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+run"></a>

#### tom.run() ⇒ <code>Promise</code>
Execute the stored test function.

**Kind**: instance method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
**Fulfil**: <code>\*</code>  
<a name="module_test-object-model--Tom+reset"></a>

#### tom.reset()
Reset state

**Kind**: instance method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  
<a name="module_test-object-model--Tom+event_skipped"></a>

#### "skipped" (test)
Test skipped.

**Kind**: event emitted by [<code>Tom</code>](#exp_module_test-object-model--Tom)  

| Param | Type | Description |
| --- | --- | --- |
| test | <code>TestObjectModel</code> | The test node. |

<a name="module_test-object-model--Tom+event_todo"></a>

#### "todo" (test)
Test todo.

**Kind**: event emitted by [<code>Tom</code>](#exp_module_test-object-model--Tom)  

| Param | Type | Description |
| --- | --- | --- |
| test | <code>TestObjectModel</code> | The test node. |

<a name="module_test-object-model--Tom+event_in-progress"></a>

#### "in-progress" (test)
Test in-progress.

**Kind**: event emitted by [<code>Tom</code>](#exp_module_test-object-model--Tom)  

| Param | Type | Description |
| --- | --- | --- |
| test | <code>TestObjectModel</code> | The test node. |

<a name="module_test-object-model--Tom+event_pass"></a>

#### "pass" (test, result)
Test pass.

**Kind**: event emitted by [<code>Tom</code>](#exp_module_test-object-model--Tom)  

| Param | Type | Description |
| --- | --- | --- |
| test | <code>TestObjectModel</code> | The test node. |
| result | <code>\*</code> | The value returned by the test. |

<a name="module_test-object-model--Tom+event_fail"></a>

#### "fail" (test, err)
Test fail.

**Kind**: event emitted by [<code>Tom</code>](#exp_module_test-object-model--Tom)  

| Param | Type | Description |
| --- | --- | --- |
| test | <code>TestObjectModel</code> | The test node. |
| err | <code>Error</code> | The exception thrown. |

<a name="module_test-object-model--Tom+event_ignored"></a>

#### "ignored" (test)
Test ignored.

**Kind**: event emitted by [<code>Tom</code>](#exp_module_test-object-model--Tom)  

| Param | Type | Description |
| --- | --- | --- |
| test | <code>TestObjectModel</code> | The test node. |

<a name="module_test-object-model--Tom.combine"></a>

#### Tom.combine(tests, [name]) ⇒ <code>Tom</code>
If more than one TOM instances are supplied, combine them into a common root.

**Kind**: static method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  

| Param | Type |
| --- | --- |
| tests | <code>Array.&lt;Tom&gt;</code> | 
| [name] | <code>string</code> | 

<a name="module_test-object-model--Tom.validate"></a>

#### Tom.validate(tom) ⇒ <code>boolean</code>
Returns true if the input is a valid test.

**Kind**: static method of [<code>Tom</code>](#exp_module_test-object-model--Tom)  

| Param | Type | Description |
| --- | --- | --- |
| tom | [<code>test-object-model</code>](#module_test-object-model) | Input to test. |

<a name="TestContext"></a>

## TestContext
The test context, available as `this` within each test function.

**Kind**: global class  

* [TestContext](#TestContext)
    * [.name](#TestContext+name)
    * [.index](#TestContext+index)
    * [.data](#TestContext+data)

<a name="TestContext+name"></a>

### testContext.name
The name given to this test.

**Kind**: instance property of [<code>TestContext</code>](#TestContext)  
<a name="TestContext+index"></a>

### testContext.index
The test index within the current set.

**Kind**: instance property of [<code>TestContext</code>](#TestContext)  
<a name="TestContext+data"></a>

### testContext.data
Test run data.

**Kind**: instance property of [<code>TestContext</code>](#TestContext)  
