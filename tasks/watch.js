var p = require('path');

var gulp = require('gulp');

var TASK_NAME = 'watch';

var config = gulp.config({
	browserify: p.join(PWD, 'src/js/**/*.js'),
	sass: p.join(PWD, 'src/sass/**/*.{sass,scss}')
}, gulp.userConfig[TASK_NAME]);

gulp.task(TASK_NAME, function(value) {
	_.forIn(config, function(value, key) {
		gulp.watch(value,  [key]);
	});
});
