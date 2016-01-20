//
export default function(f_constructor, h_static) {

	// when called (with or without new keyword), invoke constructor
	const f_local = function() {
		return f_constructor.apply(this, arguments);
	};

	// define static members
	for(let s_key in h_static) {
		Object.defineProperty(f_local, s_key, {
			enumerable: true,
			value: h_static[s_key],
		});
	}

	// return actual class
	return f_local;
}
