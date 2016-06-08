var a_version = process.versions.node.split(/\./g);

// only for node >= v6 (prior releases do not stably support es6)
if(~~a_version[0] >= 6) {
	module.exports = require('./dist.es6/main/index.js');
}
// otherwise, default to es5 version
else {
	module.exports = require('./dist.es5/main/index.js');
}
