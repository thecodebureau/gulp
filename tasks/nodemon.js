var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

module.exports = function(gulp, config) {
	config = config.nodemon || config;

	gulp.task('nodemon', function(cb) {
		nodemon(_.defaults({ stdout: false }, config))
			.on('readable', function(data) {
				this.stdout.pipe(process.stdout);
				this.stderr.pipe(process.stderr);

				this.stdout.on('data', function(chunk) {
					if (/Express server started on port/.test(chunk)) {
						if(cb)
							cb();

						cb = null;

						if(browserSync.active)
							browserSync.reload();
					}
				});

			});
	});
};
