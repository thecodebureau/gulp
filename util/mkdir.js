var fs = require('fs');
var path = require('path');

module.exports = function mkdir(p) {
	if(fs.existsSync(p)) return;
	mkdir(path.dirname(p));
	fs.mkdirSync(p);
};
