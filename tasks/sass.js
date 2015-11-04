// modules > native
var p = require('path');
var fs = require('fs');

// modules > 3rd party
var chalk = require('chalk');

// modules > gulp
var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');

var config = gulp.config;

function errorHandler(err) {
	if(err.plugin === 'gulp-sass') {
		// node-sass currently outpus current file as first line of error message
		var path = err.message.match(/^.*\n/)[0];

		err.message = err.message.slice(path.length + 7);

		// when main file, ie main.scss throws an error the node-sass error
		// will say stdin instead of the actual filename.
		if(/\sstdin\s/.test(err.message))
			err.message = err.message.replace(/\sstdin\s/, path);
	}

	err.task = 'sass';

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

var suffix = '-' + Date.now().toString(16);

gulp.task('sass', function() {
	fs.writeFile(config.sass.dest + '.json', JSON.stringify({ suffix: suffix }));

	return gulp.src(config.sass.src)
		.pipe(sourcemaps.init())
		.pipe(sass(config.sass.options).on('error', errorHandler))
		.pipe(postcss(processors))
		.pipe(rename({ suffix: suffix }))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(config.sass.dest));
});
