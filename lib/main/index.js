/*eslint-env node, browser*/
/*eslint no-console: 0*/

// default foreground sequence
const S_DEFAULT_COLOR = '\u001b[39m';

//
const H_LEVEL_COLORS = {
	fail: {
		sequence: '\u001b[38;5;196m', // blood (196)
		color: 'red', // for browser
		channel: 'error',
	},
	error: {
		sequence: '\u001b[31m', // red
		channel: 'error',
	},
	warn: {
		sequence: '\u001b[38;5;208m', // golden (208)
		channel: 'warn',
	},
	info: {
		sequence: '\u001b[34m', // blue
		channel: 'info',
	},
	good: {
		sequence: '\u001b[32m', // green
		color: 'limegreen',
		channel: 'log',
	},
	out: {
		sequence: '\u001b[96m', // light cyan
		color: 'cyan',
		channel: 'log',
	},
	log: {
		sequence: '\u001b[39m', // default foreground sequence
		channel: 'log',
	},
};

// export module
const local = module.exports = {};


// create a logger instance
local.logger = function(y_class, h_static={}) {

	// prep class name
	let s_class_name = y_class+'';

	// received class
	if('function' === typeof y_class) {

		// set class name
		s_class_name = y_class.name;

		// define static members
		for(let s_key in h_static) {
			h_static[s_key] = h_static[s_key];
		}
	}

	// prep export
	let h_local = {};

	// nodejs
	if(process && process.uptime) {
		// set logger actions
		for(let s_level in H_LEVEL_COLORS) {
			// fail haults script execution
			if('fail' === s_level) {
				h_local[s_level] = (function(s_msg, ...a_args) {
					let e_throw = new Error();
					let s_stack = e_throw.stack.split(/\n/g).slice(2).join('\n');
					console[this.channel](
						`[${this.sequence}${s_class_name}${S_DEFAULT_COLOR}]+${
							process.uptime()
						}s/ ${this.sequence}${s_msg}\n${
							s_stack
						}${S_DEFAULT_COLOR}`, ...a_args);
					e_throw.stack = `Error\n${s_stack}`;
					throw e_throw;
				}).bind(H_LEVEL_COLORS[s_level]);
			}
			else {
				h_local[s_level] = (function(s_msg, ...a_args) {
					console[this.channel](
						`[${this.sequence}${s_class_name}${S_DEFAULT_COLOR}]+${
							process.uptime()
						}s/ ${this.sequence}${s_msg}${S_DEFAULT_COLOR}`, ...a_args);
				}).bind(H_LEVEL_COLORS[s_level]);
			}
		}
	}
	// browser
	else if(window && window.performance) {
		// set logger actions
		for(let s_level in H_LEVEL_COLORS) {
			// fail hault script execution
			if('fail' === s_level) {
				h_local[s_level] = (function(s_msg, ...a_args) {
					let e_throw = new Error();
					let s_stack = e_throw.stack.split(/\n/g).slice(2).join('\n');
					console[this.channel](
						`[%c${s_class_name}%c]+${
							((Date.now() - window.performance.timing.domContentLoadedEventStart)*.001).toFixed(3)
						}s/ %c${s_msg}\n${
							s_stack
						}`, 'color:'+this.color, 'color:inherit', ...a_args, 'color:'+this.color);
					e_throw.stack = `Error\n${s_stack}`;
					throw e_throw;
				}).bind(H_LEVEL_COLORS[s_level]);
			}
			else {
				h_local[s_level] = (function(s_msg, ...a_args) {
					console[this.channel](
						`[%c${s_class_name}%c]+${
							((Date.now() - window.performance.timing.domContentLoadedEventStart)*.001).toFixed(3)
						}s/ %c${s_msg}`, 'color:'+this.color, 'color:inherit', ...a_args, 'color:'+this.color);
				}).bind(H_LEVEL_COLORS[s_level]);
			}
		}
	}

	// return logger
	return h_local;
};


// override operator's property to mirror prototype property
const bind_property = (f_operator, s_property, d_ipc_node, k_instance) => {

	// ref property descriptor
	let h_property_descriptor = Object.getOwnPropertyDescriptor(d_ipc_node, s_property);

	// property value is a function
	if('function' === typeof h_property_descriptor.value) {
		// define method on operator's own property
		Object.defineProperty(f_operator, s_property,
			// except, override descriptor
			Object.assign(h_property_descriptor, {
				// by binding instance to the function
				value: d_ipc_node[s_property].bind(k_instance),
			}));
	}
	// property is something else
	else {
		// it has a [[Getter]] function
		if('function' === typeof h_property_descriptor.get) {
			// bind the instance to the getter function definition
			h_property_descriptor.get = h_property_descriptor.get.bind(k_instance);
		}
		// it has a [[Setter]] function
		if('function' === typeof h_property_descriptor.set) {
			// bind the instance to the setter function definition
			h_property_descriptor.set = h_property_descriptor.set.bind(k_instance);
		}

		// use the descriptor to mirror the property on the operator
		Object.defineProperty(f_operator, s_property, h_property_descriptor);
	}
};

