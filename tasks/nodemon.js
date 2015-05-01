var gulp        = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

/**
 *  * Run the build task and start a server with BrowserSync
 *   */
module.exports = function(gulp, config) {
	config = config.nodemon || config;
	gulp.task('nodemon', function(cb) {
		nodemon(config)
		.on('start', function () {
			// 'start' event gets called BEFORE running the script, or so it seems.
			// Wait a little while to reload browserSync to let server reboot
			if(browserSync.active)
				setTimeout(browserSync.reload, config.reloadDelay || 500);
			else
				cb();
		});
	});
};
