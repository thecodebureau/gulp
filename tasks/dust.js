// modules > native
var p = require('path');

// modules > 3rd party
var chalk = require('chalk');

// modules > gulp:utilities
var gulp = require('gulp');
var through = require('through2');
var gutil = require('gulp-util');

// modules > gulp:plugins
var minify = require('gulp-htmlmin');
var symlink = require('gulp-symlink');

// modules > internal:plugins
var preMinify = require('../plugins/pre-htmlmin');
var postMinify = require('../plugins/post-htmlmin');

var TASK_NAME = 'dust';

var config = gulp.config.dust;

var finished = [];

var options = {
	removeComments: true,
	collapseWhitespace: true 
};

gulp.task(TASK_NAME, function(done) {
	var count = 0;

	var pipe = gulp.src(config.src)
		.pipe(through.obj(function(file, enc, cb) {
			var relative = p.relative(file.base, file.path);

			if(finished.indexOf(relative) > -1) {
				gutil.log('[' + chalk.cyan(TASK_NAME) + '] skipping: ' + chalk.yellow(file.path));
				cb();
			} else {
				finished.push(relative);
				cb(null, file);
			}
		}));

	if(ENV === 'production') {
		// NOTE! no dust variables in html comments in production. they will be matched in pre plugin,
		// removed in minify and then attempt to access in post!
		pipe.on('end', function() {
				done();
			})
			.pipe(preMinify())
			.pipe(minify(options))
			.pipe(postMinify())
			.pipe(gulp.dest(config.dest));
	} else {
		return pipe
			.on('end', function() {
				gutil.log(chalk.cyan(TASK_NAME) + ' done symlinking ' + chalk.bold.blue(count) + ' files');
			})
			.pipe(symlink(function(file) {
				count++;
				return p.join(config.dest, file.relative);
			}, { log: false }));
	}
});
