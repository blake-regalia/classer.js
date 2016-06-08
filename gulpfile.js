// gulp & tasker
const gulp = require('gulp');
const soda = require('gulp-soda');

// create tasks
soda(gulp, {

	// build targets
	domain: {
		main: [
			'es5: dist.es5',
			'es6: dist.es6',
		],
	},

	// map types to recipe lists
	range: {

		// transpiling es6 => es5
		es5: [
			'transpile',
			'develop: transpile',
		],

		// copy es6 => es6
		es6: [
			'copy',
			'develop: copy',
			'istanbul',
			'mocha: istanbul',
		],
	},

	// task options
	options: {
		copy: {
			src: '**/*.js',
		},
		'*': {
			test_src: 'test/index.js',
		},
	},

	// task name aliases
	aliases: {
		test: ['mocha'],
	},
});
