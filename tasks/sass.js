var sass         = require('../plugins/tcb-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');

module.exports = function(gulp, config) {
	var processors = [
		autoprefixer(config.autoprefixer),
	];

	if(ENV === 'production') {
		var csswring = require('csswring');
		processors.push(csswring(config.csswring));
	}

	//config.sass.options.onError = gulp.errorHandler;

	gulp.task('sass', function() {
		console.log('config.sass.src');
		console.log(config.sass.src);
		return gulp.src(config.sass.src)
			.pipe(sass(config.sass.options))
			.on('error', gulp.errorHandler)
			//.pipe(postcss(processors))
			.pipe(gulp.dest(config.sass.dest));
	});
};
