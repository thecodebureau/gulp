// modules > native
var p = require('path');

// modules > 3rd party
var chalk = require('chalk');

// modules > gulp:utilities
var gulp = require('gulp');
var gutil = require('gulp-util');

// modules > gulp:plugins
var symlink = require('gulp-symlink');

var dir = gulp.directories;

var TASK_NAME = 'svg';

var config = gulp.config({
	src: p.join(dir.src.svg, '**/*.svg'),
	dest: dir.dest.img
}, gulp.userConfig[TASK_NAME]);

gulp.task(TASK_NAME, function() {
	var count = 0;

	return gulp.src(config.src)
		.pipe(symlink(function(file) {
			count++;
			return p.join(config.dest, file.relative);
		}, { log: false }))
		.on('end', function() {
			gutil.log(chalk.cyan(TASK_NAME) + ' done symlinking ' + chalk.bold.blue(count) + ' files');
		});
});
