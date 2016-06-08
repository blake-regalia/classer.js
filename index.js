// only for node >= v6 (prior releases do not stably support es6)
if(~~process.versions.node.split(/\./g)[0] >= 6) {
	module.exports = require('./dist.es6/main/index.js');
}
// otherwise, default to es5 version
else {
	module.exports = require('./dist.es5/main/index.js');
}
