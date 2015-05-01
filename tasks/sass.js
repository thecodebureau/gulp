var sass         = require('gulp-sass');
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

	config.sass.options.onError = function(err) {
		err = new Error(err);
		gulp.errorHandler.call(that, err);
	};

	var that;

	gulp.task('sass', function() {
		if(!that) that = this;
		return gulp.src(config.sass.src)
			.pipe(sass(config.sass.options))
			.pipe(postcss(processors))
			.pipe(gulp.dest(config.sass.dest));
	});
};
