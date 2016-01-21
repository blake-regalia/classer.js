import assert from 'assert';
import classer from '../dist/classer/classer.js';

describe('classer', () => {

	let local = classer('Test', function(h_arg1, h_arg2) {

		let {name: s_name} = h_arg1;

		return {
			getName() {
				return s_name;
			},
		};
	});

	it('works', () => {
		let test = new local({name: 'test'});
		assert('test', test.getName());
	});

	local.out('out');
	local.info('info');
	local.warn('warn');
	local.good('good');
	local.error('error');
	local.fail('fail');
});
