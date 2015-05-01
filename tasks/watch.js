var _ = require('lodash');

module.exports = function(gulp, config) {
	config = config.watch || config;

	gulp.task('watch', function(value) {
		_.forIn(config, function(value, key) {
			gulp.watch(value,  [key]);
		});
	});
};
