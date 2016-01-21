
//
import winston from 'winston';
import clc from 'cli-color';

//
const T_START = Date.now();

//
const H_LEVEL_COLORS = {
	fail: clc.xterm(196),
	error: clc.red,
	good: clc.green,
	warn: clc.xterm(208),
	info: clc.blue,
	out: s => s,
};

//
const map_index = (h_input) => {
	let i_index = 0;
	let h_output = {};
	for(let s_key in h_input) {
		h_output[s_key] = i_index++;
	}
	return h_output;
};

//
const logger = new winston.Logger({

	//
	levels: map_index(H_LEVEL_COLORS),

	//
	transports: [
		new winston.transports.Console({

			// all levels
			level: 'out',

			// timestamp format
			timestamp: function() {
				return ((Date.now() - T_START) / 1000).toFixed(2);
			},

			// message formatting
			formatter: function(h_opt) {
				return '+'+h_opt.timestamp()+'s/ '
					+(undefined !== h_opt.message? H_LEVEL_COLORS[h_opt.level](h_opt.message): '')
					+'';
			},
		}),
	],
});


//
export default function(s_class_name, f_constructor, h_static={}, h_logger_config={}) {

	// when called (with or without new keyword), invoke constructor
	const f_local = function() {
		return f_constructor.apply(this, arguments);
	};

	// default members
	Object.defineProperties(f_local, {

		// override toString
		toString: {
			value: () => {
				return s_class_name+'()';
			},
		},
	});

	// define static members
	for(let s_key in h_static) {
		Object.defineProperty(f_local, s_key, {
			enumerable: true,
			value: h_static[s_key],
		});
	}

	// set logger actions
	for(let s_level in H_LEVEL_COLORS) {
		Object.defineProperty(f_local, s_level, {
			value: (...a_args) => {
				logger[s_level](...a_args);
			},
		});
	}

	// return actual class
	return f_local;
}
