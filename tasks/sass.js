var p = require('path');
var chalk = require('chalk');
var sass         = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');

var sourcemaps = require('gulp-sourcemaps');


module.exports = function(gulp, config) {
	function errorHandler(err) {
		var match = err.message.match(/\d+:\d+\s+/);
		var message = err.message.slice(match.index + match[0].length);

		match = message.match(/\s+Backtrace:\s+(.*)/);

		if(match)
			message = message.slice(0, match.index);

		err.message = chalk.yellow('./' + p.relative(PWD, err.file)) + '\n' + message + ' at line ' + err.line + ', col ' + err.column + (match ? '\n\nBacktrace:\n' + match[1] : '');

		gulp.errorHandler.call(this, err);
	}

	var processors = [
		autoprefixer(config.autoprefixer),
	];

	if(ENV === 'production') {
		var csswring = require('csswring');
		processors.push(csswring(config.csswring));
	}

	//config.sass.options.onError = gulp.errorHandler;

	gulp.task('sass', function() {
		return gulp.src(config.sass.src)
			.pipe(sourcemaps.init())
			.pipe(sass(config.sass.options))
			.on('error', errorHandler)
			.pipe(postcss(processors))
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest(config.sass.dest));
	});
};
