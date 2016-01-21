# classer

## Install
```sh
$ npm i classer
```

## Use
```js
/**
* private static:
**/
const H_LOOKUP = {
	a: 'arnold',
	b: 'batman',	
};

/**
* class:
**/
const local = classer('MyClass', (h_config) => {
	
	/**
	* private fields:
	**/
	let {
		name: s_name,
		limit: n_limit,
	} = h_config;

	/**
	* private methods:
	**/
	const run_task = () => {
		n_limit += 1;
	};

	/**
	* public:
	**/
	return {
		org: 2,

		getName() {
			return s_name;
		},

		change() {
			run_task();
		},
	};
},
	/**
	* public static:
	**/
	{
	
	help: () => {
		return 'help yourself';
	},
});

// exports
export default local;
```