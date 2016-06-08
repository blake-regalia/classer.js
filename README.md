# classer

A light-weight (dependent-less) module utility that provides `new`-less and asynchronous class instantiation for module exports that practice an Object-Oriented-Programming paradigm. Also includes a 7-channel colored console logger. Works in both node.js and browser.

# Contents
 - [Setup](#install)
 - [Example Usage](#use)
 - [API Reference](#api)

## Install
```sh
$ npm i --save classer
```

## Use

The following module demonstrates an effective use members in an OOP fashion:

#### my-class.js:
```js
// import classer
const classer = require('classer');

// symbol to access private members (except for methods that use public members)
let _private = Symbol();

// private method that can use public members
let $add_name = Symbol();  // less convenient than latter since each method requires own symbol


/**
* private static:
**/

// private static constant field
const S_NAME_DEFAULT = 'no-name';

// private static (mutatable) field
let s_class_message = 'none';


/**
* class:
**/
class MyClass {

    constructor(h_config={}) {

        // destruct config
        let {
            name: s_name,
        } = h_config;

        /**
        * private members:
        **/
        Object.assign(this, {
            [_private]: {

                // private field
                name: s_name || S_NAME_DEFAULT,

                // private method that mutates private fields (cannot call public methods!)
                reset() {
                    // `this` will be the [_private] object
                    this.name = S_NAME_DEFAULT;
                },
            },

            // private method that can access/mutate private fields AND call public methods
            [$add_name](s_name) {
                // mutate private field; `this` will be the instance object
                this[_private].name += ' '+s_name;

                // use public getter
                return this.name;
            },
        });
    }

    /**
    * public members:
    **/

    // public method to call public operator
    greet() {
        return this();
    }

    // public method to access private field
    getName() {
        return this[_private].name;
    }

    // public getter to access private field
    get name() {
        return this[_private].name;
    }

    // public setter to mutate private field
    set name(s_name) {
        this[_private].name = s_name;
    }

    // public method to call private method
    reset() {
        // call private method with `this[_private]` so it can access private members
        this[_private].reset();
    }

    // public method to mutate private field
    add(s_name) {
        // call private method with `this` so it can access public members
        this[$add_name](s_name);

        // return mutated private field
        return this[_private].name;
    }

    /**
    * public static members (getters/setters and methods only):
    **/

    // public static method to access private static field
    static getMessage() {
        return s_class_message;
    }

    // public static getter to access private static field
    static get message() {
        return s_class_message;
    }

    // public static setter to mutate private static field
    static set message(s_message) {
        s_class_message = s_message;
    }

    // public static method to access public static field
    static getSpecies() {
        return MyClass.species;
    }
}


// lets MyClass be called without `new` keyword
module.exports = classer.export(MyClass, function() {
    // optional operator() function that acts as handle to instance of this class
    return `My name is ${this[_private].name}`;
}, {
    /**
    * additional public static members including fields (overrides members defined by class on conflict):
    **/

    // public static field value (otherwise would be forced to use getter function in class-syntax)
    species: 'classic',

    // public static method
    help() {
        return `help yourself, i'm an ${MyClass.species} species!`;
    },
});

```

By exporting the class with `classer.export(class, operator, staticMembers)`, and by using the coding convention above, you get the following API features:

#### index.js:
```js
const MyClass = require('./my-class.js');

// instantiate class without `new`
let instance = MyClass({name: 'frank'});

// call instance handle as an operator
instance(); // 'My name is frank'

// proof that public method can access operator
instance.greet(); // 'My name is frank'

// access private field using a method
instance.getName(); // 'frank'

// access private field using a getter
instance.name; // 'frank'

// mutate private field using a method
instance.reset();
instance.name; // 'no-name'

// mutate private field using a setter
instance.name = 'frankie';
instance.name; // 'frankie'

// access a private static field using a public static method
MyClass.getMessage(); // 'none'

// access a private static field using a public static getter
MyClass.message; // 'none'

// mutate a private static field using a public static setter
MyClass.message = 'All your base are belong to us!';
MyClass.message; // 'All your base are belong to us!'

// access a public static field
MyClass.species; // 'none'

// mutate a public static field
MyClass.species = 'unknown';
MyClass.species; // 'unknown'

// proof that changes to a static field are reflected when using a public static method
MyClass.help(); // 'help yourself, i'm an unknown species!'
```

## API
---
### classer.export(class: class[, operator: {function|array|other}[, staticMembers: plainObject]])
Creates a function that instantiates `class` when invoked (with or without `new` operator). If `operator` is supplied, every instance of the class returned by the constructor will be that object, with its prototype chain set and any necessary properties overriden. If `staticMembers` is provided, all of its' members will be ammended to `class`, and setters/getters will be defined on the returned object to allow mutations without losing pointer references. See example above for more detail.

---
### classer.exportAsync(class: class[, operator: {function|array|other}[, staticMembers: plainObject]])
Same as `classer.export`, except that instead of returning the instance, a callback (provided as the last argument to the constructor call) receives the instance. To support this, `class` must accept a callback function as the last parameter in its constructor. The constructor may override `operator` by passing an object to the callback. For example:
#### async-class.js
```js
const classer = require('classer');
const _private = Symbol();

class AsyncClass {
    constructor(s_name, f_okay_async) {
        // go async
        setTimeout(() => {
            // finishing setting private fields...
            this[_private].name = s_name;
            
            // class instance is ready

            // fred! override the default operator
            if('fred' === s_name) {
                f_okay_async(function() {
                    return `${this[_private].name} rules!`;
                });
            }
            // use default operator
            else {
                f_okay_async();
            }
        }, 200);
    }
}

// export
module.exports = classer.exportAsync(AsyncClass, function operator() {
    return `My name is ${this[_private].name}`;
});
```

Then, from another script:
```js
const AsyncClass = require('./async-class.js');

AsyncClass({name: 'george'}, (k_async) => {
    k_async();  // 'My name is george'
});

AsyncClass({name: 'fred'}, (k_async) => {
    k_async();  // 'fred rules!'
});
```

---
### classer.logger(class_name: string)
### classer.logger(class: class)
Creates a logger instance that includes 7 channels of colored output (works in both node.js and browser)
```js
class MyClass {}
const local = classer.logger(MyClass);
/** OR **/
const local = classer.logger('MyClass');

/** THEN **/
local.log('pizza'); // prints: '[MyClass]+0.012s/ pizza'
```

The 7 log channels are as follows:
- `.log` - calls `console.log` using default console color
- `.out` - calls `console.log` using light cyan color
- `.good` - calls `console.log` using green color
- `.info` - calls `console.info` using blue color
- `.warn` - calls `console.warn` using orange color
- `.error` - calls `console.error` using red color
- `.fail` - calls `console.error` using vibrant blood color, then throws an error


