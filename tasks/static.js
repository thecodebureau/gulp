// modules > native
var p = require('path');
var fs = require('fs');

// modules > 3rd party
var chalk = require('chalk');

// modules > gulp:utilities
var gulp = require('gulp');
var through = require('through2');
var gutil = require('gulp-util');

// modules > gulp:plugins
var symlink = require('gulp-symlink');

var TASK_NAME = 'static';

var config = gulp.config.static;

gulp.task(TASK_NAME, function() {
	var count = 0;

	return gulp.src(config.src)
		.pipe(through.obj(function (file, enc, callback) {
			fs.stat(file.path, function(err, stats) {
				if(stats.isDirectory())
					file = null;

				callback(null, file);
			});
		}))
		.pipe(symlink(function(file) {
			count++;
			return p.join(config.dest, file.relative);
		}, { log: false }))
		.on('end', function() {
			gutil.log(chalk.cyan(TASK_NAME) + ' done symlinking ' + chalk.bold.blue(count) + ' files');
		});
});
