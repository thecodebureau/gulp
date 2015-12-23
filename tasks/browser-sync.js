var p = require('path');
var fs = require('fs');

var gulp        = require('gulp');
var browserSync = require('browser-sync');

var dir = gulp.directories;

var TASK_NAME = 'browser-sync';
// TODO test if defaults,production on object
console.log(PWD);
console.log(fs.existsSync(p.join(PWD, 'server/config/port.js')));

var port = fs.existsSync(p.join(PWD, 'server/config/port.js')) ? require(p.join(PWD, 'server/config/port')) : null;

console.log(port);
var config = gulp.config({
	defaults: {},
	development: {
		browser: null,
		ghostMode: false,
		proxy: "localhost:" + (port || 10000),
		files: [
			p.join(dir.dest.css, '**/*.css'),
			p.join(dir.dest.scripts, '**/*.js'),
			// won't reload correctly for dust templates. Assuming it has to do with nodemon restarting node and node compiling templates.
			//p.join(dir.server.templates, '**/*.{html,dust}'),
		]
	}
}, gulp.userConfig[TASK_NAME]);

gulp.task(TASK_NAME, function() {
	browserSync(config);
});
