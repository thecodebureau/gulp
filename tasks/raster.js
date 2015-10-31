// modules > native
var p = require('path');

// modules > 3rd party
var chalk = require('chalk');

// modules > gulp:utilities
var gutil = require('gulp-util');

// modules > gulp:plugins
var symlink = require('gulp-symlink');

var TASK_NAME = 'raster';

module.exports = function(gulp, config) {
	config = config.raster || config;

	gulp.task(TASK_NAME, function() {
		var count = 0;

		return gulp.src(config.src)
			.on('end', function() {
				gutil.log(chalk.cyan(TASK_NAME) + ' done symlinking ' + chalk.bold.blue(count) + ' files');
			})
			.pipe(symlink(function(file) {
				count++;
				return p.join(config.dest, file.relative);
			}, { log: false }));
	});
};
