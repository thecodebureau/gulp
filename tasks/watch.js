var p = require('path');

var gulp = require('gulp');

var dir = gulp.directories;

var TASK_NAME = 'watch';

var config = gulp.config({
	browserify: p.join(dir.src.scripts, '**/*.js'),
	sass: p.join(dir.src.sass, '**/*.{sass,scss}')
}, gulp.userConfig[TASK_NAME]);

gulp.task(TASK_NAME, function(value) {
	_.forIn(config, function(value, key) {
		gulp.watch(value,  [key]);
	});
});
