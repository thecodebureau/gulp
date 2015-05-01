var path = require('path');
var symlink = require('gulp-symlink');

module.exports = function(gulp, config) {
	var local = [
		[ 'samples/config', '/' ],
		[ 'samples/server/middleware/**/*.js', 'server/middleware' ],
		[ 'samples/server/routes/**/*.js', 'server/routes' ],
		[ 'samples/server/models/**/*.js', 'server/models' ],
		[ 'samples/server/templates', 'server/' ],
		[ 'samples/src', '/' ]
	];

	local.forEach(function(val) {
		val[0] = path.join(config.dir.root, val[0]);
		val[1] = path.join(config.dir.root, val[1]);
	});
	

	gulp.task('symlink-samples', function() {
		local.forEach(function(arr) {
			return gulp.src(arr[0]).pipe(symlink(function(file) {
				return path.join(arr[1], file.relative);
			}, { force: true }));
		});
	});
};
