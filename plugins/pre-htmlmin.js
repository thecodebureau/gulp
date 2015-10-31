var gutil = require('gulp-util');
var through = require('through2');

var PLUGIN_NAME = 'pre-htmlmin';

module.exports = function preHtmlmin(options, sync) {
	return through.obj(function(file, enc, cb) {

		if (file.isNull()) {
			return cb(null, file);
		}
		if (file.isStream()) {
			// TODO htmlmin supports streams! Implement!
			return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
		}

		if (!file.contents.length) {
			return cb(null, file);
		}

		var regexp = /{[\/?+:#><][^}]*}/g;

		var str = file.contents.toString();

		file.matches = str.match(regexp) || [];

		// TODO maybe it would be more effecient to iterate over matches array
		// instead of doing new regex
		file.contents = new Buffer(str.split(regexp).join('aaaaaaaaaaaa'));

		cb(null, file);
	});
};

