var p = require('path');
var fs = require('fs');

var gulp        = require('gulp');
var browserSync = require('browser-sync');

var TASK_NAME = 'browser-sync';

var port = fs.existsSync(p.join(PWD, 'server/config/port.js')) ? require(p.join(PWD, 'server/config/port')) : null;

var config = gulp.config({
	defaults: {},
	development: {
		browser: null,
		ghostMode: false,
		proxy: "localhost:" + (port || 10000),
		files: [
			p.join(PWD, 'pulic/css/**/*.css'),
			p.join(PWD, 'public/js/**/*.js'),
		]
	}
}, gulp.userConfig[TASK_NAME]);

gulp.task(TASK_NAME, function() {
	browserSync(config);
});
