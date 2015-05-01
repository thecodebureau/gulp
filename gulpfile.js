var fs = require('fs');

var config;

if(fs.existsSync('./config')) {
	config = require('./config');
} else {
	config = require('./samples/config');
}


require('./gulp')(config);
