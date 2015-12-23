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

var dir = gulp.directories;

var TASK_NAME = 'sass';

var config = {
	autoprefixer: gulp.config({
		browsers: [
			'safari >= 5',
			'ie >= 8',
			'ios >= 6',
			'opera >= 12.1',
			'firefox >= 17',
			'chrome >= 30',
			'android >= 4'
		],
		cascade: true
	}, gulp.userConfig.autoprefixer),

	sass: gulp.config({
		src:  p.join(dir.src.sass, '**/*.{sass,scss}'),
		dest: dir.dest.css,
		suffix: true,
		options: {
			outputStyle: 'nested',
			includePaths: [
				p.join(PWD, 'node_modules/spysass/sass'),
				p.join(PWD, 'node_modules/susy/sass'),
				p.join(PWD, 'node_modules/breakpoint-sass/sass')
			],
			imagePath: '../img',
		}
	}, gulp.userConfig[TASK_NAME])
};

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

gulp.task(TASK_NAME, function() {
	if(config.sass.suffix)
		fs.writeFile(config.sass.dest + '.json', JSON.stringify({ suffix: suffix }));

	var pipe = gulp.src(config.sass.src)
		.pipe(sourcemaps.init())
		.pipe(sass(config.sass.options).on('error', errorHandler))
		.pipe(postcss(processors));

	if(config.sass.suffix)
		pipe = pipe.pipe(rename({ suffix: suffix }));

	return pipe.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(config.sass.dest));
});
