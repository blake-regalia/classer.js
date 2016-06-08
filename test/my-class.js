
// import classer
const classer = require('../');

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
