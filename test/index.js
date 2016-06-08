const assert = require('assert');
const classer = require('../index.js');
const my_class = require('./my-class.js');
const async_class = require('./async-class.js');

const eq = assert.strictEqual;
const neq = assert.notStrictEqual;

describe('export', () => {
	let k_test;
	try {
		k_test = my_class({name: 'frank'});
	}
	catch(e_test) {
		throw e_test;
	}

	it('allows `new`-less construction', () => {
		neq('undefined', typeof k_test);
	});

	it('supports operator handle', () => {
		eq('function', typeof k_test);
	});

	it('operator can access private member', () => {
		eq(k_test(), 'My name is frank');
	});

	it('public method can access operator', () => {
		eq(k_test.greet(), 'My name is frank');
	});

	it('public method can access private field', () => {
		eq(k_test.getName(), 'frank');
	});

	it('public getter can access private field', () => {
		eq(k_test.name, 'frank');
	});

	it('public method can call private method', () => {
		eq(k_test.reset(), undefined);
	});

	it('private method can mutate private field', () => {
		eq(k_test.name, 'no-name');
	});

	it('public setter can mutate private field', () => {
		k_test.name = 'frank';
		eq(k_test.name, 'frank');
	});

	it('private method can use public member', () => {
		eq(k_test.add('einstein'), 'frank einstein');
	});

	it('public method can use private method to mutate private field', () => {
		eq(k_test.name, 'frank einstein');
	});

	it('public static method can access private static field', () => {
		eq(my_class.getMessage(), 'none');
	});

	it('public static getter can access private static field', () => {
		eq(my_class.message, 'none');
	});

	it('public static setter can mutate private static field', () => {
		my_class.message = 'All Your Base Are Belong To Us!';
		eq(my_class.message, 'All Your Base Are Belong To Us!');
	});

	it('access public static field', () => {
		eq(my_class.species, 'classic');
	});

	it('mutate public static field', () => {
		my_class.species = 'unknown';
		eq(my_class.species, 'unknown');
	});

	it('public static method can access public static field', () => {
		eq(my_class.getSpecies(), 'unknown');
	});

	it('public static method can access public static field via proxy', () => {
		eq(my_class.help(), 'help yourself, i\'m an unknown species!');
	});
});

describe('mocha', () => {

	it('can wait', (cb) => {
		setTimeout(cb, 20);
	});

	async_class({name: 'frank'}, (k_async) => {

		describe('exportAsync', () => {

			it('allows `new`-less construction', () => {
				neq('undefined', typeof k_async);
			});

			it('supports operator handle', () => {
				eq('function', typeof k_async);
			});

			it('operator can access private member', () => {
				eq(k_async(), 'frank overrides!');
			});

			it('public method can access operator', () => {
				eq(k_async.greet(), 'frank overrides!');
			});

			it('public method can access private field', () => {
				eq(k_async.getName(), 'frank');
			});

			it('public getter can access private field', () => {
				eq(k_async.name, 'frank');
			});

			it('public method can call private method', () => {
				eq(k_async.reset(), undefined);
			});

			it('private method can mutate private field', () => {
				eq(k_async.name, 'no-name');
			});

			it('public setter can mutate private field', () => {
				k_async.name = 'frank';
				eq(k_async.name, 'frank');
			});

			it('private method can use public member', () => {
				eq(k_async.add('einstein'), 'frank einstein');
			});

			it('public method can use private method to mutate private field', () => {
				eq(k_async.name, 'frank einstein');
			});

			it('public static method can access private static field', () => {
				eq(async_class.getMessage(), 'none');
			});

			it('public static getter can access private static field', () => {
				eq(async_class.message, 'none');
			});

			it('public static setter can mutate private static field', () => {
				async_class.message = 'All Your Base Are Belong To Us!';
				eq(async_class.message, 'All Your Base Are Belong To Us!');
			});

			it('access public static field', () => {
				eq(async_class.species, 'classic');
			});

			it('mutate public static field', () => {
				async_class.species = 'unknown';
				eq(async_class.species, 'unknown');
			});

			it('public static method can access public static field', () => {
				eq(async_class.getSpecies(), 'unknown');
			});

			it('public static method can access public static field via proxy', () => {
				eq(async_class.help(), 'help yourself, i\'m an unknown species!');
			});
		});
	});
});

describe('array operator', () => {

	class ArrayOperator {
		constructor() {
			this.test = 'yep';
		}
	}

	let k_arr = classer.export(ArrayOperator, ['zero', 'one'])();

	it('works', () => {
		neq(k_arr, undefined);
	});

	it('accesses array indicies', () => {
		eq(k_arr[1], 'one');
	});

	it('supports array getter', () => {
		eq(k_arr.length, 2);
	});

	it('accesses instance property', () => {
		eq(k_arr.test, 'yep');
	});
});

describe('logger', () => {

	const local = classer.logger('TestLogging');
	local.log('log');
	local.out('out');
	local.info('info');
	local.good('good');
	local.warn('warn');
	local.error('error');
	try {
		local.fail('fail');
	}
	catch(e) {
		local.good('failing works');
	}
});