// set prototype of operator to instance and override function's own properties
const bind_operator_proxy = (f_operator, k_instance) => {

	// bind instance to operator
	f_operator = Function.prototype.bind.apply(f_operator, [k_instance]);

	// set prototype of operator to the instance itself
	Object.setPrototypeOf(f_operator, k_instance);

	// build prototype chain array
	let a_inverse_prototype_chain = [];
	let d_pc_node = k_instance;
	do {
		// add this prototype object to the chain
		a_inverse_prototype_chain.unshift(d_pc_node);

		// advance up the prototype chain
		d_pc_node = Object.getPrototypeOf(d_pc_node);
	} while(d_pc_node !== Object.prototype);

	// override operator's own 'length' and 'name' properties with those from prototype chain if they exist
	a_inverse_prototype_chain.forEach((d_ipc_node) => {
		// override length property
		if(d_ipc_node.hasOwnProperty('length')) {
			bind_property(f_operator, 'length', d_ipc_node, k_instance);
		}
		// override name property
		if(d_ipc_node.hasOwnProperty('name')) {
			bind_property(f_operator, 'name', d_ipc_node, k_instance);
		}
	});

	// return operator/instance handle
	return f_operator;
};

// extend class with static members, proxy members on cover object
const copy_assign_static_proxy = (f_cover, y_class, h_static) => {

	// copy-assign public static members from class onto class cover
	Object.getOwnPropertyNames(y_class).forEach((s_property) => {
		Object.defineProperty(f_cover, s_property, Object.getOwnPropertyDescriptor(y_class, s_property));
	});

	// ammend public static members
	Object.keys(h_static).forEach((s_property) => {
		// ref public static member descriptor
		let h_psm_descriptor = Object.getOwnPropertyDescriptor(h_static, s_property);

		// define actual property on class
		Object.defineProperty(y_class, s_property, h_psm_descriptor);

		// define proxy property on class cover (getters/setters for class ref to access/mutate public static members)
		Object.defineProperty(f_cover, s_property, {
			// inherit from actual property
			configurable: h_psm_descriptor.configurable,
			enumerable: h_psm_descriptor.enumerable,

			// define proxy getter
			get() {
				return y_class[s_property];
			},

			// define proxy setter
			set(z_value) {
				y_class[s_property] = z_value;
			},
		});
	});

	// return cover
	return f_cover;
};


// allow class to be instantiated without `new`
local.export = function(y_class, f_operator, h_static={}) {
	// cover class with `new`-less function
	let f_cover = function(...a_args) {

		// create class instance
		let k_instance = new y_class(...a_args);

		// use operator
		if('function' === typeof f_operator) {

			// called with `new`
			if(new.target) {
				throw `cannot return operator function when using 'new' keyword`;
			}

			// bind operator proxy
			return bind_operator_proxy(f_operator, k_instance);
		}

		// return instance
		return k_instance;
	};

	// assign static members
	return copy_assign_static_proxy(f_cover, y_class, h_static);
};


// allow class to be instantiated asynchronously
local.exportAsync = function(y_class, f_operator, h_static={}) {

	// constructor cover
	let f_cover = function(...a_args) {

		// ref callback at end
		let f_okay_instance = a_args[a_args.length-1];

		// prep instance
		let k_instance;

		// async callback function
		if('function' === typeof f_okay_instance) {
			// asynchronously return instance to caller
			const f_okay_constructor = () => {

				// use operator
				if('function' === typeof f_operator) {
					// bind operator proxy
					f_okay_instance(bind_operator_proxy(f_operator, k_instance));
				}
				// no operator
				else {
					// all done :)
					f_okay_instance(k_instance);
				}
			};

			// replace last arg
			a_args[a_args.length-1] = f_okay_constructor;

			// create instance
			k_instance = new y_class(...a_args);
		}
		// no callback given
		else {
			throw `class ${y_class.name} requires asynchronous construction. expected last argument to be callback function`;
		}
	};

	// assign static members
	return copy_assign_static_proxy(f_cover, y_class, h_static);
};
