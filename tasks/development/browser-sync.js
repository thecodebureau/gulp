var gulp        = require('gulp');
var browserSync = require('browser-sync');

/**
 *  * Run the build task and start a server with BrowserSync
 *   */
module.exports = function(gulp, config) {
	config = config.browserSync || config;
	gulp.task('browser-sync', function() {
			browserSync(config);
	});
}
