var path = require('path');
var fs = require('fs');

var through = require('through2');

var symlink = require('gulp-symlink');

module.exports = function(gulp, config) {
	config = config.static || config;
	gulp.task('static', function() {
		return gulp.src(config.src)
			.pipe(through.obj(function (file, enc, callback) {
				var that = this;

				fs.stat(file.path, function(err, stats) {
					if(!stats.isDirectory())
						that.push(file);

					callback();
				});
			}))
			.pipe(symlink(function(file) {
				return path.join(config.dest, file.relative);
			}));
	});
};
