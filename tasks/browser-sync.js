var gulp        = require('gulp');
var browserSync = require('browser-sync');

var config = gulp.config.browserSync;

gulp.task('browser-sync', function() {
	browserSync(config);
});
