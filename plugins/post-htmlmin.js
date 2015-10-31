var gutil = require('gulp-util');
var through = require('through2');

var PLUGIN_NAME = 'pre-htmlmin';

module.exports = function preHtmlmin(options, sync) {
	return through.obj(function(file, enc, cb) {

		if (file.isNull()) {
			return cb(null, file);
		}
		if (file.isStream()) {
			return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
		}

		if (!file.contents.length) {
			return cb(null, file);
		}

		var str = file.contents.toString();

		var arr = str.split('aaaaaaaaaaaa');

		var matches = file.matches;

		str = '';

		for (var i = 0; i < arr.length; i++) {
			str = str + arr[i] + (matches[i] ? matches[i] : '');
		}

		file.contents = new Buffer(str);

		cb(null, file);
	});
};


