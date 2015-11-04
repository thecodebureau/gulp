var gulp = require('gulp');

var config = gulp.config.watch;

gulp.task('watch', function(value) {
	_.forIn(config, function(value, key) {
		gulp.watch(value,  [key]);
	});
});
